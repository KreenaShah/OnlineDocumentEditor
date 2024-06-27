const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

//middlewares
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// imports
const connection = require("./dbConnect");
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