const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotesSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"]
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    maxlength: [10000, "Description cannot exceed 10000 characters"]
  },
  tag: {
    type: String,
    default: "General",
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better performance
NotesSchema.index({ user: 1, date: -1 });
NotesSchema.index({ user: 1, title: 'text', description: 'text' });

module.exports = mongoose.model("notes", NotesSchema);