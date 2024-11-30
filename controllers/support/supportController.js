const SupportModel = require("../../models/support/supportModel");

const supportController = {
  getSupport: async (req, res) => {
    try {
      const support = await SupportModel.find().populate({
        path: "feedback.user", // populate user trong comments reply
        model: "users",
        select: "-userPassword -userSocial -admin",
      });

      res.status(200).send({
        message: "Get Support Success",
        status: 200,
        data: support,
      });
    } catch (error) {
      res.status(500).send({
        message: "Sever Error",
        error,
      });
    }
  },
  createSupport: async (req, res) => {
    try {
      const body = req.body;
      const newSupport = new SupportModel(body);
      await newSupport.save();

      const support = await SupportModel.find();

      res.status(200).send({
        message: "Create support success",
        data: support,
        status: 200,
      });
    } catch (error) {
      res.status(500).send({
        message: "Sever Error",
        error,
      });
    }
  },
  editSupport: async (req, res) => {
    try {
      const id = req.params.id;
      const body = req.body;

      const updateSupport = await SupportModel.findByIdAndUpdate(id, body, {
        new: true,
      });

      if (!updateSupport) {
        return res.status(404).send({
          message: "cant update support",
          status: 404,
        });
      }

      const support = await SupportModel.find().populate({
        path: "feedback.user", // populate user trong comments reply
        model: "users",
        select: "-userPassword -userSocial -admin",
      });

      res.status(200).send({
        status: 200,
        message: "Update support success",
        data: support,
      });
    } catch (error) {
      res.status(500).send({
        message: "Sever Error",
        error,
      });
    }
  },
};

module.exports = supportController;
