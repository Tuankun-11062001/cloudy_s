const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },

    content: [
      {
        titleHead: {
          type: String,
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

const ProfileModel =
  mongoose.models.profiles || mongoose.model("profiles", ProfileSchema);

module.exports = ProfileModel;
