require("dotenv").config({
    path: "./dev.env",
});

const express = require("express");

const app = express();

const db = require("./modules/db_connect");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// 測試
app.get("/", async (req, res) => {
    const sql = `SELECT * FROM AconProject.V_USERDEPT`;
    const [result] = await db.query(sql);

    res.json(result);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`伺服器啟動:${port}`));

module.exports = app;
