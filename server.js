require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json())

const authRoute = require('./routes/authRoute')
app.use('/',authRoute);

app.listen(process.env.APP_PORT, ()=>{ console.log("server started") });