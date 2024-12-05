const LyricsModel = require("../../models/lyrics/lyricsModel");
const LyricsController = {
  getAllLyrics: async (req, res) => {
    try {
      // Tạo một đối tượng để lưu các điều kiện truy vấn
      const queryConditions = {};

      // Lọc theo category
      if (req.query.category) {
        queryConditions.category = req.query.category;
      }

      // Lọc theo country
      if (req.query.country) {
        queryConditions.country = req.query.country;
      }

      // Lọc theo singer
      if (req.query.singer) {
        queryConditions.singer = req.query.singer;
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

      // Lọc theo title (tên bài hát)
      if (req.query.title) {
        queryConditions.title = { $regex: req.query.title, $options: "i" }; // Tìm kiếm không phân biệt chữ hoa chữ thường
      }

      const lyrics = await LyricsModel.find(queryConditions)
        .populate("singer")
        .populate("category")
        .populate("country");

      res.status(200).send({
        message: "Get all lyrics success",
        status: 200,
        data: lyrics,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  getTopSongLyrics: async (req, res) => {
    try {
      // Tìm 10 bài hát mới nhất, sắp xếp theo thời gian tạo (createdAt) giảm dần
      const latestSongs = await LyricsModel.find({ public: true })
        .sort({ createdAt: -1 }) // Sắp xếp giảm dần theo thời gian tạo
        .limit(10) // Giới hạn số lượng bài hát trả về là 10
        .populate("singer") // Lấy thông tin singer nếu cần
        .populate("category") // Lấy thông tin category nếu cần
        .populate("country"); // Lấy thông tin country nếu cần

      res.status(200).json({
        message: "Get Latest song success",
        status: 200,
        data: latestSongs,
      });
    } catch (error) {
      console.error("Error fetching latest songs:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },

  getCategoryWithCountry: async (req, res) => {
    try {
      const categoryId = req.params.id;

      const lyrics = await LyricsModel.find({ category: categoryId })
        .populate("singer country") // Populates the singer and country fields
        .exec();

      // Tạo đối tượng để phân loại theo country
      const result = lyrics.reduce((acc, lyric) => {
        const country = lyric.country.countryName; // Giả sử country có trường name
        if (!acc[country]) {
          acc[country] = [];
        }
        acc[country].push(lyric);
        return acc;
      }, {});

      // Lấy 5 bài hát mới nhất dành cho slide
      const slideSongs = await LyricsModel.find({ category: categoryId })
        .sort({ createdAt: -1 }) // Sắp xếp theo createdAt giảm dần
        .limit(5) // Giới hạn chỉ lấy 5 bài hát mới nhất
        .populate("singer country");

      res.status(200).json({
        message: "Get detail category success",
        status: 200,
        data: result,
        slideSongs: slideSongs,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  getCountryWithCategories: async (req, res) => {
    try {
      const countryId = req.params.id;

      const lyrics = await LyricsModel.find({ country: countryId })
        .populate("singer country category") // Populates the singer and country fields
        .exec();

      // Tạo đối tượng để phân loại theo country
      const result = lyrics.reduce((acc, lyric) => {
        const category = lyric.category.categoryName; // Giả sử category có trường name
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(lyric);
        return acc;
      }, {});

      // Lấy 5 bài hát mới nhất dành cho slide
      const slideSongs = await LyricsModel.find({ country: countryId })
        .sort({ createdAt: -1 }) // Sắp xếp theo createdAt giảm dần
        .limit(5) // Giới hạn chỉ lấy 5 bài hát mới nhất
        .populate("singer country category");

      res.status(200).json({
        message: "Get detail country success",
        status: 200,
        data: result,
        slideSongs: slideSongs,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  findLyrics: async (req, res) => {
    try {
      const idLyrics = req.params.id;

      const lyrics = await LyricsModel.findById(idLyrics)
        .populate("singer")
        .populate("category")
        .populate("country")
        .populate({
          path: "translate.user", // populate user trong comments reply
          model: "users",
          select: "-userPassword -userSocial -admin",
        })
        .populate({
          path: "comments.user", // populate user trong comments reply
          model: "users",
          select: "-userPassword -userSocial -admin",
        });

      if (!lyrics) {
        return res.status(404).send({
          message: "Not found Lyrics",
          status: 404,
          data: {},
        });
      }

      res.status(200).send({
        message: "Get Lyrics Success",
        data: lyrics,
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

  createLyrics: async (req, res) => {
    try {
      const body = req.body;

      const lyricsExist = await LyricsModel.findOne({
        title: body.title,
      });

      if (lyricsExist) {
        return res.status(404).send({
          message: "Lyrics Exist",
          status: 404,
          data: lyricsExist,
        });
      }

      const newLyrics = new LyricsModel(body);
      await newLyrics.save();

      const lyrics = await LyricsModel.find()
        .populate("singer")
        .populate("category")
        .populate("country");

      res.status(200).send({
        message: "Create lyrics Success",
        status: 200,
        data: lyrics,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  updateLyrics: async (req, res) => {
    try {
      const newBody = req.body;
      const idLyrics = req.params.id;
      console.log(req.body);

      const updateLyrics = await LyricsModel.findByIdAndUpdate(
        idLyrics,
        newBody,
        { new: true }
      );

      if (!updateLyrics) {
        return res.status(404).send({
          status: 404,
          message: "lyrics not Found",
          data: [],
        });
      }

      const lyrics = await LyricsModel.find()
        .populate("singer")
        .populate("category")
        .populate("country")
        .populate("translate");

      res.status(201).send({
        status: 201,
        message: `Update lyrics ${updateLyrics.title} Success`,
        data: lyrics,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  updateUserTranslate: async (req, res) => {
    try {
      const idLyrics = req.params.id;
      const { idTranslate, idUser, data } = req.body;

      // Tìm bài hát theo idLyrics
      const lyrics = await LyricsModel.findById(idLyrics);
      if (!lyrics) {
        return res.status(404).send({
          message: "Lyrics not found",
          status: 404,
        });
      }

      // Dùng map để duyệt qua mảng translate và thay thế bản dịch phù hợp
      lyrics.translate = lyrics.translate.map((translation) => {
        // Nếu id của bản dịch trùng với idTranslate, gán lại dữ liệu
        if (translation._id.toString() === idTranslate) {
          return {
            ...translation, // Giữ nguyên các trường cũ
            userLyrics: data.userLyrics,
            userChords: data.userChords,
            userExplain: data.userExplain,
            language: data.language,
          };
        }
        return translation; // Nếu không trùng, giữ nguyên bản dịch đó
      });

      // Lưu lại bài hát với bản dịch đã cập nhật
      await lyrics.save();

      const lyricsData = await LyricsModel.findById(idLyrics)
        .populate("singer")
        .populate("category")
        .populate("country")
        .populate({
          path: "translate.user", // populate user trong comments reply
          model: "users",
          select: "-userPassword -userSocial -admin",
        });
      res.status(201).send({
        mesage: "update translate success",
        status: 201,
        data: lyricsData,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error,
        status: 500,
      });
    }
  },

  deleteUserTranslate: async (req, res) => {
    try {
      const { id, translateId } = req.params; // id là id của lyrics, translateId là id của translate

      // Tìm document lyrics và xóa item trong mảng translate
      const updatedLyrics = await LyricsModel.findByIdAndUpdate(
        id,
        { $pull: { translate: { _id: translateId } } }, // Xóa item translate với translateId
        { new: true } // Trả về document đã cập nhật
      );

      if (!updatedLyrics) {
        return res.status(404).json({ message: "Lyrics not found" });
      }

      const lyricsData = await LyricsModel.findById(id)
        .populate("singer")
        .populate("category")
        .populate("country")
        .populate({
          path: "translate.user", // populate user trong comments reply
          model: "users",
          select: "-userPassword -userSocial -admin",
        });

      res.status(200).send({
        message: "Translate item deleted successfully",
        data: lyricsData,
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

  deleteLyrics: async (req, res) => {
    try {
      const id = req.params.id;
      const lyricsDelete = await LyricsModel.findByIdAndDelete({
        _id: id,
      });
      const lyrics = await LyricsModel.find()
        .populate("singer")
        .populate("category")
        .populate("country");
      res.status(200).send({
        status: 200,
        message: `Delete Singer ${lyricsDelete.title} success`,
        data: lyrics,
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
      const lyrics = await LyricsModel.findById(id);
      if (lyrics) {
        lyrics.view += 1; // Tăng lượt xem
        await lyrics.save(); // Lưu lại
        res.status(200).json({ message: "View updated successfully" });
      } else {
        res.status(404).json({ message: "Song not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },

  cloudyLyrics: async (req, res) => {
    try {
      const idLyrics = req.params.id;
      const userId = req.body.userId; // Giả sử bạn gửi userId trong body

      // Tìm Communication theo ID
      const lyrics = await LyricsModel.findById(idLyrics);

      if (!lyrics) {
        return res.status(404).send({
          message: "lyrics not found",
          status: 404,
          data: {},
        });
      }

      // Kiểm tra xem user đã like chưa
      const userLiked = lyrics.cloudy.some(
        (item) => item.user.toString() === userId
      );

      if (userLiked) {
        // Nếu đã like, xóa user khỏi mảng cloudy
        lyrics.cloudy = lyrics.cloudy.filter(
          (item) => item.user.toString() !== userId
        );
      } else {
        // Nếu chưa like, thêm user vào mảng cloudy
        lyrics.cloudy.push({ user: userId });
      }

      // Cập nhật Communication với mảng cloudy mới
      const updateLyrics = await lyrics.save();

      res.status(200).send({
        message: "Success",
        status: 200,
        data: updateLyrics,
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

  commnentLyrics: async (req, res) => {
    try {
      const { id } = req.params;
      const { userId, content } = req.body;

      const lyrics = await LyricsModel.findById(id);
      if (!lyrics) {
        return res.status(404).json({ message: "lyrics not found" });
      }

      const newComment = {
        user: userId,
        content,
        cloudy: [],
        reply: [],
      };

      lyrics.comments.push(newComment);
      await lyrics.save();

      return res.status(201).send({
        message: "Add Comment Success",
        status: 201,
        data: lyrics,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Server error", status: 500, data: {} });
    }
  },
  deleteComment: async (req, res) => {
    try {
      const { id, commentId } = req.params; // id là id của lyrics, translateId là id của translate

      // Tìm document lyrics và xóa item trong mảng translate
      const updatedLyrics = await LyricsModel.findByIdAndUpdate(
        id,
        { $pull: { comments: { _id: commentId } } }, // Xóa item translate với translateId
        { new: true } // Trả về document đã cập nhật
      );

      if (!updatedLyrics) {
        return res.status(404).json({ message: "Lyrics not found" });
      }

      const lyricsData = await LyricsModel.findById(id)
        .populate("singer")
        .populate("category")
        .populate("country")
        .populate({
          path: "translate.user", // populate user trong comments reply
          model: "users",
          select: "-userPassword -userSocial -admin",
        })
        .populate({
          path: "comments.user", // populate user trong comments reply
          model: "users",
          select: "-userPassword -userSocial -admin",
        });

      res.status(200).send({
        message: "Comment item deleted successfully",
        data: lyricsData,
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
};

module.exports = LyricsController;
