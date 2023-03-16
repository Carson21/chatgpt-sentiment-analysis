const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  email: String,
  first: String,
  last: String,
  hash: String,
  salt: String,
})

mongoose.model("User", UserSchema)
