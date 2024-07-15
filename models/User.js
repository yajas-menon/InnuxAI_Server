const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
    },
    isVerified:{
      type:Boolean,
      default:false
    }
},
);

module.exports = mongoose.model("Users", UsersSchema);
