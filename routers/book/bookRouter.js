const bookRouter = require("express").Router();
const bookController = require("../../controllers/book/bookController");

bookRouter.get("/", bookController.getAllBook);
bookRouter.get("/topblog", bookController.getTopBook);
bookRouter.get("/lastestBlog", bookController.lastestBook);
bookRouter.get("/recommend/:id", bookController.getBookByCategory);
bookRouter.get("/:id", bookController.findBook);
// bookRouter.get("/country/:id", bookController.getCountryWithCategories);
bookRouter.post("/create", bookController.createBook);
bookRouter.post("/updateView", bookController.updateView);
bookRouter.put("/:id", bookController.updateBook);
bookRouter.delete("/:id", bookController.deleteBook);
bookRouter.post("/:id/cloudy", bookController.cloudyBook);
bookRouter.post("/:id/comment", bookController.commnentBook);
bookRouter.delete("/:id/comment/:commentId", bookController.deleteComment);

module.exports = bookRouter;
