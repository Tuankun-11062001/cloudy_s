const AdsModel = require("../../models/ads/adsModel");
const adsController = {
  getAllAds: async (req, res) => {
    try {
      const queryConditions = {};

      if (req.query.public) {
        queryConditions.public = req.query.public === "true"; // Chuyển đổi chuỗi sang boolean
      }

      if (req.query.popUp) {
        queryConditions.popUp = req.query.popUp === "true";
      }

      if (req.query.bottom) {
        queryConditions.bottom = req.query.bottom === "true";
      }

      if (req.query.vertical) {
        queryConditions.vertical = req.query.vertical === "true";
      }

      if (req.query.horizal) {
        queryConditions.horizal = req.query.horizal === "true";
      }

      const ads = await AdsModel.find(queryConditions);

      res.status(200).send({
        message: "Get Ads Success",
        data: ads,
        status: 200,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",

        status: 500,
      });
    }
  },
  findAds: async (req, res) => {
    try {
      const idAds = req.params.id;

      const ad = await AdsModel.findById(idAds);

      if (!ad) {
        return res.status(404).send({
          message: "cant found ad",
          status: 404,
        });
      }

      res.status(200).send({
        message: "Get Ad Success",
        data: ad,
        status: 200,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",

        status: 500,
      });
    }
  },
  createAd: async (req, res) => {
    try {
      const body = req.body;

      const ad = new AdsModel(body);

      await ad.save();

      const ads = await AdsModel.find();

      res.status(200).send({
        message: "Create Ad Success",
        data: ads,
        status: 200,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",

        status: 500,
      });
    }
  },

  editAds: async (req, res) => {
    try {
      const adId = req.params.id;

      const body = req.body;

      const ad = await AdsModel.findByIdAndUpdate(adId, body, { new: true });

      if (!ad) {
        return res.status(404).send({
          message: "cant found ad",
          status: 404,
        });
      }

      const ads = await AdsModel.find();

      res.status(200).send({
        message: "Edit Ad Success",
        data: ads,
        status: 200,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",

        status: 500,
      });
    }
  },

  deleteAd: async (req, res) => {
    try {
      const adId = req.params.id;

      const ad = await AdsModel.findByIdAndDelete(adId, { new: true });

      const ads = await AdsModel.find();

      res.status(200).send({
        message: "Delete Ad Success",
        data: ads,
        status: 200,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",

        status: 500,
      });
    }
  },
};

module.exports = adsController;
