const CategoryModel = require("../../models/category/categoryModel");

const categoryController = {
  getAllCategory: async (req, res) => {
    try {
      const query = req.query.q;
      const categories = await CategoryModel.find({ categoryType: query });
      res.status(200).send({
        message: `Get Category of ${query} Success`,
        categoryType: query,
        data: categories,
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

  createCategory: async (req, res) => {
    try {
      const bodyCategory = req.body;

      const newCategory = new CategoryModel(bodyCategory);

      await newCategory.save();

      const categories = await CategoryModel.find({
        categoryType: bodyCategory.categoryType,
      });

      res.status(200).send({
        message: `Create category of ${bodyCategory.categoryType} Success`,
        categoryType: bodyCategory.categoryType,
        data: categories,
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

  editCategory: async (req, res) => {
    try {
      const idCategory = req.params.id;
      const body = req.body;
      const query = req.query.q;
      const updateCategory = await CategoryModel.findByIdAndUpdate(
        idCategory,
        body,
        { new: true }
      );

      if (!updateCategory) {
        return res.status(404).send({
          message: `Category with ID ${idCategory} not found`,
          status: 404,
        });
      }

      const categories = await CategoryModel.find({ categoryType: query });
      res.status(200).send({
        message: `Update Category of ${query} Success`,
        categoryType: query,
        data: categories,
        dataUpdate: updateCategory,
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

  deleteCategory: async (req, res) => {
    try {
      const id = req.params.id;
      const category = await CategoryModel.findByIdAndDelete({ _id: id });
      const categories = await CategoryModel.find({
        categoryType: category.categoryType,
      });
      res.status(200).send({
        status: 200,
        message: `Delete Category ${category.categoryName} success`,
        data: categories,
        categoryType: category.categoryType,
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

module.exports = categoryController;
