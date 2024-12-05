const ShopModel = require("../../models/shop/shopModel");

const shopController = {
  getAllProduct: async (req, res) => {
    try {
      // Tạo một đối tượng để lưu các điều kiện truy vấn
      const queryConditions = {};

      // Lọc theo category
      if (req.query.category) {
        queryConditions.category = req.query.category;
      }

      // Lọc theo country
      if (req.query.partner) {
        queryConditions.partner = req.query.partner;
      }

      // Lọc theo season
      if (req.query.season) {
        queryConditions.season = req.query.season;
      }

      // Lọc theo trending
      if (req.query.trending) {
        queryConditions.trending = req.query.trending === "true"; // Chuyển đổi chuỗi sang boolean
      }

      // Lọc theo slider
      if (req.query.slider) {
        queryConditions.slider = req.query.slider === "true";
      }

      // Lọc theo public
      if (req.query.public) {
        queryConditions.public = req.query.public === "true";
      }

      // Lọc theo myproduct
      if (req.query.myProduct) {
        queryConditions.myProduct = req.query.myProduct === "true";
      }

      // Lọc theo title (tên bài hát)
      if (req.query.title) {
        queryConditions.title = { $regex: req.query.title, $options: "i" }; // Tìm kiếm không phân biệt chữ hoa chữ thường
      }

      // Lấy số trang và số lượng sản phẩm mỗi trang từ query
      const page = parseInt(req.query.page) || 1; // Default là trang 1
      const limit = parseInt(req.query.limit) || 10; // Default là 10 sản phẩm mỗi trang
      // Tính số bản ghi cần bỏ qua (skip) và giới hạn số bản ghi (limit)
      const skip = (page - 1) * limit;

      // Truy vấn tổng số sản phẩm để tính tổng số trang
      const totalProducts = await ShopModel.countDocuments(queryConditions);

      // Truy vấn sản phẩm theo các điều kiện lọc, skip và limit
      const products = await ShopModel.find(queryConditions)
        .skip(skip)
        .limit(limit)
        .populate("category")
        .populate("partner");

      // Tính tổng số trang
      const totalPages = Math.ceil(totalProducts / limit);

      res.status(200).send({
        message: "Get all product success",
        status: 200,
        data: products,
        pagination: {
          page: page,
          limit: limit,
          totalProducts: totalProducts,
          totalPages: totalPages,
        },
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },
  findProduct: async (req, res) => {
    try {
      const idProduct = req.params.id;

      const product = await ShopModel.findById(idProduct)
        .populate("category")
        .populate("partner");

      if (!product) {
        return res.status(404).send({
          message: "Not found Product",
          status: 404,
          data: {},
        });
      }

      res.status(200).send({
        message: "Get Product Success",
        data: product,
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

  getProductWithCategory: async (req, res) => {
    try {
      const idCategory = req.params.id;

      const products = await ShopModel.find({ category: idCategory })
        .sort({ createdAt: -1 })
        .populate("category")
        .populate("partner");

      if (!products) {
        return res.status(404).send({
          message: "Cant not get product by category",
          status: 404,
        });
      }

      res.status(200).send({
        message: "Get product by category success",
        status: 200,
        data: products,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  createProduct: async (req, res) => {
    try {
      const body = req.body;

      const productExist = await ShopModel.findOne({
        title: body.title,
      });

      if (productExist) {
        return res.status(404).send({
          message: "Product Exist",
          status: 404,
          data: productExist,
        });
      }

      const newProduct = new ShopModel(body);
      await newProduct.save();

      const products = await ShopModel.find()
        .sort({ createdAt: -1 })
        .populate("category")
        .populate("partner");

      res.status(200).send({
        message: "Create Product Success",
        status: 200,
        data: products,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const newBody = req.body;
      const idProduct = req.params.id;

      const updateProduct = await ShopModel.findByIdAndUpdate(
        idProduct,
        newBody,
        { new: true }
      );

      if (!updateProduct) {
        return res.status(404).send({
          status: 404,
          message: "lyrics not Found",
          data: [],
        });
      }

      const products = await ShopModel.find()
        .populate("category")
        .populate("partner");

      res.status(201).send({
        status: 201,
        message: `Update product ${updateProduct.title} Success`,
        data: products,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  updateView: async (req, res) => {
    const { id } = req.body; // ID của bài hát cần cập nhật view

    try {
      // Tìm bài hát theo ID và tăng lượt xem
      const shop = await ShopModel.findById(id);
      if (shop) {
        shop.view += 1; // Tăng lượt xem
        await shop.save(); // Lưu lại
        res.status(200).json({ message: "View updated successfully" });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const id = req.params.id;
      const productDelete = await ShopModel.findByIdAndDelete({
        _id: id,
      });
      const products = await ShopModel.find()
        .populate("category")
        .populate("partner");
      res.status(200).send({
        status: 200,
        message: `Delete product ${productDelete.title} success`,
        data: products,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  cloudyProduct: async (req, res) => {
    try {
      const idProduct = req.params.id;
      const userId = req.body.userId; // Giả sử bạn gửi userId trong body

      // Tìm Communication theo ID
      const product = await ShopModel.findById(idProduct);

      if (!product) {
        return res.status(404).send({
          message: "Porduct not found",
          status: 404,
          data: {},
        });
      }

      // Kiểm tra xem user đã like chưa
      const userLiked = product.cloudy.some(
        (item) => item.user.toString() === userId
      );

      if (userLiked) {
        // Nếu đã like, xóa user khỏi mảng cloudy
        product.cloudy = product.cloudy.filter(
          (item) => item.user.toString() !== userId
        );
      } else {
        // Nếu chưa like, thêm user vào mảng cloudy
        product.cloudy.push({ user: userId });
      }

      // Cập nhật Communication với mảng cloudy mới
      const updateProduct = await product.save();

      res.status(200).send({
        message: "Success",
        status: 200,
        data: updateProduct,
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
};

module.exports = shopController;
