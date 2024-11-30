const mongoose = require("mongoose");

const PartnerSchema = new mongoose.Schema(
  {
    partnerName: {
      type: String,
    },
    partnerImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const PartnerModel =
  mongoose.models.partners || mongoose.model("partners", PartnerSchema);

module.exports = PartnerModel;
