const express = require("express");
const app = express();
app.use(express.json());

const dbSeq = require("../Config/index");
const { users } = dbSeq;
dbSeq.sequelize.sync();

const dotenv = require("dotenv");
const statistic = require("../Models/statistic");
dotenv.config({ path: "./.env" });

exports.sameDivision = async (req, res) => {
  const { fiscal_year, range } = req.params;
  const userId = req.userId;
  try {
    const userdata = await dbSeq.users.findOne({
      attributes: { exclude: ["password"] },
      where: { citizenID: userId },
    });
    console.log(
      "userdata.dataValues in Same Division",
      userdata.dataValues.divisionName
    );
    if (!userdata) {
      return res.status(404).json({ message: "User not found" });
    }

    const usersWithSameDivision = await dbSeq.users.findAll({
      where: { divisionName: userdata.dataValues.divisionName },
      include: {
        where: { fiscal_year: fiscal_year, range: range },
        model: dbSeq.statistic,
        order: [["statisticID", "DESC"]],
        limit: 1,
      },
    });

    console.log("usersWithSameDivision: ", usersWithSameDivision);
    res.json(usersWithSameDivision);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.divisionOfficePAO = async (req, res) => {
  const { fiscal_year, range } = req.params;
  const userId = req.userId;
  try {
    const userdata = await dbSeq.users.findOne({
      attributes: { exclude: ["password"] },
      where: { citizenID: userId },
    });
    console.log(
      "userdata.dataValues in Same Division",
      userdata.dataValues.divisionName
    );
    if (!userdata) {
      return res.status(404).json({ message: "User not found" });
    }

    const usersindivisionOfficePAO = await dbSeq.users.findAll({
      where: {
        [dbSeq.Sequelize.Op.or]: [
          { divisionName: userdata.dataValues.divisionName },
          { sub_division: { [dbSeq.Sequelize.Op.substring]: "ปลัด" } },
        ],
      },
      include: {
        model: dbSeq.statistic,
        where: { fiscal_year: fiscal_year, range: range },
        order: [["statisticID", "DESC"]],
        limit: 1,
      },
    });

    console.log("usersindivisionOfficePAO: ", usersindivisionOfficePAO);
    res.json(usersindivisionOfficePAO);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.sameBothDivAndSubDiv = async (req, res) => {
  const { fiscal_year, range } = req.params;
  const userId = req.userId;
  try {
    const userdata = await dbSeq.users.findOne({
      attributes: { exclude: ["password"] },
      where: { citizenID: userId },
    });

    console.log(
      "userdata.dataValues in Same Division",
      userdata.dataValues.divisionName
    );

    console.log(
      "userdata.dataValues in Same Division",
      userdata.dataValues.sub_division
    );
    if (!userdata) {
      return res.status(404).json({ message: "User not found" });
    }

    const sameBothDivAndSubDiv = await dbSeq.users.findAll({
      where: {
        divisionName: userdata.dataValues.divisionName,
        sub_division: userdata.dataValues.sub_division,
      },
      include: {
        model: dbSeq.statistic,
        where: { fiscal_year: fiscal_year, range: range },
        order: [["statisticID", "DESC"]],
        limit: 1,
      },
    });

    console.log("sameBothDivAndSubDiv: ", sameBothDivAndSubDiv);
    res.json(sameBothDivAndSubDiv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const citizenID = req.params.citizenID;
    const userdata = await dbSeq.users.findOne({
      // attributes: { exclude: ["password"] },
      where: { citizenID: citizenID },
      include: [
        { model: dbSeq.statistic },
        { model: dbSeq.leave },
        { model: dbSeq.cancel_leave },
      ],
    });
    console.log("userdata: ", userdata);
    res.json(userdata);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserforEdit = async (req, res) => {
  try {
    const { citizenID, statisticID } = req.params;
    const userdata = await dbSeq.users.findOne({
      attributes: { exclude: ["password"] },
      where: { citizenID: citizenID },
      include: [
        { model: dbSeq.statistic, where: { statisticID: statisticID } },
      ],
    });
    console.log("userdata: ", userdata);
    res.json(userdata);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateLastStatistic = async (req, res) => {
  const {
    leave_count,
    leave_rights,
    VL_accumulatedDays,
    VL_total,
    VL_lastLeave,
    currentUseVL,
    VL_remaining,
    SL_remaining,
    SL_In_Range,
    PL_remaining,
    PL_In_Range,
    ML_DayCount,
    ML_In_Range,
    OL_DayCount,
    OL_In_Range,
    STL_DayCount,
    STL_In_Range,
  } = req.body;
  try {
    const { citizenID, statisticID } = req.params;
    console.log("Received citizenID:", citizenID);

    const latestStatistic = await dbSeq.statistic.findOne({
      where: { citizenID: citizenID },
      where: { statisticID: statisticID },
    });

    console.log("latestStatistic: ", latestStatistic);

    if (!latestStatistic) {
      return res.status(404).json({ message: "User not Found" });
    }

    const updatedVL_remaining = VL_total - currentUseVL;
    // const updatedcurrentUserVL = VL_lastLeave + VL_thisLeave;

    const [updateStat] = await dbSeq.statistic.update(
      {
        leave_count,
        leave_rights,
        VL_accumulatedDays,
        VL_total,
        VL_lastLeave,
        currentUseVL,
        VL_remaining: updatedVL_remaining,
        SL_remaining,
        SL_In_Range,
        PL_remaining,
        PL_In_Range,
        ML_DayCount,
        ML_In_Range,
        OL_DayCount,
        OL_In_Range,
        STL_DayCount,
        STL_In_Range,
      },
      {
        where: { statisticID: latestStatistic.statisticID },
      }
    );

    console.log("Rows updated: ", updateStat);

    res.json({ updateStat });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//For request
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.sameDivisionForRequest = async (req, res) => {
  const userId = req.userId;
  try {
    const userdata = await dbSeq.users.findOne({
      attributes: { exclude: ["password"] },
      where: { citizenID: userId },
    });
    console.log(
      "userdata.dataValues in Same Division",
      userdata.dataValues.divisionName
    );
    if (!userdata) {
      return res.status(404).json({ message: "User not found" });
    }

    const usersWithSameDivision = await dbSeq.users.findAll({
      where: { divisionName: userdata.dataValues.divisionName },
      include: [
        { model: dbSeq.leave, where: { status: "รอผู้ตรวจสอบ" } },
        {
          model: dbSeq.statistic,
          // order: [["statisticID", "DESC"]],
          // limit: 1,
        },
      ],
    });
    console.log("usersWithSameDivision: ", usersWithSameDivision);
    res.json(usersWithSameDivision);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.divisionOfficePAOForRequest = async (req, res) => {
  const userId = req.userId;
  try {
    const userdata = await dbSeq.users.findOne({
      attributes: { exclude: ["password"] },
      where: { citizenID: userId },
    });
    console.log(
      "userdata.dataValues in Same Division",
      userdata.dataValues.divisionName
    );
    if (!userdata) {
      return res.status(404).json({ message: "User not found" });
    }

    const usersWithdivisionOfficePAO = await dbSeq.users.findAll({
      where: {
        [dbSeq.Sequelize.Op.or]: [
          { divisionName: userdata.dataValues.divisionName },
          { sub_division: { [dbSeq.Sequelize.Op.substring]: "ปลัด" } },
        ],
      },
      include: [
        { model: dbSeq.leave, where: { status: "รอผู้ตรวจสอบ" } },
        {
          model: dbSeq.statistic,
          // order: [["statisticID", "DESC"]],
          // limit: 1,
        },
      ],
    });

    console.log("usersWithdivisionOfficePAO: ", usersWithdivisionOfficePAO);
    res.json(usersWithdivisionOfficePAO);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.sameBothDivAndSubDivForRequest = async (req, res) => {
  const userId = req.userId;
  try {
    const userdata = await dbSeq.users.findOne({
      attributes: { exclude: ["password"] },
      where: { citizenID: userId },
    });

    console.log(
      "userdata.dataValues in Same Division",
      userdata.dataValues.divisionName
    );

    console.log(
      "userdata.dataValues in Same Division",
      userdata.dataValues.sub_division
    );
    if (!userdata) {
      return res.status(404).json({ message: "User not found" });
    }

    const sameBothDivAndSubDiv = await dbSeq.users.findAll({
      where: {
        divisionName: userdata.dataValues.divisionName,
        sub_division: userdata.dataValues.sub_division,
      },
      include: [
        { model: dbSeq.leave, where: { status: "รอผู้ตรวจสอบ" } },
        {
          model: dbSeq.statistic,
          // order: [["statisticID", "DESC"]],
          // limit: 1,
        },
      ],
    });

    console.log("sameBothDivAndSubDiv: ", sameBothDivAndSubDiv);
    res.json(sameBothDivAndSubDiv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateLeave = async (req, res) => {
  const leaveID = req.params.leaveID;
  const {
    status,
    who_inspector,
    who_first_supeior,
    date_inspector,
    who_second_supeior,
  } = req.body;
  console.log("Received leaveID:", leaveID);
  try {
    const updateleave = await dbSeq.leave.update(
      {
        status,
        who_inspector,
        date_inspector,
        who_first_supeior,
        who_second_supeior,
      },
      {
        where: { leaveID: leaveID },
        returning: true,
      }
    );
    console.log("updated: ", updateleave[1]);

    res.json(updateleave[1]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getDataLastStatisticByid = async (req, res) => {
  const citizenID = req.params.citizenID;

  try {
    const getLastStatistic = await dbSeq.statistic.findOne({
      where: { citizenID: citizenID },
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

exports.createStatisticByid = async (req, res) => {
  const citizenID = req.params.citizenID;
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
      citizenID: citizenID,
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

exports.updateLeaveCount = async (req, res) => {
  const statisticID = req.params.statisticID;
  const { leave_count } = req.body;
  console.log("Received statisticID:", statisticID);
  try {
    const updateLeaveCount = await dbSeq.statistic.update(
      {
        leave_count,
      },
      {
        where: { statisticID: statisticID },
        returning: true,
      }
    );
    console.log("updated: ", updateLeaveCount[1]);

    res.json(updateLeaveCount[1]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Export to Excel

exports.samedivisionTypeEmployee = async (req, res) => {
  const { fiscal_year, range, type_of_employee } = req.params;
  const userId = req.userId;
  try {
    const userdata = await dbSeq.users.findOne({
      attributes: { exclude: ["password"] },
      where: { citizenID: userId },
    });
    console.log(
      "userdata.dataValues in Same Division",
      userdata.dataValues.divisionName
    );
    if (!userdata) {
      return res.status(404).json({ message: "User not found" });
    }

    const usersWithSameDivision = await dbSeq.users.findAll({
      where: {
        divisionName: userdata.dataValues.divisionName,
        type_of_employee: type_of_employee,
      },
      include: {
        where: { fiscal_year: fiscal_year, range: range },
        model: dbSeq.statistic,
        order: [["statisticID", "DESC"]],
        limit: 1,
      },
    });

    console.log("usersWithSameDivision: ", usersWithSameDivision);
    res.json(usersWithSameDivision);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.divisionOfficePAOTypeEmployee = async (req, res) => {
  const { fiscal_year, range, type_of_employee } = req.params;
  const userId = req.userId;
  try {
    const userdata = await dbSeq.users.findOne({
      attributes: { exclude: ["password"] },
      where: { citizenID: userId },
    });
    console.log(
      "userdata.dataValues in Same Division",
      userdata.dataValues.divisionName
    );
    if (!userdata) {
      return res.status(404).json({ message: "User not found" });
    }

    const usersindivisionOfficePAO = await dbSeq.users.findAll({
      where: {
        type_of_employee: type_of_employee,
        [dbSeq.Sequelize.Op.or]: [
          { divisionName: userdata.dataValues.divisionName },
          { sub_division: { [dbSeq.Sequelize.Op.substring]: "ปลัด" } },
        ],
      },
      include: {
        where: { fiscal_year: fiscal_year, range: range },
        model: dbSeq.statistic,
        order: [["statisticID", "DESC"]],
        limit: 1,
      },
    });

    console.log("usersindivisionOfficePAO: ", usersindivisionOfficePAO);
    res.json(usersindivisionOfficePAO);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.sameBothDivAndSubDivTypeEmployee = async (req, res) => {
  const { fiscal_year, range, type_of_employee } = req.params;
  const userId = req.userId;
  try {
    const userdata = await dbSeq.users.findOne({
      attributes: { exclude: ["password"] },
      where: { citizenID: userId },
    });

    console.log(
      "userdata.dataValues in Same Division",
      userdata.dataValues.divisionName
    );

    console.log(
      "userdata.dataValues in Same Division",
      userdata.dataValues.sub_division
    );
    if (!userdata) {
      return res.status(404).json({ message: "User not found" });
    }

    const sameBothDivAndSubDiv = await dbSeq.users.findAll({
      where: {
        divisionName: userdata.dataValues.divisionName,
        sub_division: userdata.dataValues.sub_division,
        type_of_employee: type_of_employee,
      },
      include: {
        model: dbSeq.statistic,
        where: { fiscal_year: fiscal_year, range: range },
        order: [["statisticID", "DESC"]],
        limit: 1,
      },
    });

    console.log("sameBothDivAndSubDiv: ", sameBothDivAndSubDiv);
    res.json(sameBothDivAndSubDiv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// exports.statLeave = async(req,res) =>{
//   try {
//     const data = await dbSeq.statistic.findAll({

//     })
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }
