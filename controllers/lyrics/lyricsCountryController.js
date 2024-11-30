const LyricsCountryModel = require("../../models/lyrics/lyricsCountryModel");
const lyricsCountryController = {
  getAllCountry: async (req, res) => {
    try {
      const country = await LyricsCountryModel.find();

      res.status(200).send({
        message: "Get all country success",
        status: 200,
        data: country,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },
  createCountry: async (req, res) => {
    try {
      const body = req.body;

      const countryExist = await LyricsCountryModel.findOne({
        countryName: body.countryName,
      });

      if (countryExist) {
        return res.status(404).send({
          message: "Country Exist",
          status: 404,
          data: countryExist,
        });
      }

      const newCountry = new LyricsCountryModel(body);
      await newCountry.save();

      const country = await LyricsCountryModel.find();

      res.status(200).send({
        message: "Create Country Success",
        status: 200,
        data: country,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  deleteCountry: async (req, res) => {
    try {
      const id = req.params.id;
      const countryDelete = await LyricsCountryModel.findByIdAndDelete({
        _id: id,
      });
      const country = await LyricsCountryModel.find();
      res.status(200).send({
        status: 200,
        message: `Delete Country ${countryDelete.countryName} success`,
        data: country,
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

module.exports = lyricsCountryController;
