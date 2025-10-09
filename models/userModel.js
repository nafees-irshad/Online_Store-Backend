const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  address: { type: String },
});

const UserModel = new mongoose.model("users", userSchema);

module.exports = UserModel;

 