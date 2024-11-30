const BookChapterModel = require("../../models/books/bookChapterModel");
const BookChapterController = {
  getAllChapter: async (req, res) => {
    try {
      // Tạo một đối tượng để lưu các điều kiện truy vấn
      const queryConditions = {};

      // Lọc theo book
      if (req.query.book) {
        queryConditions.book = req.query.book;
      }

      // Lọc theo title (tên bài hát)
      if (req.query.title) {
        queryConditions.title = { $regex: req.query.title, $options: "i" }; // Tìm kiếm không phân biệt chữ hoa chữ thường
      }

      const chapters = await BookChapterModel.find(queryConditions).populate(
        "book"
      );

      res.status(200).send({
        message: "Get all books success",
        status: 200,
        data: chapters,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  findChaptersByBook: async (req, res) => {
    try {
      const idBook = req.params.id;
      const chapter = await BookChapterModel.find({ book: idBook });
      if (!chapter) {
        return res.status(404).send({
          message: "Not found Chapter",
          status: 404,
          data: {},
        });
      }
      res.status(200).send({
        message: "Get chapter Success",
        data: chapter,
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

  findChapter: async (req, res) => {
    try {
      const idChapter = req.params.id;

      const chapter = await BookChapterModel.findById(idChapter);

      if (!chapter) {
        return res.status(404).send({
          message: "Not found Chapter",
          status: 404,
          data: {},
        });
      }

      res.status(200).send({
        message: "Get chapter Success",
        data: chapter,
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

  createChapter: async (req, res) => {
    try {
      const body = req.body;

      const chapterExist = await BookChapterModel.findOne({
        title: body.title,
      });

      if (chapterExist) {
        return res.status(404).send({
          message: "Book Exist",
          status: 404,
          data: chapterExist,
        });
      }

      const newChapter = new BookChapterModel(body);
      await newChapter.save();

      const chapters = await BookChapterModel.find().populate("book");

      res.status(200).send({
        message: "Create lyrics Success",
        status: 200,
        data: chapters,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  updateChapter: async (req, res) => {
    try {
      const newBody = req.body;
      const idChapter = req.params.id;

      const updateChapter = await BookChapterModel.findByIdAndUpdate(
        idChapter,
        newBody,
        {
          new: true,
        }
      );

      if (!updateChapter) {
        return res.status(404).send({
          status: 404,
          message: "Books not Found",
          data: [],
        });
      }

      const chapters = await BookChapterModel.find().populate("book");

      res.status(201).send({
        status: 201,
        message: `Update Chapter ${updateChapter.title} Success`,
        data: chapters,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  deleteChapter: async (req, res) => {
    try {
      const id = req.params.id;
      const chapterDelete = await BookChapterModel.findByIdAndDelete({
        _id: id,
      });
      const chapters = await BookChapterModel.find().populate("book");

      res.status(200).send({
        status: 200,
        message: `Delete Blog ${chapterDelete.title} success`,
        data: chapters,
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

module.exports = BookChapterController;
