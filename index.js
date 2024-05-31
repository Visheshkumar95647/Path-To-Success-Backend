const express = require('express');
//nodejs already include this module
const path = require("path");

const app = express();
const mongoose = require('mongoose');
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/job").then(() => {
    console.log("Database connected");
    app.listen(5000, () => {
        console.log('Server is running on port 5000');
    });
}).catch(error => {
    console.error("Error connecting to database:", error);
});

// Import routes
app.use(require('./Routes/userroutes'));
