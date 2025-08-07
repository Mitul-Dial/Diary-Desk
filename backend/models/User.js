const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: [50, "Name cannot exceed 50 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true, 
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email format"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [5, "Password must be at least 5 characters long"]
  },
  bio: {
    type: String,
    maxlength: [500, "Bio cannot exceed 500 characters"],
    default: ""
  },
  profileImage: {
    type: String,
    default: ""
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  date: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model("user", UserSchema);

module.exports = User;