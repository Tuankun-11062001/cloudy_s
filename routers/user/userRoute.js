const userRouter = require("express").Router();
const userController = require("../../controllers/user/userController");

userRouter.get("/", userController.getAllUser);
userRouter.get("/newlatest", userController.getNewlatestUser);
userRouter.get("/find/:id", userController.findUser);
userRouter.post("/create", userController.createUser);
userRouter.put("/changePassword/:id", userController.changePassword);
userRouter.put("/:id", userController.editUser);
userRouter.delete("/:id", userController.deleteUser);

module.exports = userRouter;
