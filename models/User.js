const { Schema, model } = require("mongoose");
const shortid = require("shortid");

const exerciseSchema = new Schema({
  description: String,
  duration: Number,
  date: String,
});

const UserSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  username: {
    type: String,
    required: true,
  },
  log: {
    type: [exerciseSchema],
    default: [],
  },
});

module.exports = model("User", UserSchema);
