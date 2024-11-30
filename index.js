const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connect = require("./db/connect");

const app = express();

// Add Route

// ==== auth ===
const authRouter = require("./routers/auth/authRoute");

// ==== user ===
const userRouter = require("./routers/user/userRoute");

// ==== Category ===
const categoryRouter = require("./routers/category/categoryRoute");

// ==== communication ===
const communicationRouter = require("./routers/communication/communicationRoute");

// ==== Lyrics =====
const lyricsRouter = require("./routers/lyrics/lyricsRoute");

// ==== Blogs =====
const blogsRouter = require("./routers/blog/blogRoute");

// ==== Books =====
const booksRouter = require("./routers/book/bookRouter");
const chapterRouter = require("./routers/book/chapterRouter");

// ==== shop =====
const partnerRouter = require("./routers/shop/partnerRoute");
const shopRoute = require("./routers/shop/shopRoute");

// ==== profile =====
const profileRouter = require("./routers/profiles/profileRoute");

// ==== profile =====
const supportRouter = require("./routers/support/supportRoute");

// ==== profile =====
const eventRouter = require("./routers/event/eventRoute");

// ==== profile =====
const adsRouter = require("./routers/ads/adsRoute");

// add DB
connect();

app.use(cors());
app.use(express.json());

// auth
app.use("/auth", authRouter);

// user
app.use("/user", userRouter);

// communication
app.use("/communication", communicationRouter);

// category

app.use("/category", categoryRouter);

// lyrics

app.use("/lyrics", lyricsRouter);

// Blogs

app.use("/blogs", blogsRouter);

// Book

app.use("/books", booksRouter);
app.use("/chapters", chapterRouter);

// shop

app.use("/partner", partnerRouter);
app.use("/shop", shopRoute);

// profiles
app.use("/profile", profileRouter);

// support
app.use("/support", supportRouter);

// event
app.use("/event", eventRouter);

// event
app.use("/ads", adsRouter);

app.listen(3003, () => console.log("server listening on :3003"));
