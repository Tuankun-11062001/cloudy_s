const chapterRouter = require("express").Router();
const chapterController = require("../../controllers/chapter/chapterController");

chapterRouter.get("/", chapterController.getAllChapter);
chapterRouter.get("/book/:id", chapterController.findChaptersByBook);
chapterRouter.get("/:id", chapterController.findChapter);
chapterRouter.post("/create", chapterController.createChapter);
chapterRouter.put("/:id", chapterController.updateChapter);
chapterRouter.delete("/:id", chapterController.deleteChapter);

module.exports = chapterRouter;
