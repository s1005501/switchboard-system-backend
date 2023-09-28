require("dotenv").config({
    path: "./dev.env",
});

const express = require("express");
const db = require("./modules/db_connect");
const cors = require("cors");

const app = express();
const corsOption = {
    credentials: true,
    origin: (origin, cb) => {
        cb(null, true);
    },
};

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(corsOption));
// 測試撈
app.post("/", async (req, res) => {
    console.log(req);
    // const sql = `SELECT NAME,PLANTNAME, UNITID,UNITNAME,DEVISION FROM AconProject.V_USERDEPT where AconProject.V_USERDEPT.NAME="?";
    // `;
    // const [result] = await db.query(sql);

    // res.json(result);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`伺服器啟動:${port}`));

module.exports = app;
