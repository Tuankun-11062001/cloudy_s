const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema(
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
    trending: {
      type: Boolean,
      default: false,
    },
    myProduct: {
      type: Boolean,
      default: false,
    },
    season: {
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
    imageProduct: [
      {
        linkImage: {
          type: String,
        },
      },
    ],
    linkProduct: {
      type: String,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "categories",
    },
    partner: {
      type: mongoose.Types.ObjectId,
      ref: "partners",
    },
    price: {
      type: String,
    },

    description: {
      type: String,
    },

    content: {
      type: String,
    },

    release: {
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
  },
  {
    timestamps: true,
  }
);

const ShopModel = mongoose.models.shops || mongoose.model("shops", ShopSchema);

module.exports = ShopModel;
