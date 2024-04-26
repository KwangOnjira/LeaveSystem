const dbSeq = require("../Config/index");
const { cancel_leave } = dbSeq;
dbSeq.sequelize.sync();

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

exports.getLeavebyUserID = async (req, res) => {
  const userId = req.userId;
  const leaveID = req.params.leaveID;
  info = await dbSeq.leave.findAll({
    where: { citizenID: userId, leaveID: leaveID },
  });
  res.json(info);
};

exports.createCancelLeave = async (req, res) => {
  const userId = req.userId;
  const {
    leaveID,
    citizenID,
    statisticID,
    topic,
    to,
    reason,
    date,
    typeCount,
    cancelFirstDay,
    cancelLastDay,
    cancelNumDay,
    status,
    allow,
    comment,
    who_inspector,
    date_inspector,
    who_first_supeior,
    date_first_supeior,
    who_second_supeior,
    date_second_supeior,
  } = req.body;

  try {
    console.log("start create");
    const cancelDetail = await dbSeq.cancel_leave.create({
      leaveID,
      citizenID: userId,
      statisticID,
      topic,
      to,
      reason,
      date,
      typeCount,
      cancelFirstDay,
      cancelLastDay,
      cancelNumDay,
      status,
      allow,
      comment,
      who_inspector,
      date_inspector,
      who_first_supeior,
      date_first_supeior,
      who_second_supeior,
      date_second_supeior,
    });
    console.log(cancelDetail);
    res.status(201).json(cancelDetail);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
};

exports.updateAllowLeave = async (req, res) => {
  const leaveID = req.params.leaveID;
  const { cancelOrNot } = req.body;
  console.log("Received leaveID:", leaveID);
  try {
    const updateleave = await dbSeq.leave.update(
      {
        cancelOrNot,
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

//For Request
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.cancelSameDivisionForRequest = async (req, res) => {
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
        { model: dbSeq.cancel_leave, where: { status: "รอผู้ตรวจสอบ" } },
        {
          model: dbSeq.statistic,
          order: [["statisticID", "DESC"]],
          limit: 1,
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

/////////////////////////////////////////////////////////////////////////////
exports.cancelDivisionOfficePAOForRequest = async (req, res) => {
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
        { model: dbSeq.cancel_leave, where: { status: "รอผู้ตรวจสอบ" } },
        {
          model: dbSeq.statistic,
          order: [["statisticID", "DESC"]],
          limit: 1,
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
/////////////////////////////////////////////////////////////////////////////
exports.cancelSameBothDivAndSubDivForRequest = async (req, res) => {
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
        { model: dbSeq.cancel_leave, where: { status: "รอผู้ตรวจสอบ" } },
        {
          model: dbSeq.statistic,
          order: [["statisticID", "DESC"]],
          limit: 1,
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getCancelLeave = async (req, res) => {
  const { citizenID, cancelID } = req.params;
  info = await dbSeq.cancel_leave.findAll({
    where: { citizenID: citizenID, cancelID: cancelID },
  });
  res.json(info);
};

exports.updateCancelLeave = async (req, res) => {
  const cancelID = req.params.cancelID;
  const {
    status,
    who_inspector,
    date_inspector,
    who_first_supeior,
    who_second_supeior,
  } = req.body;
  console.log("Received cancelID:", cancelID);
  try {
    const updateleave = await dbSeq.cancel_leave.update(
      {
        status,
        who_inspector,
        date_inspector,
        who_first_supeior,
        who_second_supeior,
      },
      {
        where: { cancelID: cancelID },
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

exports.getMatchStatusCancel = async (req, res) => {
  try {
    const leaveDataArray = await dbSeq.cancel_leave.findAll();

    const removeWait = "รอ";
    const matchedEntries = [];

    leaveDataArray.forEach((leaveData) => {
      const matchFirst = leaveData.who_first_supeior?.match(/\(([^)]+)\)/);
      console.log("matchFirst: ", matchFirst ? matchFirst[1] : null);
      const matchSecond = leaveData.who_second_supeior?.match(/\(([^)]+)\)/);
      console.log("matchSecond: ", matchSecond ? matchSecond[1] : null);

      if (leaveData.status.startsWith(removeWait)) {
        const result = leaveData.status.substring(removeWait.length);
        console.log("result: ", result);

        if (matchFirst && result === matchFirst[1]) {
          console.log("result === matchFirst: ", matchFirst[1]);
          matchedEntries.push([
            leaveData.cancelID,
            "who_first_supeior",
            result,
          ]);
        } else if (matchSecond && result === matchSecond[1]) {
          console.log("result === matchSecond: ", matchSecond[1]);
          matchedEntries.push([
            leaveData.cancelID,
            "who_second_supeior",
            result,
          ]);
        } else {
          console.log("No match found");
        }
      } else {
        console.log("Prefix not found");
      }
    });

    if (matchedEntries.length > 0) {
      return res.json(matchedEntries);
    } else {
      console.log("No matching entries found");
      return res.status(404).json({ error: "No matching entries found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserMatchCancel = async (req, res) => {
  const userId = req.userId;
  try {
    const userdata = await dbSeq.users.findOne({
      attributes: { exclude: ["password"] },
      where: { citizenID: userId },
    });

    if (!userdata) {
      return res.status(404).json({ message: "User not found" });
    }

    const leaveData = await dbSeq.users.findAll({
      include: [
        {
          model: dbSeq.cancel_leave,
          where: { status: `รอ${userdata.position}` },
        },
        { model: dbSeq.statistic, order: [["statisticID", "DESC"]], limit: 1 },
      ],
    });

    console.log(`status:รอ${userdata.position}`, userdata.position);

    console.log("leaveData: ", leaveData);
    res.json(leaveData);
  } catch (error) {}
};

exports.updateCommentCancel = async (req, res) => {
  const cancelID = req.params.cancelID;
  const { comment, status, date_first_supeior } = req.body;
  try {
    const update = await dbSeq.cancel_leave.update(
      {
        comment,
        status,
        date_first_supeior,
      },
      {
        where: { cancelID: cancelID },
        returning: true,
      }
    );
    console.log("updated: ", update[1]);

    res.json(update[1]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateCompleteStatusCancel = async (req, res) => {
  const cancelID = req.params.cancelID;
  const { allow, status, date_second_supeior } = req.body;
  try {
    const update = await dbSeq.cancel_leave.update(
      {
        allow,
        status,
        date_second_supeior,
      },
      {
        where: { cancelID: cancelID },
        returning: true,
      }
    );
    console.log("updated: ", update[1]);

    res.json(update[1]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createStatisticByidCancel = async (req, res) => {
  const citizenID = req.params.citizenID;
  const {
    isStatOfLeaveID,
    isStatOfCancelID,
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
      isStatOfLeaveID,
      isStatOfCancelID,
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

exports.getLastLeavebyUserID = async (req, res) => {
  const { citizenID, leaveID } = req.params;
  info = await dbSeq.leave.findAll({
    where: {
      citizenID: citizenID,
      type: "vacationleave",
      leaveID: { [dbSeq.Sequelize.Op.lte]: leaveID },
    },
    order: [["leaveID", "DESC"]],
    limit: 2,
  });
  res.json(info);
};

exports.getStatisticLastLeavebyUserID = async (req, res) => {
  const { citizenID, leaveID } = req.params;
  info = await dbSeq.statistic.findAll({
    where: {
      citizenID: citizenID,
      isStatOfLeaveID: leaveID,
    },
    order: [["statisticID", "DESC"]],
    limit: 1,
  });
  res.json(info);
};

exports.getCancelLeaveForExport = async (req, res) => {
  const { cancelID } = req.params;
  info = await dbSeq.cancel_leave.findOne({
    where: { cancelID: cancelID },
  });
  res.json(info);
};

//ใช้ดึงข้อมูลลายเซ็นของผู้ตรวจสอบจากleaveID
exports.getSignatureInspectorForCancel = async (req, res) => {
  const cancelID = req.params.cancelID;

  const getLeave = await dbSeq.cancel_leave.findOne({ where: { cancelID: cancelID } });
  console.log("getLeave.who_inspector: ", getLeave.who_inspector);

  const regex = /\((\d+)\)/;

  const matchInspec = regex.exec(getLeave.who_inspector);
  console.log("matchInspec: ", matchInspec ? matchInspec[1] : null);

  if (matchInspec && matchInspec[1]) {
    const citizenID_User = matchInspec[1];
    const fetchUser = await dbSeq.users.findOne({
      where: { citizenID: citizenID_User },
    });
    console.log("fetchUser: ", fetchUser);
    res.json(fetchUser.signature);
  } else {
    console.log("No Match Inspector.");
  }
};

exports.deleteCancelRequest = async (req, res) => {
  const cancelID = req.params.cancelID;
  try {
    const data = await dbSeq.cancel_leave.destroy({ where: { cancelID: cancelID } });
    res.status(201).json(data);
  } catch (error) {
    console.error("Error fetching leave:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};