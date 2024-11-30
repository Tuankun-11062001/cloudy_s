const mongoose = require("mongoose");

const BooksSchema = new mongoose.Schema(
  {
    public: {
      type: Boolean,
      default: true,
    },
    slider: {
      type: Boolean,
      default: false,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    thumbnailBanner: {
      type: String,
    },
    view: {
      type: Number,
      default: 0,
    },
    share: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
    },
    author: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    linkYoutube: {
      type: String,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "categories",
    },
    release: {
      type: String,
    },
    description: {
      type: String,
    },
    chapters: [
      {
        chapter: {
          type: mongoose.Types.ObjectId,
          ref: "chapters",
        },
      },
    ],
    cloudy: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: "users",
        },
      },
    ],

    comments: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: "users",
        },
        content: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const BooksModel =
  mongoose.models.books || mongoose.model("books", BooksSchema);

module.exports = BooksModel;
