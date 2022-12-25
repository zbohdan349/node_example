require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require('mongoose');
mongoose.set('strictQuery', true)
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error',(error) =>console.error(error));
db.once('open',(error) =>console.log("OK"));

app.use(express.json())

const authRoute = require('./routes/authRoute')
app.use('/',authRoute);

app.listen(3000, ()=>{console.log("server started")});