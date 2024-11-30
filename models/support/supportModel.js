const mongoose = require("mongoose");

const SupportSchema = new mongoose.Schema(
  {
    banner: {
      type: String,
    },
    content: [
      {
        titleContent: {
          type: String,
        },
        content: {
          type: String,
        },
      },
    ],

    feedback: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: "users",
        },
        content: {
          type: String,
        },
        check: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const SupportModel =
  mongoose.models.supports || mongoose.model("supports", SupportSchema);

module.exports = SupportModel;
