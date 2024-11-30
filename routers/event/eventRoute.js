const eventRouter = require("express").Router();
const eventController = require("../../controllers/event/eventController");

eventRouter.get("/", eventController.getEvent);
eventRouter.post("/create", eventController.createEvent);
eventRouter.put("/:id", eventController.editEvent);

module.exports = eventRouter;
