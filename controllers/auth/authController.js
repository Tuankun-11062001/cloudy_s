const UserModel = require("../../models/user/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendNotificationEmail = require("../email/emailService");

const authController = {
  // login

  login: async (req, res) => {
    try {
      const body = req.body;
      const user = await UserModel.findOne({ userEmail: body.userEmail });

      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "User or password is incorrect",
        });
      }

      const isPasswordValid = await bcrypt.compare(
        body.userPassword,
        user.userPassword
      );

      if (!isPasswordValid) {
        return res.status(401).json({
          status: 401,
          message: "User or password is incorrect",
        });
      }

      const { userPassword, ...other } = user._doc;

      return res.status(200).send({
        message: "Login Success",
        status: 200,
        data: {
          ...other,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred during login",
        status: 500,
        err: error.message,
      });
    }
  },

  //   register
  register: async (req, res) => {
    try {
      const body = req.body;

      const user = await UserModel.findOne({
        userEmail: body.userEmail,
      });

      if (user) {
        if (user.userName === body.userName) {
          return res.status(403).send({
            status: 403,
            message: "User already exists",
          });
        }

        if (user.userEmail === body.userEmail) {
          return res.status(403).send({
            status: 403,
            message: "Email already exists",
          });
        }
      }

      const newUser = new UserModel(body);

      await newUser.save();

      sendNotificationEmail(
        body.userEmail,
        "Welcome to Cloudy Melody",
        `<html>
        <head>
        <style>
                  body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    color: #333;
                    margin: 0;
                    padding: 0;
                  }
                  .email-container {
                    background-color: #fff;
                    padding: 20px;
                    max-width: 600px;
                    margin: 30px auto;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                  }
                  .email-header {
                    text-align: center;
                    color: #4CAF50;
                  }
                  .email-body {
                    font-size: 16px;
                    line-height: 1.5;
                    margin-top: 20px;
                  }
                  .footer {
                    text-align: center;
                    font-size: 14px;
                    color: #777;
                    margin-top: 40px;
                  }
                </style>
        </head>
         <body>
                <div class="email-container">
                  <div class="email-header">
                    <h1>Welcome to Cloudy Melody</h1>
                  </div>
                  <div class="email-body">
                    <p>Nice to meet you. We are excited to have you with us. We hope our website will help you with everything you need.</p>
                    <p>Thank you for joining!</p>
                  </div>
                  <div class="footer">
                    <p>Best regards,<br>The Cloudy Melody Team</p>
                  </div>
                </div>
              </body>
        </html>`
      );

      res.status(200).send({
        message: "Create user successfull",
        status: 200,
      });
    } catch (error) {
      res.status(404).send({
        message: "Fail",
        status: 404,
        data: [],
        err: error,
      });
    }
  },
};

module.exports = authController;
