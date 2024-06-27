const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    originalName: String,
    filename: String,
    contentType: String,
    path: String,
    createdAt: { type: Date, default: Date.now },
  });
  
  const File = mongoose.model("file", fileSchema);

  module.exports = { File };