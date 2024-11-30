const PartnerModel = require("../../models/shop/partnerModel");

const partnerController = {
  getAllPartner: async (req, res) => {
    try {
      const partners = await PartnerModel.find();
      res.status(200).send({
        message: `Get Partner Success`,
        data: partners,
        status: 200,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  createPartner: async (req, res) => {
    try {
      const bodyPartner = req.body;

      const newPartner = new PartnerModel(bodyPartner);

      await newPartner.save();

      const partners = await PartnerModel.find();

      res.status(200).send({
        message: `Create partner Success`,
        data: partners,
        status: 200,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  editPartner: async (req, res) => {
    try {
      const idPartner = req.params.id;
      const body = req.body;

      const updatePartner = await PartnerModel.findByIdAndUpdate(
        idPartner,
        body,
        { new: true }
      );

      if (!updatePartner) {
        return res.satatus(404).send({
          message: "Not found Partner",
          status: 404,
        });
      }

      const partners = await PartnerModel.find();

      res.status(200).send({
        message: "Update partner Success",
        data: partners,
        status: 200,
        dataUpdate: updatePartner,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  deletePartner: async (req, res) => {
    try {
      const id = req.params.id;
      const partner = await PartnerModel.findByIdAndDelete({ _id: id });
      const partners = await PartnerModel.find();
      res.status(200).send({
        status: 200,
        message: `Delete partner success`,
        data: partners,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },
};

module.exports = partnerController;
