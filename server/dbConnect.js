const mongoose = require("mongoose");

mongoose.set("strictQuery", true); // to suppress warning

module.exports = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/filesdb");
    console.log("Connected to database successfully");
  } catch (error) {
    console.error("Error while connecting to database:", error);
    console.log("Exiting now...");
    process.exit(1);
  }
};