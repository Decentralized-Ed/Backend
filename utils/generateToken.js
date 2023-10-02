const jwt = require("jsonwebtoken");

//Generates the token an sets it in the cookie of the response we send to the frontend.
const generateToken = (req, res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  res.cookie("jwt", token, {
    httpOnly: true,
  });
  console.log(req.cookies.jwt);
  // console.log(res.req.cookies.jwt);
};

module.exports = generateToken;
