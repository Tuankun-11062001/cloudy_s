const mongoose = require("mongoose");

const LyricsSingerSchema = new mongoose.Schema(
  {
    singerName: {
      type: String,
    },
    singerImage: {
      type: String,
    },
    singerSocial: [
      {
        nameSocial: {
          type: String,
        },
        linkSocial: {
          type: String,
        },
      },
    ],
    singerCountry: {
      type: mongoose.Types.ObjectId,
      ref: "country",
    },

    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const LyricsSingerModel =
  mongoose.models.singers || mongoose.model("singers", LyricsSingerSchema);

module.exports = LyricsSingerModel;
