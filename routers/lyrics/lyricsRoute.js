const lyricsRouter = require("express").Router();
const lyricsCountryController = require("../../controllers/lyrics/lyricsCountryController");
const lyricsSingerCountroller = require("../../controllers/lyrics/lyricsSingerController");
const lyricsAlbumController = require("../../controllers/lyrics/lyricsAlbumsController");
const LyricsController = require("../../controllers/lyrics/lyricsController");

// country

lyricsRouter.get("/country", lyricsCountryController.getAllCountry);
lyricsRouter.post("/country/create", lyricsCountryController.createCountry);
lyricsRouter.delete("/country/:id", lyricsCountryController.deleteCountry);

// album

lyricsRouter.get("/album", lyricsAlbumController.getAllAlbums);
lyricsRouter.post("/album/create", lyricsAlbumController.createAlbum);
lyricsRouter.delete("/album/:id", lyricsAlbumController.deleteAlbum);

// singer

lyricsRouter.get("/singer", lyricsSingerCountroller.getAllSinger);
lyricsRouter.get(
  "/singerByCountry",
  lyricsSingerCountroller.getSingerByCountry
);
lyricsRouter.post("/singer/create", lyricsSingerCountroller.createSinger);
lyricsRouter.put("/singer/update/:id", lyricsSingerCountroller.updateSinger);
lyricsRouter.delete("/singer/:id", lyricsSingerCountroller.deleteSinger);

// lyrics

lyricsRouter.get("/", LyricsController.getAllLyrics);
lyricsRouter.get("/topSong", LyricsController.getTopSongLyrics);
lyricsRouter.get("/:id", LyricsController.findLyrics);
lyricsRouter.get("/category/:id", LyricsController.getCategoryWithCountry);
lyricsRouter.get("/country/:id", LyricsController.getCountryWithCategories);
lyricsRouter.post("/create", LyricsController.createLyrics);
lyricsRouter.post("/updateView", LyricsController.updateView);
lyricsRouter.put("/:id", LyricsController.updateLyrics);
lyricsRouter.put("/translate/:id", LyricsController.updateUserTranslate);
lyricsRouter.delete("/:id", LyricsController.deleteLyrics);
lyricsRouter.delete(
  "/:id/translate/:translateId",
  LyricsController.deleteUserTranslate
);
lyricsRouter.post("/:id/cloudy", LyricsController.cloudyLyrics);
lyricsRouter.post("/:id/comment", LyricsController.commnentLyrics);
lyricsRouter.delete("/:id/comment/:commentId", LyricsController.deleteComment);

// lyricsRouter.delete("/:id", categoryController.deleteCategory);

module.exports = lyricsRouter;
