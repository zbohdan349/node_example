const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const subscriberSchema = new mongoose.Schema({
    login:{
        type:String,
        require: true
    },
    password:{
        type:String,
        require: true
    },
    role:{
        type:String,
        require: true
    },
})

module.exports = mongoose.model('User',subscriberSchema)