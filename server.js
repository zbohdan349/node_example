require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json())

const authRoute = require('./routes/authRoute')
app.use('/',authRoute);
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.ALLOWED_HOST) 
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept') 
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS')
    next() 
});

app.listen(process.env.APP_PORT, ()=>{ console.log("server started") });