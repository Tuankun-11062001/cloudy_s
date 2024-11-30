const LyricsAlbumsModel = require("../../models/lyrics/lyricsAlbumModel");
const lyricsAlbumsController = {
  getAllAlbums: async (req, res) => {
    try {
      const albums = await LyricsAlbumsModel.find();

      res.status(200).send({
        message: "Get all albums success",
        status: 200,
        data: albums,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },
  createAlbum: async (req, res) => {
    try {
      const body = req.body;

      const albumExist = await LyricsAlbumsModel.findOne({
        albumName: body.albumName,
      });

      if (albumExist) {
        return res.status(404).send({
          message: "Album Exist",
          status: 404,
          data: albumExist,
        });
      }

      const newAlbum = new LyricsAlbumsModel(body);
      await newAlbum.save();

      const albums = await LyricsAlbumsModel.find();

      res.status(200).send({
        message: "Create album Success",
        status: 200,
        data: albums,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  deleteAlbum: async (req, res) => {
    try {
      const id = req.params.id;
      const albumDelete = await LyricsAlbumsModel.findByIdAndDelete({
        _id: id,
      });
      const albums = await LyricsAlbumsModel.find();
      res.status(200).send({
        status: 200,
        message: `Delete album ${albumDelete.albumName} success`,
        data: albums,
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

module.exports = lyricsAlbumsController;
