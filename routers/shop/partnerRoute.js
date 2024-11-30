const partnerRouter = require("express").Router();
const partnerController = require("../../controllers/shop/partnerController");

partnerRouter.get("/", partnerController.getAllPartner);
partnerRouter.post("/create", partnerController.createPartner);
partnerRouter.put("/:id", partnerController.editPartner);
partnerRouter.delete("/:id", partnerController.deletePartner);

module.exports = partnerRouter;
