const mongoose = require("mongoose");

const connect = async () => {
  try {
    mongoose.connect(process.env.MONGOOSE_DB);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("MongoDB connected successfully!");
    });
    connection.on("error", (err) => {
      console.log("MongoDB connection error.", err);
      process.exit();
    });
  } catch (error) {
    console.log("Can't connect to Mongoose", error);
  }
};

module.exports = connect;
