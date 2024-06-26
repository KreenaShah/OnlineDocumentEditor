const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

const connection = require("./dbConnect");

// Database Connection
connection();

// Define a schema and model for storing file metadata
const fileSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  path: String
});

const File = mongoose.model('File', fileSchema);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Add a unique timestamp to the filename
  }
});

const upload = multer({ storage: storage });

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// API routes
app.post('/upload', upload.single('file'), async (req, res) => {
  const newFile = new File({
    filename: req.file.filename,
    contentType: req.file.mimetype,
    path: req.file.path
  });
  console.log(newFile)
  await newFile.save();
  res.json(newFile);
});

app.get('/files', async (req, res) => {
  const files = await File.find();
  res.json(files);
});

app.get('/file/:id', async (req, res) => {
  const file = await File.findById(req.params.id);
  if (file) {
    res.sendFile(path.resolve(file.path));
  } else {
    res.status(404).send('File not found');
  }
});

app.get('/', async (req, res) => {
    res.json("welcome");
  });

app.listen(5000, () => {
  console.log('Server started on http://localhost:5000');
});
