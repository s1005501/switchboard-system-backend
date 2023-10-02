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

// 測試
app.post("/test", async (req, res) => {
    console.log("req.body", req.body);
    console.log("test", req.body.postData.deviceStockData);
    // console.log(req.body);
    // console.log(req.body);
    // const sql = "SELECT * FROM `V_USERDEPT` WHERE 1";
    // const [result] = await db.query(sql);
    // res.json(result);
});

// 使用者部門資料
app.post("/getUserData", async (req, res) => {
    const output = {
        success: false,
        error: "",
        row: [],
    };

    // console.log(req.body);
    const sql = `SELECT NAME,PLANTNAME, UNITID,UNITNAME,DEVISION 
    FROM AconProject.V_USERDEPT 
    where AconProject.V_USERDEPT.NAME='${req.body.postData}'`;

    const [result] = await db.query(sql);

    try {
        if (result.length) {
            output.success = true;
            output.row = result;
            res.json(output);
        } else {
            res.json(output);
        }
    } catch (error) {
        console.log(error);
    }
});

// 儲存訪客資料
app.post("/saveVisitorData", async (req, res) => {
    const output = {
        success: false,
        error: "",
        row: [],
    };
    // console.log(req.body.postData);
    const postData = req.body.postData;

    const sql = `INSERT INTO v_vistitordata(sid, visitorAconCompany, visitorCarNumber, visitorDepartment, visitorDepartmentNumber, visitorDivision, visitorDriveOrNot, visitorGuestCompany, visitorInterviewee, visitorMember, visitorName, visitorReason, visitorSubmitTime) VALUES (NULL,'${postData.visitorAconCompany}','${postData.visitorCarNumber}','${postData.visitorDepartment}','${postData.visitorDepartmentNumber}','${postData.visitorDivision}','${postData.visitorDriveOrNot}','${postData.visitorGuestCompany}','${postData.visitorInterviewee}','${postData.visitorMember}','${postData.visitorName}','${postData.visitorReason}','${postData.visitorSubmitTime}')`;

    const [result] = await db.query(sql);
    try {
        if (result) {
            console.log(result);
            output.success = true;
            output.row = result;
            res.json(output);
        } else {
            res.json(output);
        }
    } catch (error) {
        console.log(error);
    }
});

// 儲存預約的資料
app.post("/saveReserveData", async (req, res) => {
    const output = {
        success: false,
        error: "",
        row: [],
    };
    // console.log(req.body.postData);
    const postData = req.body.postData;
    console.log(postData);
    const sql = `INSERT INTO v_reservedata(sid, reserveAconCompany, reserveCarNumber, reserveDepartment, reserveDepartmentNumber, reserveDivision, reserveDriveOrNot, reserveGuestCompany, reserveInterviewee, reserveMember, reserveName, reserveReason, reserveSubmitTime) VALUES (NULL,'${postData.reserveAconCompany}','${postData.reserveCarNumber}','${postData.reserveDepartment}','${postData.reserveDepartmentNumber}','${postData.reserveDivision}','${postData.reserveDriveOrNot}','${postData.reserveGuestCompany}','${postData.reserveInterviewee}','${postData.reserveMember}','${postData.reserveName}','${postData.reserveReason}','${postData.reserveSubmitTime}')`;

    // 後端要再做過濾嗎?
    const [result] = await db.query(sql);
    try {
        if (result) {
            console.log(result);
            output.success = true;
            output.row = result;
            res.json(output);
        } else {
            res.json(output);
        }
    } catch (error) {
        console.log(error);
    }
});

// 訪客已預約過點選modal撈reserve資料
app.post("/bookingReserve", async (req, res) => {
    const output = {
        success: false,
        error: "",
        row: [],
    };
    console.log(req.body.postData);
    const postData = req.body.postData;

    const sql = `SELECT * FROM v_reservedata WHERE reserveName='${postData}'`;
    const [result] = await db.query(sql);

    try {
        if (result.length) {
            console.log(result);
            output.success = true;
            output.row = result;
            res.json(output);
        } else {
            res.json(output);
        }
    } catch (error) {
        console.log(error);
    }
});

