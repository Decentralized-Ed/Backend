const mongoose = require("mongoose");

const getCurrentTime = () => new Date();

const verifyModel = new mongoose.Schema({
  messageId: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userPassword: {
    type: String,
    required: true,
  },
  sentTime: {
    type: Date,
    default: getCurrentTime,
  },
  validTime: {
    type: Date,
    default: getCurrentTime,
  },
});

const VerifyModel = mongoose.model("VerifyModel", verifyModel);
module.exports = VerifyModel;
