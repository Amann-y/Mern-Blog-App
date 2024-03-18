const { UserSchema } = require("../models/userSchema");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const transporter = require("../utils/emailConfig");

const registerController = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(401).send({ error: "All Fields Are Required" });
    }

    const existingUser = await UserSchema.findOne({ email: email });

    if (existingUser) {
      return res.status(401).send({ error: "Email Is Already Exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserSchema.create({
      email,
      name,
      password: hashedPassword,
    });

    const output = await newUser.save();

    const saved_user = await UserSchema.findOne({ email: email });

    const token = await Jwt.sign(
      { userId: saved_user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    const newOutput = {
      message: "User Registered Successfully",
      user: {
        email: newUser.email,
        name: newUser.name,
        token,
        // Exclude the password field from the output
      },
    };

    return res.status(200).send(newOutput);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).send({ error: "All Fields Are Required" });
    }

    const existingUser = await UserSchema.findOne({ email: email });
    if (!existingUser) {
      return res.status(401).send({ error: "User Not Found" });
    }

    const passwordChecking = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!passwordChecking) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Incorrect credentials" });
    }

    //Generate token
    const token = await Jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    const output = {
      message: "User Login Successfully",
      user: {
        email: existingUser.email,
        name: existingUser.name,
        token,
        // Exclude the password field from the output
      },
    };

    return res.status(200).send(output);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const loggedUserController = async (req, res) => {
  try {
    res.status(200).send({ user: req.user });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const sendUserPasswordResetEmailController = async (req, res) => {
  try {
    const { email } = req.body;

    if (email) {
      const user = await UserSchema.findOne({ email: email });

      if (user) {
        const secret = user._id + process.env.JWT_SECRET_KEY;
        const token = await Jwt.sign({ userId: user._id }, secret, {
          expiresIn: "15m",
        });
        const link = `http://localhost:5173/api/user/reset/${user._id}/${token}`;

        // send Email
        let info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: "Password Reset Link",
          html: `<a href=${link}>Click Here </a> to reset your password`,
        });
        res.status(200).send({
          message: "Password Reset Email Sent, Please Check Your Email",
        });
      } else {
        return res.status(401).send({ error: "Email Doesn't Exist" });
      }
    } else {
      return res.status(401).send({ error: "Email Is Required" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const userPasswordResetController = async (req, res) => {
  try {
    const { password, password_confirmation } = req.body;
    const { id, token } = req.params;
    const user = await UserSchema.findById(id);
    const new_secret = (await user._id) + process.env.JWT_SECRET_KEY;
    Jwt.verify(token, new_secret);
    if (password && password_confirmation) {
      if (password === password_confirmation) {
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(password, salt);
        await UserSchema.findByIdAndUpdate(user._id, {
          $set: { password: newHashedPassword },
        });
        res.status(200).send({
          message: "Password Reset Successfully",
        });
      } else {
        return res
          .status(401)
          .send({ error: "Password And Confirm Password Don't Match" });
      }
    } else {
      return res.status(401).send({ error: "All Fields Are Required" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Invalid Token" });
  }
};

const changeUserPasswordController = async (req, res) => {
  try {
    const { password, password_confirmation } = req.body;
    if (password && password_confirmation) {
      if (password === password_confirmation) {
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(password, salt);
        await UserSchema.findByIdAndUpdate(req.user._id, {
          $set: { password: newHashedPassword },
        });
        res.status(200).send({
          message: "Password Changed Successfully",
        });
      } else {
        return res
          .status(401)
          .send({ error: "Password And Confirm Password Don't Match" });
      }
    } else {
      return res.status(401).send({ error: "All Fields Are Required" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = {
  registerController,
  loginController,
  loggedUserController,
  sendUserPasswordResetEmailController,
  userPasswordResetController,
  changeUserPasswordController,
};
