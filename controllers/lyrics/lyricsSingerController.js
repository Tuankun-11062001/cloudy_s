const LyricsSingerModel = require("../../models/lyrics/lyricsSingerModel");

const LyricsSinger = require("../../models/lyrics/lyricsSingerModel");
const LyricsSingerController = {
  getAllSinger: async (req, res) => {
    try {
      const singers = await LyricsSinger.find().populate("singerCountry");

      res.status(200).send({
        message: "Get all singer success",
        status: 200,
        data: singers,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  getTopSinger: async (req, res) => {
    try {
      const singers = await LyricsSinger.find()
        .sort({ createdAt: -1 }) // Sắp xếp giảm dần theo thời gian tạo
        .limit(10) // Giới hạn số lượng bài hát trả về là 10
        .populate("singerCountry");

      res.status(200).send({
        message: "Get Top singer success",
        status: 200,
        data: singers,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  getSingerByCountry: async (req, res) => {
    try {
      const singers = await LyricsSingerModel.find().populate("singerCountry");

      const result = singers.reduce((acc, singer) => {
        const country = singer.singerCountry.countryName;
        if (!acc[country]) {
          acc[country] = [];
        }

        acc[country].push(singer);
        return acc;
      }, {});

      res.status(200).send({
        message: "Get singer by Country Success",
        status: 200,
        data: result,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  createSinger: async (req, res) => {
    try {
      const body = req.body;

      const singerExist = await LyricsSinger.findOne({
        singerName: body.singerName,
      });

      if (singerExist) {
        return res.status(404).send({
          message: "Singer Exist",
          status: 404,
          data: singerExist,
        });
      }

      const newSinger = new LyricsSinger(body);
      await newSinger.save();

      const singers = await LyricsSinger.find().populate("singerCountry");

      res.status(200).send({
        message: "Create singer Success",
        status: 200,
        data: singers,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  updateSinger: async (req, res) => {
    try {
      const newBody = req.body;
      const idSinger = req.params.id;

      const updateSinger = await LyricsSingerModel.findByIdAndUpdate(
        idSinger,
        newBody,
        { new: true }
      );

      if (!updateSinger) {
        return res.status(404).send({
          status: 404,
          message: "Singer not Found",
          data: [],
        });
      }

      const singers = await LyricsSingerModel.find()
        .populate("singerAlbums")
        .populate("singerCountry");

      res.status(201).send({
        status: 201,
        message: `Update singer ${updateSinger.singerName} Success`,
        data: singers,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  deleteSinger: async (req, res) => {
    try {
      const id = req.params.id;
      const singerDelete = await LyricsSinger.findByIdAndDelete({
        _id: id,
      });
      const singers = await LyricsSinger.find();
      res.status(200).send({
        status: 200,
        message: `Delete Singer ${singerDelete.singerName} success`,
        data: singers,
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

module.exports = LyricsSingerController;
