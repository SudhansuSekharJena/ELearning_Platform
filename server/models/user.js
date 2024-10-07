import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
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
    default: "user" // by default the role will be user
  },
  subscription: [{ // it will be list of subscriptions
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
],
}, {
  timestamps: true,
})

export const User = mongoose.model("User", schema)