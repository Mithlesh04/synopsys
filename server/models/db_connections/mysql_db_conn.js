// connect with mysql

const mysql = require('mysql');

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Root@123",
    database: "synopsys"
});

conn.connect(function (err) {
    if (err) throw err;
    console.log("mysql_db Connected!");
});

module.exports = conn;