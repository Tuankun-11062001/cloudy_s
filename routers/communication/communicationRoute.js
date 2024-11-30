const communicationRouter = require("express").Router();
const communicationController = require("../../controllers/communication/communicationController");

communicationRouter.get("/", communicationController.getAllCommunication);
communicationRouter.post(
  "/create",
  communicationController.createCommunication
);

communicationRouter.put(
  "/update/:id",
  communicationController.updateCommunication
);

communicationRouter.delete(
  "/delete/:id",
  communicationController.deleteCommunication
);

communicationRouter.post(
  "/:id/cloudy",
  communicationController.cloudyCommunication
);

communicationRouter.post(
  "/:id/comment",
  communicationController.commnetCommunication
);

communicationRouter.post(
  "/:id/comment/:commentId/replies",
  communicationController.commentReplyCommunication
);

module.exports = communicationRouter;
