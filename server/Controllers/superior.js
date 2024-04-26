const express = require("express");
const app = express();
app.use(express.json());
const dbSeq = require("../Config/index");
dbSeq.sequelize.sync();

const dotenv = require("dotenv");
const { where } = require("sequelize");
dotenv.config({ path: "./.env" });

exports.getUserFromPosition = async (req, res) => {
  const { position, divisionName } = req.params;

  try {
    const data = await dbSeq.users.findOne({
      attributes: { exclude: ["password"] },
      where: { position: position, divisionName: divisionName },
    });

    if (data) {
      console.log("data: ", data);
      res.json(data);
    } else {
      console.log("User not found for position: ", position);
      res.json(null);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserFromOnlyPosition = async (req, res) => {
  const { position } = req.params;

  try {
    const data = await dbSeq.users.findOne({
      attributes: { exclude: ["password"] },
      where: { position: position },
    });

    if (data) {
      console.log("data: ", data);
      res.json(data);
    } else {
      console.log("User not found for position: ", position);
      res.json(null);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSuperior = async (req, res) => {
  try {
    const data = await dbSeq.users.findAll({
      attributes: { exclude: ["password"] },
      where: { role: "superior" },
    });
    console.log("data: ", data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllSuperiorInSameDivision = async (req, res) => {
  const citizenID = req.params.citizenID;
  try {
    const userData = await dbSeq.users.findOne({
      attributes: { exclude: ["password"] },
      where: { citizenID: citizenID },
    });

    console.log(userData.dataValues.citizenID);

    const data = await dbSeq.users.findAll({
      attributes: { exclude: ["password"] },
      where: { role: "superior",divisionName:userData.dataValues.divisionName },
    });
    console.log("data: ", data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllFirstSuperior = async (req, res) => {
  try {
    const data = await dbSeq.users.findAll({
      attributes: { exclude: ["password"] },
      where: {
        role: "superior",
        [dbSeq.Sequelize.Op.or]: [
          { position: { [dbSeq.Sequelize.Op.substring]: "หัวหน้าฝ่าย" } },
          { position: { [dbSeq.Sequelize.Op.substring]: "หัวหน้ากลุ่ม" } },
          { position: { [dbSeq.Sequelize.Op.substring]: "หัวหน้าโรงพยาบาล" } },
        ],
      },
    });
    console.log("data: ", data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllSecondSuperiorInDivision = async (req, res) => {
  try {
    const data = await dbSeq.users.findAll({
      attributes: { exclude: ["password"] },
      where: {
        role: "superior",
        [dbSeq.Sequelize.Op.or]: [
          { position: { [dbSeq.Sequelize.Op.substring]: "หัวหน้าสำนัก" } },
          { position: { [dbSeq.Sequelize.Op.substring]: "หัวหน้าหน่วย" } },
          { position: { [dbSeq.Sequelize.Op.substring]: "เลขานุการ" } },
          { position: { [dbSeq.Sequelize.Op.substring]: "ผู้อำนวยการ" } },
        ],
      },
    });
    console.log("data: ", data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllHightSecondSuperior = async (req, res) => {
  try {
    const data = await dbSeq.users.findAll({
      attributes: { exclude: ["password"] },
      where: {
        role: "superior",
        [dbSeq.Sequelize.Op.or]: [
          { position: { [dbSeq.Sequelize.Op.substring]: "ปลัดองค์" } },
          { position: { [dbSeq.Sequelize.Op.substring]: "นายก" } },
        ],
      },
    });
    console.log("data: ", data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getFirstSuperior = async (req, res) => {
  const citizenID = req.params.citizenID;
  try {
    const userData = await dbSeq.users.findOne({
      attributes: { exclude: ["password"] },
      where: { citizenID: citizenID },
    });
    console.log(userData.dataValues.citizenID);

    const data = await dbSeq.users.findAll({
      attributes: { exclude: ["password"] },
      where: {
        divisionName: userData.dataValues.divisionName,
        // sub_division: userData.dataValues.sub_division,
        role: "superior",
        [dbSeq.Sequelize.Op.or]: [
          { position: { [dbSeq.Sequelize.Op.substring]: "หัวหน้าฝ่าย" } },
          { position: { [dbSeq.Sequelize.Op.substring]: "หัวหน้ากลุ่ม" } },
          { position: { [dbSeq.Sequelize.Op.substring]: "หัวหน้าโรงพยาบาล" } },
        ],
      },
    });
    console.log("data: ", data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSomeSecondSuperior = async (req, res) => {
  const citizenID = req.params.citizenID;
  try {
    const userData = await dbSeq.users.findOne({
      attributes: { exclude: ["password"] },
      where: { citizenID: citizenID },
    });
    console.log(userData.dataValues.citizenID);

    const data = await dbSeq.users.findAll({
      attributes: { exclude: ["password"] },
      where: {
        divisionName: userData.dataValues.divisionName,
        role: "superior",
        [dbSeq.Sequelize.Op.or]: [
          { position: { [dbSeq.Sequelize.Op.substring]: "หัวหน้า" } },
          { position: { [dbSeq.Sequelize.Op.substring]: "เลขานุการ" } },
          { position: { [dbSeq.Sequelize.Op.substring]: "ผู้อำนวยการ" } },
        ],
      },
    });
    console.log("data: ", data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateFirstSuperior = async (req, res) => {
  const userId = req.userId;
  const { position_first_supeior } = req.body;
  try {
    const update = await dbSeq.users.update(
      {
        position_first_supeior,
      },
      {
        where: { citizenID: userId },
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

exports.getMatchStatus = async (req, res) => {
  try {
    const leaveDataArray = await dbSeq.leave.findAll();

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
          matchedEntries.push([leaveData.leaveID, "who_first_supeior", result]);
        } else if (matchSecond && result === matchSecond[1]) {
          console.log("result === matchSecond: ", matchSecond[1]);
          matchedEntries.push([
            leaveData.leaveID,
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

exports.getUserMatch = async (req, res) => {
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
        { model: dbSeq.leave, where: { status: `รอ${userdata.position}` } },
        { model: dbSeq.statistic },
      ],
    });

    console.log(`status:รอ${userdata.position}`, userdata.position);

    console.log("leaveData: ", leaveData);
    res.json(leaveData);
  } catch (error) {}
};

exports.updateComment = async (req, res) => {
  const leaveID = req.params.leaveID;
  const { comment, status, date_first_supeior } = req.body;
  try {
    const update = await dbSeq.leave.update(
      {
        comment,
        status,
        date_first_supeior,
      },
      {
        where: { leaveID: leaveID },
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

exports.updateCompleteStatus = async (req, res) => {
  const leaveID = req.params.leaveID;
  const { allow, status, date_second_supeior } = req.body;
  try {
    const update = await dbSeq.leave.update(
      {
        allow,
        status,
        date_second_supeior,
      },
      {
        where: { leaveID: leaveID },
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
