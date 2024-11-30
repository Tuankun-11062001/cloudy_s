const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    bannerCategoryLyrics: {
      type: String,
    },
    bannerCategorySinger: {
      type: String,
    },

    bannerCategoryBlog: {
      type: String,
    },

    listAvatar: [
      {
        avatar: {
          type: String,
        },
      },
    ],
    listBannerProfile: [
      {
        banner: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const EventModel =
  mongoose.models.events || mongoose.model("events", eventSchema);

module.exports = EventModel;
