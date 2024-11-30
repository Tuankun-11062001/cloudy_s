const authController = require("../../controllers/auth/authController");
const authRouter = require("express").Router();

authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);

module.exports = authRouter;
