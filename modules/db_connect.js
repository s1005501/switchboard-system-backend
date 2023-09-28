const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "10.1.1.39",
    user: "root",
    password: "Fr@83560859",
    database: "AconProject",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
module.exports = pool.promise();
