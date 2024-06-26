const fs = require("fs");
const mongoose = require("mongoose");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const { convert } = require('html-to-text');
const xlsx = require('xlsx');
const { File } = require("../models/fileSchema");

const uploadFile = async (req, res) => {
  try {
    const newFile = new File({
      originalName: req.file.originalname,
      contentType: req.file.mimetype,
      path: req.file.path,
      size: req.file.size,
    });

    await newFile.save();
    res.json(newFile);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading file");
  }
};

const getFiles = async (req, res) => {
  try {
    const files = await File.find();
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving files");
  }
};

const getFile = async (req, res) => {
  const fileId = req.params.id;

  if (!mongoose.isValidObjectId(fileId)) {
    console.log("Invalid file ID");
    return res.status(400).json({ error: "Invalid file ID" });
  }

  try {
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const { contentType, path: filepath } = file;

    let content;

    if (contentType === "text/plain") {
      content = fs.readFileSync(filepath, "utf-8");
    } else if (contentType ==="application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      // For .docx files
      const fileContent = fs.readFileSync(filepath);
      const zip = new PizZip(fileContent);
      const doc = new Docxtemplater(zip);
      doc.setData({}); // Optionally set data if using docxtemplater
      doc.render();
      content = doc.getFullText();
    } else if (contentType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      // For .xlsx files
      const workbook = xlsx.readFile(filepath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      content = xlsx.utils.sheet_to_csv(sheet); // Convert sheet to CSV for simplicity
    }
    else {
      return res.status(400).json({ error: "Unsupported file format" });
    }

    res.json({ content });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving the file");
  }
};

const updateFile = async (req, res) => {
  console.log("update file");
  const fileId = req.params.id;
  const { content } = req.body;
  console.log(req.body, "req.body");
  console.log(content, "content");

  try {
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Update the content of the file based on its contentType
    if (file.contentType === "text/plain") {
      console.log("text/plain");
      const updatedContent = convert(content, {
        wordwrap: 130,
        ignoreHref: true,
        ignoreImage: true,
        preserveNewlines: true,
      });

      console.log(updatedContent, "not html");
      fs.writeFileSync(file.path, updatedContent, "utf-8");
    } 
    else if (file.contentType ==="application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      console.log("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    } 
    else if (file.contentType ==="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      console.log("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }

    file.updatedAt = new Date();
    await file.save();

    res.json({ message: "File updated successfully" });
  } catch (error) {
    console.error("Error updating file:", error);
    res.status(500).send("Error updating file");
  }
};

const deleteFile = async (req, res) => {
  const fileId = req.params.id;
  try {
    const file = await File.findByIdAndDelete(fileId);
    if (!file) {return res.status(404).json({ error: "File not found" });}

    // Optionally, you can delete the file from disk using fs.unlinkSync
    fs.unlinkSync(file.path);
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).send("Error deleting file");
  }
};

module.exports = {
  uploadFile,
  getFile,
  getFiles,
  updateFile,
  deleteFile
};
