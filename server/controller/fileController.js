const fs = require('fs');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { File } = require("../models/fileSchema");

const getFiles = async (req, res) => {
  try {
    console.log("getFiles")
    const files = await File.find();
    console.log(files)
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving files');
  }
};
  
const uploadFile = async (req, res) => {
  try {
    const originalName = req.file.originalname;
    const timestamp = Date.now();
    const newFilename = `${originalName}_${timestamp}`;

    const newFile = new File({
      originalName: originalName,
      filename: newFilename,
      contentType: req.file.mimetype,
      path: req.file.path,
    });

    await newFile.save();
    res.json(newFile);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading file');
  }
};
  
const getFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filepath = file.path;
    const content = fs.readFileSync(filepath, 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip);
    const text = doc.getFullText();

    res.json({ content: text });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving the file');
  }
};

const updateFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filepath = file.path;
    const content = fs.readFileSync(filepath, 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip);

    doc.setData({ text: req.body.content });
    doc.render();

    const updatedContent = doc.getZip().generate({ type: 'nodebuffer' });
    fs.writeFileSync(filepath, updatedContent);

    res.send('File updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating the file');
  }
};

  module.exports = {uploadFile, getFile, getFiles, updateFile, 
    // deleteFile
  };