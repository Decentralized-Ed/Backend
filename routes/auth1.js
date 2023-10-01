const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const generateToken = require("../utils/generateToken");
const protect = require("../middlewares/authMiddleware");
const VerifyModel = require("../models/EmailVerficationModel");

//Variables
const googleGamailPass = "zvyavmoikzsawqdg";

//To generate the random string of code.
const randomString = () => {
  const size = 10;
  let code = "";
  for (let i = 0; i < 10; i++) {
    const randomDigit = Math.floor(Math.random() * 10);
    code += randomDigit.toString();
  }
  return code;
};

//Function to send the mail.
const sendMail = async (email, code) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "saichidvigupta@gmail.com",
      pass: googleGamailPass,
    },
  });

  const currUrl = "http://localhost:5000/api/auth/";

  try {
    const info = await transport.sendMail({
      from: "saichidvigupta@gmail.com",
      to: email,
      subject: "Verify Your Email",
      html: `<p>Verify your email address to complete the signup and login into your account</p>
             <p>This link <b>expires in 6 hours</b>.</p><p>Press <a href=${
               currUrl + "user/verify" + "/" + code
             }> here </a> to proceed.</p>`,
    });
    return {
      status: 200,
      message: "Email sent successfully.",
      info: info,
    };
  } catch (err) {
    return {
      status: 400,
      message: "Error while sending the email.",
    };
  }
};

//Route for SignUp.
router.post("/signUp", async (req, res) => {
  try {
    const { email, password } = req.body;
    //check whether the user details is present in the data base or not
    const user = await User.findOne({ emailId: email });
    if (user) {
      return res.status(401).json({
        status: 401,
        message:
          "User already exists with this email , please signIn to proceed.",
      });
    }
    //create a secured random string to send the string along with the
    //email for the verification process.
    const code = randomString();
    const response = await sendMail(email, code);
    if (response) {
      const newVerifyObject = await new VerifyModel({
        messageId: code,
        userEmail: email,
        userPassword: password,
      });
      await newVerifyObject.save();
    }
    res.status(200).json({
      status: response.status,
      message: response.message,
      info: response?.info,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 500,
      message: "Internal server issues, while signup.",
    });
  }
});

//Route for Verification of link in the email for signUp or register.
router.post("/user/verify/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const checkMessage = await VerifyModel.findOne({ messageId: code });
    if (checkMessage) {
      const user = await User.findOne({ emailId: checkMessage.userEmail });
      if (!user) {
        const newUser = await new User({
          userName: checkMessage.userEmail,
          emailId: checkMessage.userEmail,
          password: checkMessage.userPassword,
          verified: true,
        });
        await newUser.save();
      }
      res.status(200).json({
        status: 200,
        message: "User verified successfully.",
      });
    } else {
      res.status(401).json({
        status: 401,
        message: "Invalid Url.",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({
      status: 401,
      message: "Internal server issues, while signup.",
    });
  }
});

//Route for login.
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    //search the user in the database
    const user = await User.findOne({ emailId: email });

    //if user is present , then check the password matches or not.
    //else send the response with the message.
    if (user && (await user.matchPasswords(password))) {
      generateToken(res, user._id);
      res.status(200).json({
        userId: user?._id,
        email: user.emailId,
        myCookie: res.req.cookies.jwt,
        jwt: res.req.cookies.jwt,
      });
    } else {
      res.status(401).json({
        status: 401,
        message: "Invalid email or password !",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 500,
      message: "Internal server error issues, while login.",
    });
  }
});

//Route for logout.
router.post("/logout", async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({
      status: 200,
      message: "User logged out succesfully!",
    });
  } catch (err) {
    res.status(401).json({
      status: 401,
      message: "Server side issues!",
    });
  }
});

module.exports = router;
