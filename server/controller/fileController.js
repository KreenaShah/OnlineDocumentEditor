const path = require('path');
const fs = require("fs");
const mongoose = require("mongoose");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const { convert } = require('html-to-text');
const xlsx = require('xlsx');
const { File } = require("../models/fileSchema");

const uploadFile = async (req, res) => {
  try {
    console.log("req.file",req.file)
    const newFile = new File({
      originalName: req.file.originalname,
      contentType: req.file.mimetype,
      path: req.file.path,
      size: req.file.size,
    });

    console.log(newFile,"this file is uploaded")

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
  console.log(req.params.id,typeof(req.params.id))

  if (!mongoose.isValidObjectId(fileId)) {
    console.log("Invalid file ID")
    return res.status(400).json({ error: 'Invalid file ID' });
  }else{
    console.log("valid file ID")
  }

  try {
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const { contentType, path: filepath } = file;

    let content;

    if (contentType === 'text/plain') {
      content = fs.readFileSync(filepath, 'utf-8');
    } else if (contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') { // For .docx files
      const fileContent = fs.readFileSync(filepath);
      const zip = new PizZip(fileContent);
      const doc = new Docxtemplater(zip);
      doc.setData({}); // Optionally set data if using docxtemplater
      doc.render();
      content = doc.getFullText();
    } else if (contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') { // For .xlsx files
      const workbook = xlsx.readFile(filepath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      content = xlsx.utils.sheet_to_csv(sheet); // Convert sheet to CSV for simplicity
    }
    // For .pdf files
    // else if (contentType === 'application/pdf') { 
    //   const pdfBytes = fs.readFileSync(filepath);
    //   const pdfDoc = await PDFDocument.load(pdfBytes);
    //   const numPages = pdfDoc.getPageCount();
    //   let pdfText = '';
    
    //   for (let i = 0; i < numPages; i++) {
    //     const page = pdfDoc.getPage(i);
    //     const content = await page.getTextContent();
    
    //     for (const textItem of content.items) {
    //       pdfText += textItem.str + ' '; // Concatenate text items
    //     }
    //     pdfText += '\n'; // Add newline after each page
    //   }
    
    //   content = pdfText;
    // }
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
  console.log("update file")
  const fileId = req.params.id;
  const { content } = req.body;
  console.log(req.body,"req.body")
  console.log(content,"content")

  try {
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Update the content of the file based on its contentType
    if (file.contentType === 'text/plain') {
      console.log('text/plain')
      const updatedContent = convert(content, {
        wordwrap: 130,
        ignoreHref: true,
        ignoreImage: true,
        preserveNewlines: true
      });

      console.log(updatedContent,"not html")
      fs.writeFileSync(file.path, updatedContent, 'utf-8');
    } else if (file.contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // For .docx files
      const fileContent = fs.readFileSync(file.path);
      const zip = new PizZip(fileContent);
      const doc = new Docxtemplater(zip);
      doc.loadZip(zip);
      doc.setData({});
      doc.render();
      const updatedContent = doc.getZip().generate({ type: "nodebuffer" });
      fs.writeFileSync(file.path, updatedContent);
    } else if (file.contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      // For .xlsx files
      const workbook = xlsx.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      // Example: Update first cell content
      sheet.A1.v = content; // Assuming content is a string to replace with
      const updatedWorkbook = xlsx.write(workbook, { type: 'buffer' });
      fs.writeFileSync(file.path, updatedWorkbook);
    }
    // Add more conditions for other file types as needed

    // Update other properties of the file if necessary
    file.updatedAt = new Date();
    await file.save();

    res.json({ message: "File updated successfully" });
  } catch (error) {
    console.error("Error updating file:", error);
    res.status(500).send("Error updating file");
  }
};

module.exports = {
  uploadFile,
  getFile,
  getFiles,
  updateFile,
  // deleteFile
};
