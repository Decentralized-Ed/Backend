const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

//Variables
const googleGamailPass = "zvyavmoikzsawqdg";

//Extra functions used
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

//Function to send the mail
const sendMail = async (email, code) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "saichidvigupta@gmail.com",
      pass: googleGamailPass,
    },
  });

  try {
    const info = await transport.sendMail({
      from: "saichidvigupta@gmail.com",
      to: email,
      subject: "Hello suruchi ",
      text: "Hello sai chidvi here ...",
      html: `<h1>Hey welcome to edTech, Kiriti . This is your random ${code} <h1>`,
    });
    // console.log(info);
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

//Routes for login and signUp
router.post("/login", async (req, res) => {
  try {
    // const { email, password } = req.params;
    const { email, password } = req.body;

    //Now check whether the user is in the data base
    //or not with the provided details.
    if (true) {
      res.status(200).json({
        status: 200,
        message: "User successfully logged in !",
      });
    } else {
      res.status(401).json({
        status: 401,
        message:
          "User not found in the Database or password not correct. Please signIn first.",
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

router.post("/signUp", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("I am here sai in the signUp");
    //check whether the user details is present in the data base or not
    // if (true) {
    //   res.status(400).json({
    //     status: 400,
    //     message: "User already exists in the Database, please login.",
    //   });
    // }

    //create a secured random string to send the string along with the
    //email for the verification process.
    const code = randomString();
    const response = await sendMail(email, code);
    console.log("Triggered me");
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

module.exports = router;
