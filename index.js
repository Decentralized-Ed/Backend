const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

app.use(express.json());
const port = process.env.PORT || 5000;

app.use(cors());
app.listen(port, () => {
  console.log(`Server Is Running On Port ${port}`);
});
