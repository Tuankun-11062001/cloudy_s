const blogsRouter = require("express").Router();
const blogsController = require("../../controllers/blogs/blogsController");

blogsRouter.get("/", blogsController.getAllBlogs);
blogsRouter.get("/topblog", blogsController.getTopBlogs);
blogsRouter.get("/lastestBlog", blogsController.lastestBlog);
blogsRouter.get("/recommend/:id", blogsController.getBlogByCategory);
blogsRouter.get("/:id", blogsController.findBlog);
// blogsRouter.get("/country/:id", blogsController.getCountryWithCategories);
blogsRouter.post("/create", blogsController.createBlog);
blogsRouter.post("/updateView", blogsController.updateView);
blogsRouter.put("/:id", blogsController.updateBlog);
blogsRouter.delete("/:id", blogsController.deleteBlog);
blogsRouter.post("/:id/cloudy", blogsController.cloudyBlog);
blogsRouter.post("/:id/comment", blogsController.commnentBlog);
blogsRouter.delete("/:id/comment/:commentId", blogsController.deleteComment);

module.exports = blogsRouter;
