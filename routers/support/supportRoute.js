const supportRouter = require("express").Router();
const supportController = require("../../controllers/support/supportController");

supportRouter.get("/", supportController.getSupport);
supportRouter.post("/create", supportController.createSupport);
supportRouter.put("/:id", supportController.editSupport);

module.exports = supportRouter;
