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

// test，測試路由
app.post("/test", async (req, res) => {
    console.log("req.body", req.body);
    console.log("test", req.body.postData.deviceStockData);
    // console.log(req.body);
    // console.log(req.body);
    // const sql = "SELECT * FROM `V_USERDEPT` WHERE 1";
    // const [result] = await db.query(sql);
    // res.json(result);
});

// getUserData，撈使用者部門資料
app.post("/getUserData", async (req, res) => {
    const output = {
        success: false,
        error: "",
        row: [],
    };

    // console.log(req.body);
    const sql = `
    SELECT NAME,PLANTNAME, UNITID,UNITNAME,DEVISION 
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

// saveVisitorData，儲存訪客資料
app.post("/saveVisitorData", async (req, res) => {
    const output = {
        success: false,
        error: "",
        row: [],
    };
    // console.log(req.body.postData);
    const postData = req.body.postData;

    const sql = `INSERT INTO v_vistitordata(sid, visitorAconCompany, visitorCarNumber, visitorDepartment, visitorDepartmentNumber, visitorDivision, visitorDriveOrNot, visitorGuestCompany, 
    visitorInterviewee, visitorMember, visitorName, visitorReason,
    visitorSubmitTime) 
    VALUES (NULL,'${postData.visitorAconCompany}','${postData.visitorCarNumber}','${postData.visitorDepartment}',
    '${postData.visitorDepartmentNumber}','${postData.visitorDivision}','${postData.visitorDriveOrNot}',
    '${postData.visitorGuestCompany}','${postData.visitorInterviewee}','${postData.visitorMember}',
    '${postData.visitorName}','${postData.visitorReason}','${postData.visitorSubmitTime}')`;

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

// saveReserveData，儲存訪客預約的資料
app.post("/saveReserveData", async (req, res) => {
    const output = {
        success: false,
        error: "",
        row: [],
    };
    // console.log(req.body.postData);
    const postData = req.body.postData;
    console.log(postData);
    const sql = `
    INSERT INTO v_reservedata(sid, reserveAconCompany, reserveCarNumber, reserveDepartment, 
    reserveDepartmentNumber, reserveDivision, reserveDriveOrNot, reserveGuestCompany, 
    reserveInterviewee, reserveMember, reserveName, reserveReason, 
    reserveSubmitTime) 
    VALUES (NULL,'${postData.reserveAconCompany}','${postData.reserveCarNumber}','${postData.reserveDepartment}',
    '${postData.reserveDepartmentNumber}','${postData.reserveDivision}','${postData.reserveDriveOrNot}',
    '${postData.reserveGuestCompany}','${postData.reserveInterviewee}','${postData.reserveMember}',
    '${postData.reserveName}','${postData.reserveReason}','${postData.reserveSubmitTime}')`;

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

// bookingReserve，撈已預約過的訪客的資料(點modal的)
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

// getDeviceStockData，撈庫存設備資料
app.get("/getDeviceStockData", async (req, res) => {
    const output = {
        success: false,
        error: "",
        row: [],
    };
    const [result] = await db.query(`SELECT * FROM v_devicestockdata WHERE v_devicestockdata.deviceStockRenter=""`);

    try {
        if (result.length) {
            // console.log(result);
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

// userRent，使用者借用
app.post("/userRent", async (req, res) => {
    const output = {
        row: [],
    };
    // console.log("req.body", req.body);

    // 跑多次的寫法;
    const userRent = async () => {
        output.row = await Promise.all(
            req.body.deviceRentAlreadyRentData.map(async (v, i) => {
                try {
                    const deviceUpdateSql = `
                    UPDATE v_devicestockdata
                    SET deviceStockRenter='${req.body.deviceRentName}'
                    WHERE v_devicestockdata.deviceStockName="${v.deviceStockName}"`;

                    const [deviceUpdateResult] = await db.query(deviceUpdateSql);
                    // console.log(deviceUpdateResult);

                    if (deviceUpdateResult.affectedRows) {
                        const checklistSql = `
                        INSERT INTO v_checklistdata
                        (sid, checklistCompany,checklistDepartment,checklistDepartmentNumber,
                        checklistDivision, checklistDevice, checklistDeviceDescription,checklistName,
                        checklistRentTime,checklistType, checklistExtensionNumber, checklistSignature,checklistReturnTime)
                        VALUES (NULL,'${req.body.deviceRentCompany}','${req.body.deviceRentDepartment}','${req.body.deviceRentDepartmentNumber}',
                        '${req.body.deviceRentDivision}','${v.deviceStockName}','${v.deviceStockDescription}','${req.body.deviceRentName}',
                        '${req.body.deviceRentSubmitTime}','設備','${req.body.deviceRentExtensionNumber}','${req.body.deviceRentSignature}','')`;

                        const [checklistResult] = await db.query(checklistSql);
                        if (checklistResult.affectedRows) {
                            return "success";
                        } else {
                            return "fail";
                        }
                    } else {
                        return "fail";
                    }
                } catch (error) {
                    console.log(error);
                }
            })
        );
        return output;
    };

    await userRent().then((r) => {
        res.json(output);
    });
});

//
app.post("/userReturnRender", async (req, res) => {
    const output = {
        success: false,
        error: "",
        row: {},
    };
    console.log(req.body);
    const sql = `
    SElECT v_checklistdata.*,v_userdept.PLANTNAME,v_userdept.UNITID,v_userdept.UNITNAME,v_userdept.DEVISION 
    FROM v_checklistdata,v_userdept 
    WHERE v_userdept.NAME="${req.body.postData}" 
    AND v_checklistdata.checklistName="${req.body.postData}"
    AND v_checklistdata.checklistReturnTime=""`;
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

// userReturn，使用者歸還
app.post("/userReturn", async (req, res) => {
    const output = {
        row: [],
    };
    console.log(req.body.postData);

    const returnData = req.body.postData.deviceReturnData;

    const userReturn = async () => {
        output.row = await Promise.all(
            returnData.map(async (v, i) => {
                try {
                    console.log("v", v);
                    const checklistDeleteSql = `
                    UPDATE v_checklistdata 
                    SET checklistReturnTime='${req.body.postData.deviceReturnSubmitTime}' 
                    WHERE v_checklistdata.checklistReturnTime="" 
                    AND v_checklistdata.checklistName="${v.deviceReturnName}"
                    AND v_checklistdata.checklistDevice="${v.checklistDevice}"`;
                    const [checklistDeleteResult] = await db.query(checklistDeleteSql);
                    // console.log(checklistDeleteResult);

                    if (checklistDeleteResult.affectedRows) {
                        const deviceUpdateSql = `
                        UPDATE v_devicestockdata
                        SET deviceStockRenter = ''
                        WHERE v_devicestockdata.deviceStockRenter = "${v.deviceReturnName}"
                        AND v_devicestockdata.deviceStockName="${v.checklistDevice}"`;

                        const [deviceUpdateResult] = await db.query(deviceUpdateSql);

                        console.log("48264872364287364782364872", deviceUpdateResult);
                        if (deviceUpdateResult.affectedRows) {
                            return "success";
                        } else {
                            return "fail";
                        }
                    } else {
                        return "fail";
                    }
                } catch (error) {
                    console.log(error);
                }
            })
        );

        return output;
    };
    await userReturn().then(() => {
        res.json(output);
    });
});

// 撈已借出的清單
app.get("/checklistData", async (req, res) => {
    const sql = `SELECT * FROM v_checklistdata WHERE v_checklistdata.checklistReturnTime="";
    `;
    const [result] = await db.query(sql);
    console.log(result);
    const newResult = result.map((v, i) => {
        v.checklistRentTime = v.checklistRentTime.slice(0, 11);
        return { ...v };
    });
    console.log(newResult);
    try {
        res.json(newResult);
    } catch (error) {
        console.log(error);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`伺服器啟動:${port}`));

module.exports = app;

// FIXME: try/catch要包住的範圍要包含sql嗎？

// TODO: 判斷流程有沒有比較好的寫法？
