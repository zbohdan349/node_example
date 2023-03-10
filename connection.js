const mongoose = require('mongoose');
const redis = require('redis');

mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGODB_URL);
const db = mongoose.connection;
db.on('error',(error) => console.error(error));
db.once('open',() => console.log("OK"));

const client = redis.createClient(process.env.REDIS_PORT || 6379,process.env.REDIS_HOST || 'localhost');

client.on('error', (err) => console.log('Redis Client Error', err));
client.connect();

module.exports = client;