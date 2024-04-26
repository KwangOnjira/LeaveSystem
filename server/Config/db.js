const mysql = require('mysql2');
require("dotenv").config('../.env');

const db = mysql.createPool({
    host:process.env.HOST,
    user:process.env.USER,
    database:process.env.DATABASE
})

db.getConnection((err,con)=>{
    if (err) {
        console.log(`Could not  connect to the database ${err}`)
    }else{
        console.log("Successfully connected to the database")
    }
})

module.exports = db;