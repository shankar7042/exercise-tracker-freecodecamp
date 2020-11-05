const { Schema, model } = require("mongoose");

const exerciseSchema = new Schema({
  description: String,
  duration: Number,
  date: String,
});

const UserSchema = new Schema({
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
