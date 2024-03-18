const Jwt = require("jsonwebtoken");
const { UserSchema } = require("../models/userSchema");

const authMiddleware = async (req, res, next) => {
  let token;

  try {
    const { authorization } = req.headers;

    if (authorization && authorization.startsWith("Bearer")) {
      token = authorization.split(" ")[1];

      // verifying the user token
      const { userId } = Jwt.verify(token, process.env.JWT_SECRET_KEY);

      req.user = await UserSchema.findById(userId).select("-password");
      next();
    }
    if (!token) {
      res.status(401).send({ error: "Unauthorized User No token" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Unauthorized User" });
  }
};

module.exports = { authMiddleware };
