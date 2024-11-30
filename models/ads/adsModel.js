const mongoose = require("mongoose");

const AdsSchema = new mongoose.Schema(
  {
    public: {
      type: Boolean,
      default: true,
    },
    popUp: {
      type: Boolean,
      default: false,
    },
    bottom: {
      type: Boolean,
      default: false,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    horizal: {
      type: Boolean,
      default: false,
    },
    partnerAds: {
      type: String,
    },
    detail: {
      type: String,
    },
    imageAds: {
      type: String,
    },
    imageVerticalAds: {
      type: String,
    },
    linkAds: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const AdsModel = mongoose.models.ads || mongoose.model("ads", AdsSchema);

module.exports = AdsModel;
