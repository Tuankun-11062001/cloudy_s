const mongoose = require("mongoose");

const BlogsSchema = new mongoose.Schema(
  {
    public: {
      type: Boolean,
      default: true,
    },
    slider: {
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
    blogContent: {
      type: String,
    },
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

const BlogsModel =
  mongoose.models.blogs || mongoose.model("blogs", BlogsSchema);

module.exports = BlogsModel;
