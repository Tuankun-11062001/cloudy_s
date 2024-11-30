const jwt = require("jsonwebtoken");

const middlewareController = {
  //verify token

  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.KEY_SECRET_JWT, (err, user) => {
        if (err) {
          return res
            .status(403)
            .send({ status: 403, message: "Token is not valid", data: [] });
        }

        req.user = user;
        next();
      });
    } else {
      return res.status(401).send({ message: "you not login" });
    }
  },

  //   verify and admin

  verifyTokenAndAdmin: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.id === req.params.id || req.user.admin) {
        req.verifyUser = req.user;
        next();
      } else {
        return res.status(403).send({ message: "You not allowed" });
      }
    });
  },

  //   Check admin for Product - affiliates - ads

  verifyTokenAdmin: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.admin) {
        req.verifyUser = req.user;
        next();
      } else {
        return res.status(403).send({ message: "You not admin" });
      }
    });
  },
};

module.exports = middlewareController;
