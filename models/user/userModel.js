const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    avatar: {
      type: String,
      default:
        "https://i.pinimg.com/564x/f6/3e/2f/f63e2fa676d8bd34ed21cc48f449dffd.jpg",
    },
    banner: {
      type: String,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      unique: true,
      required: true,
    },
    userPassword: {
      type: String,
      required: true,
    },
    userDetail: {
      type: String,
    },
    userSocial: [
      {
        social: String,
        linkSocial: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("userPassword")) {
      return next(); // Chỉ hash mật khẩu nếu trường password được sửa hoặc mới
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.userPassword, salt);
    this.userPassword = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const UserModel = mongoose.models.users || mongoose.model("users", UserSchema);

module.exports = UserModel;
