const shopRoute = require("express").Router();
const shopController = require("../../controllers/shop/shopController");

shopRoute.get("/", shopController.getAllProduct);
shopRoute.get("/category/:id", shopController.getProductWithCategory);
shopRoute.get("/:id", shopController.findProduct);
shopRoute.post("/create", shopController.createProduct);
shopRoute.post("/updateView", shopController.updateView);
shopRoute.put("/:id", shopController.updateProduct);
shopRoute.delete("/:id", shopController.deleteProduct);
shopRoute.post("/:id/cloudy", shopController.cloudyProduct);

module.exports = shopRoute;
