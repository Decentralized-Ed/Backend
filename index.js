const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

app.use(cors(corsOptions));

// const authRouter = require("./routes/auth.js");
const authRouter = require("./routes/auth1");
app.use(bodyParser.json());

app.use("/api/auth", authRouter);

app.use(express.json());
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  console.log("I am here");
  res.send("Hey you are on te server !");
});

app.use(cors());
app.listen(port, () => {
  console.log(`Server Is Running On Port ${port}`);
});
