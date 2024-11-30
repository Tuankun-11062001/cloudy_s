const selfRouter = require("express").Router();
const selfController = require("../../controllers/profiles/profileController");

selfRouter.get("/", selfController.getProfile);
selfRouter.get("/:id", selfController.findProfile);
selfRouter.post("/create", selfController.createProfile);
selfRouter.put("/:id", selfController.editProfile);
selfRouter.delete("/:id", selfController.deleteProfile);

module.exports = selfRouter;
