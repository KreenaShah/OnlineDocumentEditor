const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  originalName: { type: String, required: true }, // Original name of the file
 contentType: { type: String, required: true }, // MIME type of the file
  path: { type: String }, // Path to the file in the file system (optional)
  size: { type: Number }, // Size of the file in bytes
  createdAt: { type: Date, default: Date.now }, // Upload date
  updatedAt: { type: Date, default: Date.now }, // Last update date
});

fileSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const File = mongoose.model("File", fileSchema);

module.exports = { File };