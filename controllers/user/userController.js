const UserModel = require("../../models/user/userModel");
const bcrypt = require("bcrypt");

const userController = {
  getAllUser: async (req, res) => {
    try {
      const queryConditions = {};
      // Lấy số trang và số lượng sản phẩm mỗi trang từ query
      const page = parseInt(req.query.page) || 1; // Default là trang 1
      const limit = parseInt(req.query.limit) || 25; // Default là 10 sản phẩm mỗi trang
      // Tính số bản ghi cần bỏ qua (skip) và giới hạn số bản ghi (limit)
      const skip = (page - 1) * limit;

      // Truy vấn tổng số sản phẩm để tính tổng số trang
      const totalUsers = await UserModel.countDocuments(queryConditions);

      const users = await UserModel.find()
        .skip(skip)
        .limit(limit)
        .select("-userPassword");

      // Tính tổng số trang
      const totalPages = Math.ceil(totalUsers / limit);

      res.status(200).send({
        message: "Get All User Success",
        data: users,
        status: 200,
        pagination: {
          page: page,
          limit: limit,
          totalUsers: totalUsers,
          totalPages: totalPages,
        },
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
      });
    }
  },

  getNewlatestUser: async (req, res) => {
    try {
      const users = await UserModel.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("-userPassword");

      res.status(200).send({
        message: "Get All User Success",
        data: users,
        status: 200,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
      });
    }
  },

  findUser: async (req, res) => {
    try {
      const idUser = req.params.id;
      const user = await UserModel.findById(idUser).select("-userPassword");
      if (!user) {
        return res.status(404).send({
          message: "Not found User",
          status: 404,
        });
      }
      res.status(200).send({
        message: "Get User success",
        status: 200,
        data: user,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
      });
    }
  },

  createUser: async (req, res) => {
    try {
      const body = req.body;

      // check user exist

      const existUser = await UserModel.findOne({ userEmail: body.userEmail });

      if (existUser) {
        return res.status(404).send({
          message: "User has Exist",
          status: 404,
        });
      }

      const newUser = new UserModel(body);
      await newUser.save();

      const users = await UserModel.find().select("-password");

      res.status(200).send({
        message: "Create user Success",
        data: users,
        status: 200,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
      });
    }
  },

  changePassword: async (req, res) => {
    try {
      const id = req.params.id;
      const body = req.body;

      const user = await UserModel.findById(id);

      if (!user) {
        return res.status(404).send({
          status: 404,
          message: "User not found",
        });
      }

      // check admin
      const { admin } = user;

      if (admin && body._id !== id) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(body.newPassword, salt);

        // Cập nhật mật khẩu của người dùng
        const updatedUser = await UserModel.findByIdAndUpdate(
          body._id,
          { userPassword: hashedPassword },
          { new: true }
        );
        if (!updatedUser) {
          return res.status(404).send({
            status: 404,
            message: "User not found",
          });
        }

        return res.status(200).send({
          message: "Admin changed password successfully",
          status: 200,
        });
      }

      // Nếu người dùng không phải admin, chỉ được phép thay đổi mật khẩu của chính mình
      if (!admin && body._id !== id) {
        return res.status(403).send({
          message: "You are not allowed to change another user's password",
          status: 403,
        });
      }

      // Tạo mật khẩu mới cho người dùng
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(body.newPassword, salt);

      // Cập nhật mật khẩu của người dùng
      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { userPassword: hashedPassword },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).send({
          status: 404,
          message: "User not found",
        });
      }

      res.status(200).send({
        message: "Change Password Success",

        status: 200,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
      });
    }
  },

  editUser: async (req, res) => {
    try {
      const idUser = req.params.id;
      const body = req.body;
      const updateUser = await UserModel.findByIdAndUpdate(idUser, body, {
        new: true,
      });

      if (!updateUser) {
        return res.status(404).send({
          status: 404,
          message: "User not Found",
          data: [],
        });
      }
      const users = await UserModel.find().select("-userPassword");

      res.status(200).send({
        message: "Update user Success",
        data: users,
        status: 200,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
      });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const id = req.params.id;
      const { userId } = req.query;

      const user = await UserModel.findById(id);

      if (!user) {
        return res.status(404).send({
          status: 404,
          message: "User not found",
        });
      }

      // check admin
      const { admin } = user;

      if (admin && id !== userId) {
        const user = await UserModel.findByIdAndDelete(userId);
        if (!user) {
          return res.status(404).send({
            status: 404,
            message: "User not found",
          });
        }

        const users = await UserModel.find().select("-userPassword");

        return res.status(200).send({
          message: "Admin delete User successfully",
          status: 200,
          data: users,
        });
      }

      // Nếu không phải admin và cố gắng xóa người dùng khác
      if (!admin && id !== userId) {
        return res.status(403).send({
          message: "You are not allowed to delete another user",
          status: 403,
        });
      }

      // Trả về thông báo xóa thành công và danh sách người dùng không có mật khẩu
      const deleteUser = await UserModel.findByIdAndDelete(id);
      if (!deleteUser) {
        return res.status(404).send({
          status: 404,
          message: "User not found",
        });
      }

      const users = await UserModel.find().select("-userPassword");

      res.status(200).send({
        message: "Delete Success",
        status: 200,
        data: users,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
      });
    }
  },
};

module.exports = userController;
