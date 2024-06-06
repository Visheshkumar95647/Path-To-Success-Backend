const express = require('express');
const path = require("path");
const app = express();
const mongoose = require('mongoose');
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
mongoose.connect("mongodb://localhost:27017/job").then(() => {
    console.log("Database connected");
    app.listen(process.env.PORT , () => {
        console.log('Server is running on port 5000');
    });
}).catch(error => {
    console.error("Error connecting to database:", error);
});

// Import routes
app.use(require('./Routes/userroutes'));
