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
const sendMail = async (email, code, userId) => {
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
               currUrl + "user/verify" + "/" + "345" + "/" + code
             }> here </a> to proceed.</p>`,
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

    //else create a userId and store the verification attributs as false
    //and get those user id
    const userId = "sampleId";

    //create a secured random string to send the string along with the
    //email for the verification process.
    const code = randomString();
    const response = await sendMail(email, code, userId);
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

router.get("/user/verify/:userId/:code", (req, res) => {
  console.log("User verified");
  //verify the user in the data base using the user id and the verification link
  //check whether he clicked the code in less than 6 hours from the generation of
  //the link
  const { userId, code } = req.params;

  //if verified succesffuly
  res.send("You are verfied sucessfully.");
});

module.exports = router;
