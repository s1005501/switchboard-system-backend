const mysql = require("mysql2");

// 公司版本
// const pool = mysql.createPool({
//     host: "10.1.1.39",
//     user: "root",
//     password: "Fr@83560859",
//     database: "AconProject",
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
// });

// 家裡測試
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "aconproject",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = pool.promise();
