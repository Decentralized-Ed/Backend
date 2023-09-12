//auth routes
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

//nodemailer stuff
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "saichidvigupta@gmail.com",
    pass: googleGamailPass,
  },
});

//send verification email
const sendVerificationEmail = ({ email, string, userId }, res) => {
  //url to be used in email
  const currUrl = "https://localhost:5000/";

  const mailOptions = {
    from: "saichidvigupta@gmail.com",
    to: email,
    subject: "Verify Your Email",
    html: `<p>Verify your email address to complete the signup and login into your account</p>
           <p>This link <b>expires in 6 hours</b>.</p><p>Press <a href=${
             currUrl + "user/verify" + "/" + userId + "/" + string
           }> here </a> to proceed.</p>`,
  };

  transporter.sendMail(mailOptions).then(() => {
    res.json({
      status: "PENDING",
      message: "Verificatin email sent",
    });
  });
};

//roue to send email for verification
router.post("/verifyEmail", (req, res) => {
  let { email, string, userId } = req.body;

  //removes the white spaces present
  email = email.trim();

  //chech whether the email is a valid email or not.
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.json({
      status: "FAILED",
      message: "Invalid email entered",
    });
  }

  //Now I need to chech whether any user already
  //used this email or not ,if used I need to ask the user for another email
  if (true) {
    res.send({
      status: "FAILED",
      message: "User with the provided email already exists",
    });
  }
});

//Verify the mail link that user has clicked
router.get("/verify/:userId/:string", (req, res) => {
  let { userId, string } = req.params;

  //check whether the verificationObject exists of not with the userId and same unique string
  if (true) {
    //store the user in the database with the userId,email
    //and then redirect to the paged needed.
  }
});

//Verified page route
router.get("/verified", (req, res) => {
  res.send({
    statue: "SUCCESS",
    message: "User verified Succeddfully",
  });
});

module.exports = router;
