const CommunicationModel = require("../../models/communication/communicationModel");
const sendNotificationEmail = require("../email/emailService");

const communicationController = {
  getAllCommunication: async (req, res) => {
    try {
      const queryConditions = {};
      // Lấy số trang và số lượng sản phẩm mỗi trang từ query
      const page = parseInt(req.query.page) || 1; // Default là trang 1
      const limit = parseInt(req.query.limit) || 10; // Default là 10 sản phẩm mỗi trang
      // Tính số bản ghi cần bỏ qua (skip) và giới hạn số bản ghi (limit)
      const skip = (page - 1) * limit;

      // Lọc theo country
      if (req.query.userId) {
        queryConditions.user = req.query.userId;
      }

      // Truy vấn tổng số sản phẩm để tính tổng số trang
      const totalCommunications = await CommunicationModel.countDocuments(
        queryConditions
      );

      const communications = await CommunicationModel.find(queryConditions)
        .skip(skip)
        .limit(limit)
        .populate(
          "user",
          "-userPassword -admin -userSocial -createdAt -updatedAt"
        )
        .populate({
          path: "comments.user", // populate user trong comments
          model: "users",
          select:
            "-userPassword -userEmail -admin -userSocial -createdAt -updatedAt",
        })
        .populate({
          path: "comments.reply.user", // populate user trong comments reply
          model: "users",
          select:
            "-userPassword -userEmail -admin -userSocial -createdAt -updatedAt",
        });

      // Tính tổng số trang
      const totalPages = Math.ceil(totalCommunications / limit);

      res.status(200).send({
        message: "Success",
        status: 200,
        data: communications,
        pagination: {
          page: page,
          limit: limit,
          totalCommunications: totalCommunications,
          totalPages: totalPages,
        },
      });
    } catch (error) {
      res.status(404).send({
        message: "Fail",
        status: 200,
        data: [],
      });
    }
  },

  createCommunication: async (req, res) => {
    try {
      const body = req.body;
      const newCommunictaion = new CommunicationModel(body);
      await newCommunictaion.save();
      const getAllCommunication = await CommunicationModel.find().populate(
        "user"
      );

      res.status(200).send({
        message: "Success",
        status: 200,
        data: getAllCommunication,
      });
    } catch (error) {
      res.status(404).send({
        message: "Fail",
        status: 404,
        data: {},
      });
    }
  },

  updateCommunication: async (req, res) => {
    try {
      const idCommunication = req.params.id;
      const newBody = req.body;

      // Cập nhật và lấy bản ghi đã cập nhật
      const updatedCommunication = await CommunicationModel.findByIdAndUpdate(
        idCommunication,
        newBody,
        { new: true } // Trả về bản ghi đã được cập nhật
      ).populate("user");

      if (!updatedCommunication) {
        return res.status(404).send({
          message: "Communication not found",
          status: 404,
          data: {},
        });
      }

      // Gửi thông báo email nếu có yêu cầu
      if (newBody.checkContent) {
        await sendNotificationEmail(
          updatedCommunication.user.userEmail,
          "Check your Content",
          "Your Communication Safe"
        );
      }

      const getAllCommunication = await CommunicationModel.find({}).populate(
        "user",
        "-userPassword -admin -userSocial"
      );

      res.status(200).send({
        message: "Success",
        status: 200,
        data: getAllCommunication,
        bodyUpdate: updatedCommunication,
      });
    } catch (error) {
      res.status(500).send({
        message: "Internal server error",
        status: 500,
        data: {},
        error: error,
        bodyUpdate: {},
      });
    }
  },

  deleteCommunication: async (req, res) => {
    try {
      const idCommunication = req.params.id;

      // Tìm kiếm và xóa trong một bước
      const communication = await CommunicationModel.findByIdAndDelete(
        idCommunication
      ).populate("user");

      if (!communication) {
        return res.status(404).send({
          message: "Communication not found",
          status: 404,
          data: {},
        });
      }

      // Gửi thông báo email
      await sendNotificationEmail(
        communication.user.userEmail,
        "Your Content has been Deleted from Cloudy Communication",
        "Your content is not good"
      );

      // Lấy tất cả bản ghi sau khi xóa
      const getAllCommunication = await CommunicationModel.find().populate(
        "user"
      );

      res.status(200).send({
        message: "Success",
        status: 200,
        data: getAllCommunication,
      });
    } catch (error) {
      res.status(500).send({
        message: "Internal server error",
        status: 500,
        data: {},
      });
    }
  },

  cloudyCommunication: async (req, res) => {
    try {
      const idCommunication = req.params.id;
      const userId = req.body.userId; // Giả sử bạn gửi userId trong body

      // Tìm Communication theo ID
      const communication = await CommunicationModel.findById(idCommunication);

      if (!communication) {
        return res.status(404).send({
          message: "Communication not found",
          status: 404,
          data: {},
        });
      }

      // Kiểm tra xem user đã like chưa
      const userLiked = communication.cloudy.some(
        (item) => item.user.toString() === userId
      );

      if (userLiked) {
        // Nếu đã like, xóa user khỏi mảng cloudy
        communication.cloudy = communication.cloudy.filter(
          (item) => item.user.toString() !== userId
        );
      } else {
        // Nếu chưa like, thêm user vào mảng cloudy
        communication.cloudy.push({ user: userId });
      }

      // Cập nhật Communication với mảng cloudy mới
      const updatedCommunication = await communication.save();

      res.status(200).send({
        message: "Success",
        status: 200,
        data: updatedCommunication,
      });
    } catch (error) {
      console.error(error); // Ghi log lỗi ra console
      res.status(500).send({
        message: "Internal server error",
        status: 500,
        data: {},
      });
    }
  },

  commnetCommunication: async (req, res) => {
    try {
      const { id } = req.params;
      const { userId, content } = req.body;

      const communication = await CommunicationModel.findById(id);
      if (!communication) {
        return res.status(404).json({ message: "Communication not found" });
      }

      const newComment = {
        user: userId,
        content,
        cloudy: [],
        reply: [],
      };

      communication.comments.push(newComment);
      await communication.save();

      return res.status(201).send({
        message: "Add Comment Success",
        status: 201,
        data: communication,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Server error", status: 500, data: {} });
    }
  },

  commentReplyCommunication: async (req, res) => {
    try {
      const { id, commentId } = req.params;
      const { userId, content } = req.body; // userId và content từ request body

      // Tìm communication bằng ID
      const communication = await CommunicationModel.findById(id);
      if (!communication) {
        return res.status(404).json({ message: "Communication not found" });
      }

      // Tìm comment trong communication
      const comment = communication.comments.id(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      // Tạo đối tượng reply mới
      const replyToAdd = {
        user: userId,
        content,
      };

      // Thêm reply vào comment
      comment.reply.push(replyToAdd);
      await communication.save();

      return res.status(201).json({
        message: "Reply added successfully",
        status: 201,
        data: comment,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Server error", status: 500, error });
    }
  },
};

module.exports = communicationController;
