const express = require("express");
const app = express();
app.use(express.json());

const dbSeq = require("../Config/index");
const { users, statistic } = dbSeq;
dbSeq.sequelize.sync();

const dotenv = require("dotenv");
const { leave } = require("./leave");
dotenv.config({ path: "./.env" });

//ใช้ดึงข้อมูลลาทั้งหมดของuserโดยใช้userId โดยตอนนี้ใช้ที่หน้าStatistic(หน้าประวัติการลา)
exports.statistic = async (req, res) => {
  const userId = req.userId;
  info = await statistic.findAll({
    where: { citizenID: userId },
  });
  res.json(info);
};

//ใช้ดึงข้อมูลสถิติตัวล่าสุดของuserผ่านuserID มีการนำไปใช้ที่หน้าlogin(เพื่อเช้คว่ามีค่าสถิติแล้วหรือยัง หากยังไม่เคยมี จะสร้างค่าสถิติพื้นฐานให้)และหน้าฟอร์มแจ้งลาต่างๆ
//ชื่อfunctionหน้าบ้าน คือgetLastStatistic
exports.getDataLastStatistic = async (req, res) => {
  const userId = req.userId;

  try {
    const getLastStatistic = await dbSeq.statistic.findOne({
      where: { citizenID: userId },
      order: [["statisticID", "DESC"]],
    });
    if (getLastStatistic) {
      console.log("getLastStatistic: ", getLastStatistic);
      return res.json(getLastStatistic);
    } else {
      return res.status(404).json({ error: "Last statistic not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//ใช้ดึงข้อมูลสถิติตัวล่าสุดของuserผ่านcitizenID
exports.getDataLastStatisticByCitizen = async (req, citizenID) => {
  try {
      // Remove the line const citizenID = req.params.citizenID;
      const getLastStatistic = await dbSeq.statistic.findOne({
          where: { citizenID: citizenID },
          order: [["statisticID", "DESC"]],
      });
      if (getLastStatistic) {
          console.log("getLastStatistic: ", getLastStatistic);
          return getLastStatistic; // Return the data instead of using res.json
      } else {
          return { error: "Last statistic not found" }; // Return an object if the statistic is not found
      }
  } catch (error) {
      console.error(error);
      return { error: "Internal Server Error" }; // Return an object in case of an error
  }
};

//ใช้สร้างข้อมูลสถิติการลา
exports.createStatistic = async (req, res) => {
  const userId = req.userId;
  const {
    fiscal_year,
    range,
    isStatOfLeaveID,
    leave_rights,
    VL_accumulatedDays,
    VL_total,
    VL_lastLeave,
    VL_thisLeave,
    currentUseVL,
    VL_remaining,
    leave_count,
    SL_lastLeave,
    SL_thisLeave,
    SL_remaining,
    SL_In_Range,
    PL_lastLeave,
    PL_thisLeave,
    PL_remaining,
    PL_In_Range,
    ML_thisleave,
    ML_lastleave,
    ML_DayCount,
    ML_In_Range,
    OL_DayCount,
    OL_In_Range,
    STL_DayCount,
    STL_In_Range,
    total_leaveDay,
  } = req.body;

  try {
    const createStat = await dbSeq.statistic.create({
      citizenID: userId,
      fiscal_year,
      range,
      isStatOfLeaveID,
      leave_rights,
      VL_accumulatedDays,
      VL_total,
      VL_lastLeave,
      VL_thisLeave,
      currentUseVL,
      VL_remaining,
      leave_count,
      SL_lastLeave,
      SL_thisLeave,
      SL_remaining,
      SL_In_Range,
      PL_lastLeave,
      PL_thisLeave,
      PL_remaining,
      PL_In_Range,
      ML_thisleave,
      ML_lastleave,
      ML_DayCount,
      ML_In_Range,
      OL_DayCount,
      OL_In_Range,
      STL_DayCount,
      STL_In_Range,
      total_leaveDay,
    });
    res.status(201).json(createStat);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
};

//ใช้ดึงข้อมูลสถิติการลาผ่านstatisticID ใช้ที่หน้าsecondSuperior,firstSuperior,statistics,statPerPerson,ConfirmRequest,DetailPerPerson
exports.getStatisticById = async (req, res) => {
  const statisticID = req.params.statisticID;
  info = await statistic.findOne({
    where: { statisticID: statisticID },
  });
  res.json(info);
};


//ใช้ดึงข้อมูลสติถิทั้งหมดของuser โดยใช้citizenID โดยเรียงจากstatisticIDน้อยไปมาก ขณะนี้มีใช้ที่statPerPerson
exports.getStatisticsOfUser = async (req, res) => {
  const {citizenID,fiscal_year} = req.params;
  const stat = await statistic.findAll({
    where: { citizenID: citizenID,fiscal_year:fiscal_year },
    order: [["statisticID", "ASC"]],
  });
  res.json(stat);
};


// //ไม่ได้ใช้
// exports.statisticDetailByStatistic = async (req, res) => {
//   const userId = req.userId;
//   console.log("req.params:", req.params);
//   const statisticID = req.params.statisticID;
//   try {
//     const statInfo = await statistic.findOne({
//       where: { citizenID: userId, statisticID: statisticID },
//     });

//     if (!statInfo) {
//       return res.json({ error: "Statistic not found" });
//     }

//     res.json(statInfo);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

//ไม่ได้ใช้
//ใช้หาค่าstatisticIDตัวล่าสุดของuser โดยใช้userId ขณะนี้นำไปใช้ในการสร้างleave เพื่อนำค่าสถิติตัวล่าสุดไปใช้setในข้อมูลleave
// exports.lastStatistic = async (req, res) => {
//   const userId = req.userId;
//   try {
//     const last = await statistic.findOne({
//       where: { citizenID: userId },
//       order: [["statisticID", "DESC"]],
//     });

//     if (last) {
//       return last.statisticID;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };


// exports.getPrevStatisticById = async (req, res) => {
//   const userId = req.userId;
//   const statisticID = req.params.statisticID;

//   const leaveData = await dbSeq.leave.findAll({where:{citizenID:userId}})
//   console.log("leaveData: ",leaveData)

//   info = await statistic.findAll({
//     where: {
//       citizenID: userId,
//       statisticID: { [dbSeq.Sequelize.Op.lt]: statisticID },
//     },
//     order: [["statisticID", "DESC"]],
//     limit: 1,
//   });
//   res.json(info);
// };
// //checkว่าwho inspector != null 