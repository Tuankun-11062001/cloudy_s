const ProfileModel = require("../../models/profiles/profileModel");

const profileController = {
  getProfile: async (req, res) => {
    try {
      const profile = await ProfileModel.find().populate(
        "user",
        "-userPassword"
      );

      res.status(200).send({
        message: "Get Self success",
        status: 200,
        data: profile,
      });
    } catch (error) {
      res.status(404).send({
        message: "Fail",
        status: 404,
        data: [],
        err: error,
      });
    }
  },
  findProfile: async (req, res) => {
    try {
      const id = req.params.id;
      const profile = await ProfileModel.findById(id).populate(
        "user",
        "-userPassword"
      );

      res.status(200).send({
        message: "Get Self success",
        status: 200,
        data: profile,
      });
    } catch (error) {
      res.status(404).send({
        message: "Fail",
        status: 404,
        data: [],
        err: error,
      });
    }
  },

  createProfile: async (req, res) => {
    try {
      const body = req.body;
      const newProfile = new ProfileModel(body);
      await newProfile.save();

      res.status(200).send({
        message: "Create Success",
        status: 200,
        data: body,
      });
    } catch (error) {
      res.status(404).send({
        message: "Fail",
        status: 404,
        data: [],
        err: error,
      });
    }
  },

  editProfile: async (req, res) => {
    try {
      const id = req.params.id;
      const body = req.body;

      const updateProfile = await ProfileModel.findByIdAndUpdate(id, body, {
        new: true,
      });

      if (!updateProfile) {
        return res.status(404).send({
          message: "Can't edit profile",
          status: 404,
        });
      }

      const profiles = await ProfileModel.find().populate(
        "user",
        "-userPassword"
      );

      res.status(200).send({
        message: "edit Success",
        status: 200,
        data: profiles,
      });
    } catch (error) {
      res.status(404).send({
        message: "Fail",
        status: 404,
        data: [],
        err: error,
      });
    }
  },

  deleteProfile: async (req, res) => {
    try {
      const id = req.params.id;

      const deleteProfile = await ProfileModel.deleteOne({ _id: id });

      if (deleteProfile.deletedCount > 0) {
        res.status(200).send({
          message: "Delete Self Succes",
          status: 200,
          data: { id },
        });
      } else {
        res.status(404).send({
          message: "No document found to delete",
          status: 404,
          data: [],
        });
      }
    } catch (error) {
      res.status(404).send({
        message: "Fail",
        status: 404,
        data: [],
        err: error,
      });
    }
  },
};

module.exports = profileController;
