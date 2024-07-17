const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

//middlewares
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(cors());

// imports
const connection = require("./config/dbConnect");
const fileRoutes = require("./routes/fileRoutes");

// Database Connection
connection();

//Defining Routes
app.use("/", fileRoutes);

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.listen(5000, () => {
  console.log('Server started on http://localhost:5000');
});