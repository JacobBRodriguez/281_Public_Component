const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config({path: '.env'});

AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
});

const NoSQL_Client = new AWS.DynamoDB.DocumentClient();

module.exports = NoSQL_Client;