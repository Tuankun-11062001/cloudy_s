const BooksModel = require("../../models/books/booksModel");
const BookController = {
  getAllBook: async (req, res) => {
    try {
      // Tạo một đối tượng để lưu các điều kiện truy vấn
      const queryConditions = {};

      // Lọc theo category
      if (req.query.category) {
        queryConditions.category = req.query.category;
      }

      // Lọc theo slider
      if (req.query.slider) {
        queryConditions.slider = req.query.slider === "true";
      }

      if (req.query.trending) {
        queryConditions.trending = req.query.trending === "true"; // Chuyển đổi chuỗi sang boolean
      }

      // Lọc theo public
      if (req.query.public) {
        queryConditions.public = req.query.public === "true";
      }

      // Lọc theo title (tên bài hát)
      if (req.query.title) {
        queryConditions.title = { $regex: req.query.title, $options: "i" }; // Tìm kiếm không phân biệt chữ hoa chữ thường
      }

      const books = await BooksModel.find(queryConditions)
        .populate("category")
        .populate({
          path: "chapters.chapter",
          model: "chapters",
          select: "-content",
        });

      res.status(200).send({
        message: "Get all books success",
        status: 200,
        data: books,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  getTopBook: async (req, res) => {
    try {
      // Tìm 10 bài hát mới nhất, sắp xếp theo thời gian tạo (createdAt) giảm dần
      const latestBooks = await BooksModel.find({ public: true })
        .sort({ createdAt: -1 }) // Sắp xếp giảm dần theo thời gian tạo
        .limit(5) // Giới hạn số lượng bài hát trả về là 10

        .populate("category"); // Lấy thông tin category nếu cần

      res.status(200).json({
        message: "Get Latest books success",
        status: 200,
        data: latestBooks,
      });
    } catch (error) {
      console.error("Error fetching latest songs:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },

  getBookByCategory: async (req, res) => {
    try {
      const idCategory = req.params.id;
      const books = await BooksModel.find({ category: idCategory })
        .sort({ createdAt: -1 })
        .populate("category")
        .limit(8)
        .exec();

      res.status(200).send({
        message: "Get recomment success",
        data: books,
        status: 200,
      });
    } catch (error) {
      res.status(500).send({
        message: "Get recomment eror",
        error,
        status: 500,
      });
    }
  },

  lastestBook: async (req, res) => {
    try {
      // Truy vấn tìm các bài viết
      const books = await BooksModel.aggregate([
        // Nhóm theo category
        {
          $group: {
            _id: "$category", // Nhóm theo category (ObjectId)
            books: {
              $push: {
                _id: "$_id",
                title: "$title",
                thumbnail: "$thumbnail",
                view: "$view",
                release: "$release",
                description: "$description",
                chapter: "$chapter",
                cloudy: "$cloudy",
                createdAt: "$createdAt",
                chapters: "$chapters",
              },
            },
          },
        },
        // Cắt lấy 8 bài viết mới nhất trong mỗi thể loại
        {
          $project: {
            _id: 1,
            books: { $slice: ["$books", 0, 8] }, // Chỉ lấy 8 bài viết đầu tiên
          },
        },
        // Populate thông tin của category (tên và mô tả)
        {
          $lookup: {
            from: "categories", // Tên collection categories (hoặc bảng thể loại)
            localField: "_id", // Trường _id của nhóm (category) từ Blogs
            foreignField: "_id", // Trường _id trong collection categories
            as: "categoryInfo", // Lưu thông tin category vào categoryInfo
          },
        },
        // Giải nén thông tin categoryInfo từ mảng
        {
          $unwind: "$categoryInfo",
        },
        {
          $project: {
            _id: 1,
            categoryInfo: 1, // Thông tin về category
            books: 1, // Mảng chứa các bài viết
          },
        },
      ]);

      res.status(200).json({
        message: "Get lastest book succes",
        status: 200,
        data: books,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "server Error",
        error: error,
      });
    }
  },

  findBook: async (req, res) => {
    try {
      const idBook = req.params.id;

      const book = await BooksModel.findById(idBook)
        .populate("category")
        .populate({
          path: "chapters.chapter",
          model: "chapters",
          select: "-content",
        })
        .populate({
          path: "comments.user", // populate user trong comments reply
          model: "users",
          select: "-userPassword -userSocial -admin",
        });

      if (!book) {
        return res.status(404).send({
          message: "Not found Book",
          status: 404,
          data: {},
        });
      }

      res.status(200).send({
        message: "Get Blogs Success",
        data: book,
        status: 200,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  createBook: async (req, res) => {
    try {
      const body = req.body;

      const bookExist = await BooksModel.findOne({
        title: body.title,
      });

      if (bookExist) {
        return res.status(404).send({
          message: "Book Exist",
          status: 404,
          data: bookExist,
        });
      }

      const newBook = new BooksModel(body);
      await newBook.save();

      const books = await BooksModel.find().populate("category");

      res.status(200).send({
        message: "Create lyrics Success",
        status: 200,
        data: books,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  updateBook: async (req, res) => {
    try {
      const newBody = req.body;
      const idBook = req.params.id;

      const updateBooks = await BooksModel.findByIdAndUpdate(idBook, newBody, {
        new: true,
      });

      if (!updateBooks) {
        return res.status(404).send({
          status: 404,
          message: "Books not Found",
          data: [],
        });
      }

      const Books = await BooksModel.find().populate("category");

      res.status(201).send({
        status: 201,
        message: `Update Blogs ${updateBooks.title} Success`,
        data: Books,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  deleteBook: async (req, res) => {
    try {
      const id = req.params.id;
      const bookDelete = await BooksModel.findByIdAndDelete({
        _id: id,
      });
      const books = await BooksModel.find().populate("category");

      res.status(200).send({
        status: 200,
        message: `Delete Blog ${bookDelete.title} success`,
        data: books,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  cloudyBook: async (req, res) => {
    try {
      const idBook = req.params.id;
      const userId = req.body.userId; // Giả sử bạn gửi userId trong body

      // Tìm Communication theo ID
      const book = await BooksModel.findById(idBook);

      if (!book) {
        return res.status(404).send({
          message: "Blog not found",
          status: 404,
          data: {},
        });
      }

      // Kiểm tra xem user đã like chưa
      const userLiked = book.cloudy.some(
        (item) => item.user.toString() === userId
      );

      if (userLiked) {
        // Nếu đã like, xóa user khỏi mảng cloudy
        book.cloudy = book.cloudy.filter(
          (item) => item.user.toString() !== userId
        );
      } else {
        // Nếu chưa like, thêm user vào mảng cloudy
        book.cloudy.push({ user: userId });
      }

      // Cập nhật Communication với mảng cloudy mới
      const updateBook = await book.save();

      res.status(200).send({
        message: "Success",
        status: 200,
        data: updateBook,
      });
    } catch (error) {
      console.error(error); // Ghi log lỗi ra console
      res.status(500).send({
        message: "Internal server error",
        status: 500,
        data: {},
      });
    }
  },

  commnentBook: async (req, res) => {
    try {
      const { id } = req.params;
      const { userId, content } = req.body;

      const book = await BooksModel.findById(id);
      if (!book) {
        return res.status(404).json({ message: "book not found" });
      }

      const newComment = {
        user: userId,
        content,
        cloudy: [],
      };

      book.comments.push(newComment);
      await book.save();

      return res.status(201).send({
        message: "Add Comment Success",
        status: 201,
        data: book,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Server error", status: 500, data: {} });
    }
  },
  deleteComment: async (req, res) => {
    try {
      const { id, commentId } = req.params; // id là id của blog, translateId là id của translate

      // Tìm document blog và xóa item trong mảng translate
      const updatedBook = await BooksModel.findByIdAndUpdate(
        id,
        { $pull: { comments: { _id: commentId } } }, // Xóa item translate với translateId
        { new: true } // Trả về document đã cập nhật
      );

      if (!updatedBook) {
        return res.status(404).json({ message: "Books not found" });
      }

      const BookData = await BooksModel.findById(id)

        .populate("category")

        .populate({
          path: "comments.user", // populate user trong comments reply
          model: "users",
          select: "-userPassword -userSocial -admin",
        });

      res.status(200).send({
        message: "Comment item deleted successfully",
        data: BookData,
        status: 200,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },
};

module.exports = BookController;
