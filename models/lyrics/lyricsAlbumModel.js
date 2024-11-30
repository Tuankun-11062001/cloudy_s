const mongoose = require("mongoose");

const LyricsAlbumSchema = new mongoose.Schema(
  {
    albumName: {
      type: String,
    },
    albumImage: {
      type: String,
    },
    song: [
      {
        lyrics: {
          type: mongoose.Types.ObjectId,
          ref: "lyrics",
        },
      },
    ],
    singers: [
      {
        singer: {
          type: mongoose.Types.ObjectId,
          ref: "singers",
        },
      },
    ],
    albumDetail: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const LyricsAlbumModel =
  mongoose.models.albums || mongoose.model("albums", LyricsAlbumSchema);

module.exports = LyricsAlbumModel;
