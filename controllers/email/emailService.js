const nodemailer = require("nodemailer");

// Cấu hình transporter cho Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 456,
  secure: true,
  logger: true,
  debug: true,
  secureConnection: false,
  auth: {
    user: "cloudymelody11062001@gmail.com", // Thay bằng email của bạn
    pass: process.env.PASSWORD_GOOGLE, // Thay bằng mật khẩu ứng dụng của bạn
  },
});

// Hàm gửi email
const sendNotificationEmail = (toUser, subject, content) => {
  const mailOptions = {
    from: "cloudymelody11062001@gmail.com",
    to: toUser, // Email của admin
    subject: subject, // Tiêu đề email
    html: content,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

module.exports = sendNotificationEmail;
