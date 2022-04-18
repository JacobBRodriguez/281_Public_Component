const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config({path: '.env'});

// Create SQL Connection to AWS RDBMS
const sql_con = mysql.createConnection({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    port: process.env.SQL_PORT,
    password: process.env.SQL_PWD,
    database: process.env.SQL_DB,
    multipleStatements: process.env.SQL_MULTI_STATEMENTS
});

sql_con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to RDBMS!");
})

module.exports = sql_con;