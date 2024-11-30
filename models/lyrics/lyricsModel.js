const mongoose = require("mongoose");

const LyricsSchema = new mongoose.Schema(
  {
    public: {
      type: Boolean,
      default: true,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    slider: {
      type: Boolean,
      default: false,
    },
    thumbnailBanner: {
      type: String,
    },
    view: {
      type: Number,
      default: 0,
    },
    share: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    linkYoutube: {
      type: String,
    },
    singer: {
      type: mongoose.Types.ObjectId,
      ref: "singers",
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "categories",
    },
    country: {
      type: mongoose.Types.ObjectId,
      ref: "country",
    },
    release: {
      type: String,
    },
    description: {
      type: String,
    },
    lyrics: {
      type: String,
    },
    chords: {
      type: String,
    },
    explain: {
      type: String,
    },
    cloudy: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: "users",
        },
      },
    ],

    translate: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: "users",
        },
        language: {
          type: String,
        },
        userLyrics: {
          type: String,
        },
        userChords: {
          type: String,
        },
        userExplain: {
          type: String,
        },
        userLikes: [
          {
            user: {
              type: mongoose.Types.ObjectId,
              ref: "users",
            },
          },
        ],
      },
    ],

    comments: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: "users",
        },
        content: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const LyricsModel =
  mongoose.models.lyrics || mongoose.model("lyrics", LyricsSchema);

module.exports = LyricsModel;
