const adsRouter = require("express").Router();
const adsController = require("../../controllers/ads/adsController");

adsRouter.get("/", adsController.getAllAds);
adsRouter.get("/:id", adsController.findAds);
adsRouter.post("/create", adsController.createAd);
adsRouter.put("/:id", adsController.editAds);
adsRouter.delete("/:id", adsController.deleteAd);

module.exports = adsRouter;
