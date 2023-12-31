const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
      default:null,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "attendee",
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    face: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    mobile: {
      type: Number,
      required: false,
      default:null,
    },
    address: {
      type: String,
      required: false,
      default:null,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = model("Users", UserSchema);
