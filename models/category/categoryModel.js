const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
    },
    categoryImage: {
      type: String,
    },
    categoryType: {
      type: String,
      enum: ["lyrics", "blogs", "book", "shop"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CategoryModel =
  mongoose.models.categories || mongoose.model("categories", CategorySchema);

module.exports = CategoryModel;
