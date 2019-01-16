var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10000,
    port: '3306',
    host: 'localhost',
    user: "root",
    password: "root",
    database: "lab1ha"
})


module.exports = pool;