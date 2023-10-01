const jwt = require("jsonwebtoken");

//Generates the token an sets it in the cookie of the response we send to the frontend.
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  console.log(token);
  res.cookie("jwt", token, {
    httpOnly: true,
  });
  console.log(res.req.cookies.jwt);
};

module.exports = generateToken;
