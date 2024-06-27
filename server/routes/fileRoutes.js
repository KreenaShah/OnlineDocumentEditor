const express = require("express");
const multer = require("multer");
const {
  uploadFile,
  getFile,
  getFiles,
  updateFile,
  deleteFile,
} = require("../controller/fileController");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post("/upload", upload.single("file"), uploadFile);
router.get("/all", getFiles);
router.get("/:id", getFile);
router.put("/:id", updateFile);
router.delete("/:id", deleteFile);

module.exports = router;