// 撈庫存設備資料
app.get("/getDeviceStockData", async (req, res) => {
    const output = {
        success: false,
        error: "",
        row: [],
    };
    const [result] = await db.query(`SELECT * FROM v_devicestockdata WHERE v_devicestockdata.deviceStockRenter=""`);

    try {
        if (result.length) {
            console.log(result);
            output.success = true;
            output.row = result;
            res.json(output);
        } else {
            res.json(output);
        }
    } catch (error) {
        console.log(error);
    }
});

// userRent，目前庫存出借的資料
app.post("/userRent", async (req, res) => {
    const output = {
        success: false,
        error: "",
        row: [],
    };
    // console.log("req.body", req.body);
    req.body.deviceRentAlreadyRentData.map(async (v, i) => {
        console.log(v);
        try {
            const deviceUpdateSql = `UPDATE v_devicestockdata 
            SET deviceStockRenter='${req.body.deviceRentName}' 
            WHERE v_devicestockdata.deviceStockName="${v.deviceStockName}"`;

            const [deviceUpdateResult] = await db.query(deviceUpdateSql);
            // console.log(deviceUpdateResult);

            if (deviceUpdateResult.affectedRows) {
                const checklistSql = `INSERT INTO v_checklistdata
                (sid, checklistCompany,checklistDepartment,checklistDepartmentNumber,
                checklistDivision, checklistDevice, checklistDeviceDescription,checklistName, checklistTime,
                checklistType, checklistExtensionNumber, checklistSignature) 
                VALUES (NULL,'${req.body.deviceRentCompany}','${req.body.deviceRentDepartment}','${req.body.deviceRentDepartmentNumber}',
                '${req.body.deviceRentDivision}','${v.deviceStockName}','${v.deviceStockDescription}','${req.body.deviceRentName}',
                '${req.body.deviceRentSubmitTime}','設備','${req.body.deviceRentExtensionNumber}','${req.body.deviceRentSignature}')`;

                const [checklistResult] = await db.query(checklistSql);
                console.log(checklistResult);
                if (checklistResult.affectedRows) {
                    output.success = true;
                    if (output.success) {
                        console.log("output.success", output.success);

                        // FIXME: 不能重複送
                        res.json(output);
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    });
});

app.post("/userReturnRender", async (req, res) => {
    const output = {
        success: false,
        error: "",
        row: {},
    };
    console.log(req.body);
    const sql = `SElECT v_checklistdata.*,v_userdept.PLANTNAME,v_userdept.UNITID,v_userdept.UNITNAME,v_userdept.DEVISION 
    FROM v_checklistdata,v_userdept 
    WHERE v_userdept.NAME="${req.body.postData}" 
    AND v_checklistdata.checklistName="${req.body.postData}";
    `;
    const [userDataResult] = await db.query(sql);

    // console.log("userDataResult", userDataResult);

    try {
        if (userDataResult.length) {
            output.success = true;
            output.row = userDataResult;
            res.json(output);
        } else {
            res.json(output);
        }
    } catch (error) {
        console.log(error);
    }
});

// 使用者歸還
// app.post("/userReturn", async (req, res) => {
//     console.log(req.body.postData.deviceReturnData);
//     const returnData = req.body.postData.deviceReturnData;
//     returnData.map(async (v, i) => {
//         console.log(v);
//         const checklistDeleteSql = `DELETE FROM v_checklistdata WHERE v_checklistdata.checklistName="${v.deviceReturnName}"`;

//         const [checklistDeleteResult] = await db.query(checklistDeleteSql);
//         console.log(checklistDeleteResult)
//     });
// });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`伺服器啟動:${port}`));

module.exports = app;

// FIXME: try/catch要包住的範圍要包含sql嗎？

// UPDATE v_devicestockdata
// SET deviceStockRenter = ''
// WHERE v_devicestockdata.deviceStockRenter = "甘凱文"
