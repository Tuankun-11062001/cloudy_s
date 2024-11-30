const mongoose = require("mongoose");

const BookChapterSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Types.ObjectId,
      ref: "books", // Tham chiếu đến sách chứa chương này
    },
    title: {
      type: String,
    },
    content: {
      type: String, // Nội dung của chương
    },
    index: {
      type: Number, // Đánh số chương
    },
  },
  {
    timestamps: true,
  }
);

const BookChapterModel =
  mongoose.models.chapters || mongoose.model("chapters", BookChapterSchema);

module.exports = BookChapterModel;
