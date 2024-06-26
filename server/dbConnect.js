const mongoose = require("mongoose");

mongoose.set("strictQuery", true); //to suppress warning

module.exports = async () => {
  try {
    console.log("Attempting to connect to database...");
    await mongoose.connect("mongodb://127.0.0.1:27017/filesdb", {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Connected to database successfully");
  } catch (error) {
    console.log(error);
    console.log("Error while connecting to database , exiting now...");
    process.exit(1);
  }
};