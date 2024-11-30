const { models } = require("mongoose");
const EventModel = require("../../models/event/eventModel");

const eventController = {
  getEvent: async (req, res) => {
    try {
      const event = await EventModel.find();
      res.status(200).send({
        message: "Get event Success",
        data: event,
        status: 200,
      });
    } catch (error) {
      res.status(500).send({
        message: "Sever Error",
        status: 500,
        error,
      });
    }
  },
  createEvent: async (req, res) => {
    try {
      const body = req.body;

      const newEvent = new EventModel(body);
      await newEvent.save();

      const event = await EventModel.find();

      res.status(200).send({
        message: "Create event Success",
        data: event,
        status: 200,
      });
    } catch (error) {
      res.status(500).send({
        message: "Sever Error",
        status: 500,
        error,
      });
    }
  },

  editEvent: async (req, res) => {
    try {
      const idEvent = req.params.id;
      const body = req.body;

      const newEvent = await EventModel.findByIdAndUpdate(idEvent, body, {
        new: true,
      });

      if (!newEvent) {
        return res.status(404).send({
          message: "Can't change event",
          status: 404,
        });
      }

      const event = await EventModel.find();

      res.status(200).send({
        message: "Edit event Success",
        data: event,
        status: 200,
      });
    } catch (error) {
      res.status(500).send({
        message: "Sever Error",
        status: 500,
        error,
      });
    }
  },
};

module.exports = eventController;
