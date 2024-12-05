const BlogsModel = require("../../models/blogs/blogsModel");
const BlogsController = {
  getAllBlogs: async (req, res) => {
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

      // Lọc theo public
      if (req.query.public) {
        queryConditions.public = req.query.public === "true";
      }

      // Lọc theo title (tên bài hát)
      if (req.query.title) {
        queryConditions.title = { $regex: req.query.title, $options: "i" }; // Tìm kiếm không phân biệt chữ hoa chữ thường
      }

      const blogs = await BlogsModel.find(queryConditions).populate("category");

      res.status(200).send({
        message: "Get all blogs success",
        status: 200,
        data: blogs,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  getTopBlogs: async (req, res) => {
    try {
      // Tìm 10 bài hát mới nhất, sắp xếp theo thời gian tạo (createdAt) giảm dần
      const latestBlogs = await BlogsModel.find({ public: true })
        .sort({ createdAt: -1 }) // Sắp xếp giảm dần theo thời gian tạo
        .limit(5) // Giới hạn số lượng bài hát trả về là 10

        .populate("category"); // Lấy thông tin category nếu cần

      res.status(200).json({
        message: "Get Latest blogs success",
        status: 200,
        data: latestBlogs,
      });
    } catch (error) {
      console.error("Error fetching latest songs:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },

  getBlogByCategory: async (req, res) => {
    try {
      const idCategory = req.params.id;
      const blogs = await BlogsModel.find({ category: idCategory })
        .sort({ createdAt: -1 })
        .populate("category")
        .limit(8)
        .exec();

      res.status(200).send({
        message: "Get recomment success",
        data: blogs,
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

  lastestBlog: async (req, res) => {
    try {
      // Truy vấn tìm các bài viết
      const blogs = await BlogsModel.aggregate([
        // Nhóm theo category
        {
          $group: {
            _id: "$category", // Nhóm theo category (ObjectId)
            blogs: {
              $push: {
                _id: "$_id",
                title: "$title",
                thumbnail: "$thumbnail",
                view: "$view",
                release: "$release",
                description: "$description",
                blogContent: "$blogContent",
                cloudy: "$cloudy",
                createdAt: "$createdAt",
              },
            },
          },
        },
        // Cắt lấy 8 bài viết mới nhất trong mỗi thể loại
        {
          $project: {
            _id: 1,
            blogs: { $slice: ["$blogs", 0, 8] }, // Chỉ lấy 8 bài viết đầu tiên
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
            blogs: 1, // Mảng chứa các bài viết
          },
        },
      ]);

      res.status(200).json({
        message: "Get lastest blog succes",
        status: 200,
        data: blogs,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "server Error",
        error: error,
      });
    }
  },

  findBlog: async (req, res) => {
    try {
      const idBlogs = req.params.id;

      const blogs = await BlogsModel.findById(idBlogs)
        .populate("category")
        .populate({
          path: "comments.user", // populate user trong comments reply
          model: "users",
          select: "-userPassword -userSocial -admin",
        });

      if (!blogs) {
        return res.status(404).send({
          message: "Not found Blogs",
          status: 404,
          data: {},
        });
      }

      res.status(200).send({
        message: "Get Blogs Success",
        data: blogs,
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

  createBlog: async (req, res) => {
    try {
      const body = req.body;

      const blogsExist = await BlogsModel.findOne({
        title: body.title,
      });

      if (blogsExist) {
        return res.status(404).send({
          message: "Blogs Exist",
          status: 404,
          data: blogsExist,
        });
      }

      const newBlogs = new BlogsModel(body);
      await newBlogs.save();

      const blogs = await BlogsModel.find().populate("category");

      res.status(200).send({
        message: "Create lyrics Success",
        status: 200,
        data: blogs,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  updateBlog: async (req, res) => {
    try {
      const newBody = req.body;
      const idBlog = req.params.id;

      const updateBlogs = await BlogsModel.findByIdAndUpdate(idBlog, newBody, {
        new: true,
      });

      if (!updateBlogs) {
        return res.status(404).send({
          status: 404,
          message: "Blogs not Found",
          data: [],
        });
      }

      const Blogs = await BlogsModel.find().populate("category");

      res.status(201).send({
        status: 201,
        message: `Update Blogs ${updateBlogs.title} Success`,
        data: Blogs,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  updateView: async (req, res) => {
    const { id } = req.body; // ID của bài hát cần cập nhật view

    try {
      // Tìm bài hát theo ID và tăng lượt xem
      const blogs = await BlogsModel.findById(id);
      if (blogs) {
        blogs.view += 1; // Tăng lượt xem
        await blogs.save(); // Lưu lại
        res.status(200).json({ message: "View updated successfully" });
      } else {
        res.status(404).json({ message: "blog not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },

  deleteBlog: async (req, res) => {
    try {
      const id = req.params.id;
      const blogDelete = await BlogsModel.findByIdAndDelete({
        _id: id,
      });
      const blogs = await BlogsModel.find().populate("category");

      res.status(200).send({
        status: 200,
        message: `Delete Blog ${blogDelete.title} success`,
        data: blogs,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  cloudyBlog: async (req, res) => {
    try {
      const idBlog = req.params.id;
      const userId = req.body.userId; // Giả sử bạn gửi userId trong body

      // Tìm Communication theo ID
      const blog = await BlogsModel.findById(idBlog);

      if (!blog) {
        return res.status(404).send({
          message: "Blog not found",
          status: 404,
          data: {},
        });
      }

      // Kiểm tra xem user đã like chưa
      const userLiked = blog.cloudy.some(
        (item) => item.user.toString() === userId
      );

      if (userLiked) {
        // Nếu đã like, xóa user khỏi mảng cloudy
        blog.cloudy = blog.cloudy.filter(
          (item) => item.user.toString() !== userId
        );
      } else {
        // Nếu chưa like, thêm user vào mảng cloudy
        blog.cloudy.push({ user: userId });
      }

      // Cập nhật Communication với mảng cloudy mới
      const updateBlogs = await blog.save();

      res.status(200).send({
        message: "Success",
        status: 200,
        data: updateBlogs,
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

  commnentBlog: async (req, res) => {
    try {
      const { id } = req.params;
      const { userId, content } = req.body;

      const blog = await BlogsModel.findById(id);
      if (!blog) {
        return res.status(404).json({ message: "blogs not found" });
      }

      const newComment = {
        user: userId,
        content,
        cloudy: [],
      };

      blog.comments.push(newComment);
      await blog.save();

      return res.status(201).send({
        message: "Add Comment Success",
        status: 201,
        data: blog,
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
      const updatedBlog = await BlogsModel.findByIdAndUpdate(
        id,
        { $pull: { comments: { _id: commentId } } }, // Xóa item translate với translateId
        { new: true } // Trả về document đã cập nhật
      );

      if (!updatedBlog) {
        return res.status(404).json({ message: "Lyrics not found" });
      }

      const BlogData = await BlogsModel.findById(id)

        .populate("category")

        .populate({
          path: "comments.user", // populate user trong comments reply
          model: "users",
          select: "-userPassword -userSocial -admin",
        });

      res.status(200).send({
        message: "Comment item deleted successfully",
        data: BlogData,
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

module.exports = BlogsController;
