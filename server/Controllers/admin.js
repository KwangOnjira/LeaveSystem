const dbSeq = require("../Config/index");
dbSeq.sequelize.sync();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

exports.getAllUsers = async (req, res) => {
  try {
    const user = await dbSeq.users.findAll({
      include: {
        model: dbSeq.statistic,
        order: [["statisticID", "DESC"]],
        limit: 1,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error GetAllUsers" });
  }
};

exports.getAllUsersWithAllStatistic = async (req, res) => {
  try {
    const user = await dbSeq.users.findAll({
      include: {
        model: dbSeq.statistic,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error GetAllUsers" });
  }
};

exports.getAllStatistics = async (req, res) => {
  try {
    const statistic = await dbSeq.statistic.findAll();
    res.json(statistic);
  } catch (error) {
    res.status(500).json({ message: "Error GetAllStatistics" });
  }
};

exports.getFiscalYear = async (req, res) => {
  try {
    const fiscalYear = await dbSeq.statistic.findAll({
      attributes: [
        [
          dbSeq.sequelize.fn("DISTINCT", dbSeq.sequelize.col("fiscal_year")),
          "fiscal_year",
        ],
      ],
      order: [["fiscal_year", "DESC"]],
    });
    res.json(fiscalYear);
  } catch (error) {
    res.status(500).json({ message: "Error GetFiscalYear" });
  }
};

exports.getRange = async (req, res) => {
  const fiscal_year = req.params.fiscal_year;
  try {
    const range = await dbSeq.statistic.findAll({
      where: { fiscal_year: fiscal_year },
      attributes: [
        [dbSeq.sequelize.fn("DISTINCT", dbSeq.sequelize.col("range")), "range"],
      ],
      order: [["range", "DESC"]],
    });
    res.json(range);
  } catch (error) {
    res.status(500).json({ message: "Error GetRange" });
  }
};

exports.getAllStatisticsOfUser = async (req, res) => {
  const citizenID = req.params.citizenID;
  const stat = await dbSeq.statistic.findAll({
    where: { citizenID: citizenID },
    order: [["statisticID", "ASC"]],
  });
  res.json(stat);
};

exports.getUserData = async (req, res) => {
  const citizenID = req.params.citizenID;
  const user = await dbSeq.users.findAll({
    where: { citizenID: citizenID },
  });
  res.json(user);
};

//ใช้ดึงข้อมูลสติถิทั้งหมดของuser โดยใช้citizenID โดยเรียงจากstatisticIDน้อยไปมาก
exports.getStatisticsOfUserForAdmin = async (req, res) => {
  const citizenID = req.params.citizenID;
  const stat = await statistic.findAll({
    where: { citizenID: citizenID },
    order: [["statisticID", "ASC"]],
  });
  res.json(stat);
};

//ใช้updateข้อมูลส่วนตัวของuser
exports.updateDataUser = async (req, res) => {
  const citizenID = req.params.citizenID;
  const {
    prefix,
    name,
    surname,
    role,
    email,
    phone,
    divisionName,
    sub_division,
    position,
    birthday,
    type_of_employee,
    start_of_work_on,
    position_first_supeior,
    position_second_supeior,
    
  } = req.body;

  try {
    const [rowsUpdated, [updatedUser]] = await dbSeq.users.update(
      {
        prefix,
        name,
        surname,
        role,
        email,
        phone,
        divisionName,
        sub_division,
        position,
        birthday,
        type_of_employee,
        start_of_work_on,
        position_first_supeior,
        position_second_supeior,
      },
      {
        where: { citizenID: citizenID },
        returning: true,
      }
    );

    if (rowsUpdated === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Error updating user details" });
  }
};

//ใช้updateข้อมูลส่วนตัวของuser
exports.resetPasswordForAdmin = async (req, res) => {
  const citizenID = req.params.citizenID;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);
  try {
    const rowsUpdated = await dbSeq.users.update(
      {
        password:hashedPassword,
      },
      {
        where: { citizenID: citizenID },
        returning: true,
      }
    );

    if (rowsUpdated === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(rowsUpdated);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Error updating user details" });
  }
};

// exports.createStatForAllUserInReset6Month = async (req, res) => {
//   try {
//     const { range } = req.body;
//     const getUser = await dbSeq.users.findAll();
//     const allStatistics = []; // Array to store all statistics

//     for (const user of getUser) {
//       const lastStatistic = await getDataLastStatisticByCitizen(
//         req,
//         user.citizenID
//       );
//       console.log("lastStatistic", lastStatistic);

//       const setValueData = {
//         citizenID:user.citizenID,
//         fiscal_year: lastStatistic.dataValues.fiscal_year,
//         range:range,
//         isStatOfLeaveID: lastStatistic.dataValues.isStatOfLeaveID,
//         leave_rights: lastStatistic.dataValues.leave_rights,
//         VL_accumulatedDays: lastStatistic.dataValues.VL_accumulatedDays,
//         VL_total: lastStatistic.dataValues.VL_total,
//         VL_lastLeave: lastStatistic.dataValues.VL_lastLeave,
//         VL_thisLeave: lastStatistic.dataValues.VL_thisLeave,
//         currentUseVL: lastStatistic.dataValues.currentUseVL,
//         VL_remaining: lastStatistic.dataValues.VL_remaining,
//         leave_count:0,
//         SL_lastLeave: lastStatistic.dataValues.SL_lastLeave,
//         SL_thisLeave: lastStatistic.dataValues.SL_thisLeave,
//         SL_remaining: lastStatistic.dataValues.SL_remaining,
//         SL_In_Range:0,
//         PL_lastLeave: lastStatistic.dataValues.PL_lastLeave,
//         PL_thisLeave: lastStatistic.dataValues.PL_thisLeave,
//         PL_remaining: lastStatistic.dataValues.PL_remaining,
//         PL_In_Range:0,
//         ML_thisleave: lastStatistic.dataValues.ML_thisLeave,
//         ML_lastleave: lastStatistic.dataValues.ML_lastLeave,
//         ML_DayCount: lastStatistic.dataValues.ML_DayCount,
//         ML_In_Range:0,
//         OL_DayCount: lastStatistic.dataValues.OL_DayCount,
//         OL_In_Range:0,
//         STL_DayCount: lastStatistic.dataValues.STL_DayCount,
//         STL_In_Range:0,
//         total_leaveDay:0,
//       };

//       const createStat = await this.createStatistic({setValueData});

//       allStatistics.push(createStat); // Add the statistic to the array
//     }

//     res.json(allStatistics); // Send the array of statistics as a single response
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// exports.createStatistic = async (setValueData) => { // Modify function signature
//     try {
//       const createStat = await dbSeq.statistic.create(setValueData); // Use setValueData directly
//       return createStat;
//     } catch (error) {
//       console.error(error);
//       throw error; // Rethrow the error to be handled by the caller
//     }
//   };

// //ใช้สร้างข้อมูลสถิติการลาโดยใช้citizenID
// exports.createStatistic = async (req, res) => {
//   const {
//     citizenID,
//     fiscal_year,
//     range,
//     isStatOfLeaveID,
//     leave_rights,
//     VL_accumulatedDays,
//     VL_total,
//     VL_lastLeave,
//     VL_thisLeave,
//     currentUseVL,
//     VL_remaining,
//     leave_count,
//     SL_lastLeave,
//     SL_thisLeave,
//     SL_remaining,
//     SL_In_Range,
//     PL_lastLeave,
//     PL_thisLeave,
//     PL_remaining,
//     PL_In_Range,
//     ML_thisleave,
//     ML_lastleave,
//     ML_DayCount,
//     ML_In_Range,
//     OL_DayCount,
//     OL_In_Range,
//     STL_DayCount,
//     STL_In_Range,
//     total_leaveDay,
//   } = req.body;

//   try {
//     const createStat = await dbSeq.statistic.create({
//       citizenID: citizenID,
//       fiscal_year,
//       range,
//       isStatOfLeaveID,
//       leave_rights,
//       VL_accumulatedDays,
//       VL_total,
//       VL_lastLeave,
//       VL_thisLeave,
//       currentUseVL,
//       VL_remaining,
//       leave_count,
//       SL_lastLeave,
//       SL_thisLeave,
//       SL_remaining,
//       SL_In_Range,
//       PL_lastLeave,
//       PL_thisLeave,
//       PL_remaining,
//       PL_In_Range,
//       ML_thisleave,
//       ML_lastleave,
//       ML_DayCount,
//       ML_In_Range,
//       OL_DayCount,
//       OL_In_Range,
//       STL_DayCount,
//       STL_In_Range,
//       total_leaveDay,
//     });
//     res.status(201).json(createStat);
//   } catch (error) {
//     res.sendStatus(500);
//     console.log(error);
//   }
// };
