require("dotenv").config();

if(
    !process.env.JWT_ACCESS_SECRET ||
    !process.env.JWT_REFRESH_SECRET ||
    !process.env.ALLOWED_HOST ||
    !process.env.MONGODB_URL){
        console.error("Missing required fields in configuration file")
        process.exit(1)
}

const express = require("express");
const app = express();

app.use(express.json())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.ALLOWED_HOST) 
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept') 
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS')
    next() 
});


const authRoute = require('./routes/authRoute')
app.use('/',authRoute);

app.listen(process.env.APP_PORT || 3000, 
    ()=>{ console.log(`server started on ${process.env.APP_PORT || 3000} port`)});