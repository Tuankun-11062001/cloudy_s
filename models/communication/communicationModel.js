const mongoose = require("mongoose");

const CommunicationSchema = new mongoose.Schema(
  {
    public: {
      type: Boolean,
      default: true,
    },
    checkContent: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
    },
    feeling: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    cloudy: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: "users",
        },
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
        cloudy: [
          {
            user: {
              type: mongoose.Types.ObjectId,
              ref: "users",
            },
          },
        ],
        reply: [
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
    ],
  },
  {
    timestamps: true,
  }
);

const CommunicationModel =
  mongoose.models.communications ||
  mongoose.model("communications", CommunicationSchema);

module.exports = CommunicationModel;
