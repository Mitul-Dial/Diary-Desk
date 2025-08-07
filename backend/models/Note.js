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
  attachments: [{
    filename: String,
    url: String,
    size: Number,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  images: [{
    filename: String,
    url: String,
    caption: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  todoItems: [{
    text: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  date: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

NotesSchema.index({ user: 1, date: -1 });
NotesSchema.index({ user: 1, title: 'text', description: 'text' });
NotesSchema.index({ user: 1, tag: 1 });

NotesSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("notes", NotesSchema);