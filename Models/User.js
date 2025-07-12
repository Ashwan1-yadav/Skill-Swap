const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
  location: {
    type: String,
    required: false,
    default: "Remote",
  },
  profilePhoto: {
    type: String,
    required: false,
    default: "https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png",
  },
  skillsOffered: [{
    type: String,
    required: true,
  }],
  skillsWanted: [{
    type: String,
    required : true,
  }],
  availability: {
    type: String,
    required: true,
  },
  isPublicProfile: {
     type: Boolean, default: true 
  }
});

module.exports = mongoose.model("User", userSchema);
