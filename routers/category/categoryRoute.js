const categoryRouter = require("express").Router();
const categoryController = require("../../controllers/category/categoryController");

categoryRouter.get("/", categoryController.getAllCategory);
categoryRouter.post("/create", categoryController.createCategory);
categoryRouter.delete("/:id", categoryController.deleteCategory);

module.exports = categoryRouter;
