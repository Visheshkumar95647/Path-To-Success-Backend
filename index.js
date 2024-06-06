const express = require('express');
const path = require("path");
const app = express();
const mongoose = require('mongoose');
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
mongoose.connect(process.env.DATABASE).then(() => {
    console.log("Database connected");
    app.listen(process.env.PORT || 5000, () => {
        console.log('Server is running on port 5000');
    });
}).catch(error => {
    console.error("Error connecting to database:", error);
});
app.use(require('./Routes/userroutes'));
