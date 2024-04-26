const { where } = require("sequelize");
const dbSeq = require("../Config/index");

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

exports.getUserinSameDivision = async (req, res) => {
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

    const UserinSameDivision = await dbSeq.users.findAll({
      where: { divisionName: userdata.dataValues.divisionName },
      order: [["name", "ASC"]],
    });
    console.log("UserinSameDivision: ", UserinSameDivision);
    res.json(UserinSameDivision);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserForDeputy = async (req, res) => {
  const userId = req.userId;
  try {
    const userdata = await dbSeq.users.findOne({
      attributes: { exclude: ["password"] },
      where: { citizenID: userId },
    });
    if (!userdata) {
      return res.status(404).json({ message: "User not found" });
    }

    const leaveDataArray = await dbSeq.users.findAll({
      where: { divisionName: userdata.dataValues.divisionName },
      include: [
        { model: dbSeq.leave, where: { status: "รอผู้ปฏิบัติหน้าที่แทน" } },
      ],
    });
    console.log("leaveDataArray: ", leaveDataArray);

    const idLeave = leaveDataArray.flatMap((user) =>
      user.leaves.map((leave) => leave.leaveID)
    );

    console.log("idLeave: ", idLeave);

    const regex = /\((\d+)\)/;
    const getLeave = await dbSeq.leave.findOne({
      where: { leaveID: idLeave },
      include: [{ model: dbSeq.vacationleave, where: { leaveID: idLeave } }],
    });

    const matchDeputy = regex.exec(getLeave.vacationleave.deputyName);
    console.log("matchDeputy: ", matchDeputy ? matchDeputy[1] : null);
    console.log("matchDeputy[1]: ", matchDeputy[1]);

    const UserForDeputy = await dbSeq.users.findAll({
      where: { citizenID: matchDeputy[1] },
    });
    console.log("UserForDeputy: ", UserForDeputy);

    const UserGiveDeputy = await dbSeq.users.findOne({
      where: { citizenID: getLeave.citizenID },
    });
    console.log("UserForDeputy: ", UserForDeputy);

    res.json([getLeave,UserGiveDeputy, UserForDeputy]);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateStatus = async (req, res) => {
  const leaveID = req.params.leaveID;
  const { status } = req.body;
  try {
    const update = await dbSeq.leave.update(
      {
        status,
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

exports.updateDateDeputy = async (req, res) => {
  const leaveID = req.params.leaveID;
  const { date_deputy_confirm } = req.body;
  try {
    const update = await dbSeq.vacationleave.update(
      {
        date_deputy_confirm,
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

// exports.getLeaveForDeputy = async (req, res) => {
//   const {citizenID,leaveID} = req.params;
//   info = await dbSeq.users.findAll({
//     where: { citizenID: citizenID },include:[{model:dbSeq.leave,where:{ citizenID: citizenID,leaveID:leaveID}}]
//   });
//   res.json(info);
// };
