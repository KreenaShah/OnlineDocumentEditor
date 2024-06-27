const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    originalName: { type: String},
    filename: { type: String},
    contentType: { type: String},
    path: { type: String},
    createdAt: { type: Date, default: Date.now },
  });
  
  const File = mongoose.model("File", fileSchema);

  module.exports = { File };