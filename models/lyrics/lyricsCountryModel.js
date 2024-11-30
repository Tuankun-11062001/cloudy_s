const mongoose = require("mongoose");

const LyricsCountrySchema = new mongoose.Schema(
  {
    countryName: {
      type: String,
    },
    countryImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const LyricsCountryModel =
  mongoose.models.country || mongoose.model("country", LyricsCountrySchema);

module.exports = LyricsCountryModel;
