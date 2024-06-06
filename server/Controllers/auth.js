const dbSeq = require("../Config/index");
const { users } = dbSeq;
dbSeq.sequelize.sync();
const fs = require("fs");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const { signature } = require("../Middleware/signsignature");
const { where } = require("sequelize");
dotenv.config({ path: "./.env" });

//ใช้สำหรับเก็บลายเซ็นเข้าในระบบ
const saveSignature = async (base64Data, fileName) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(`./signatures/${fileName}`, base64Data, "base64", (err) => {
      if (err) {
        console.error("Error saving signature:", err);
        reject(err);
      } else {
        console.log("Signature saved to file system:", fileName);
        resolve();
      }
    });
  });
};

//ใช้สำหรับสร้างบัญชีผู้ใช้งานใหม่
exports.register = async (req, res) => {
  const {
    citizenID,
    prefix,
    name,
    surname,
    role,
    email,
    phone,
    divisionName,
    sub_division,
    position,
    password,
    birthday,
    type_of_employee,
    start_of_work_on,
    position_first_supeior,
    position_second_supeior,
  } = req.body;

  //Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);

  try {
    const existingUser = await users.findOne({
      where: { citizenID: citizenID },
    });
    if (existingUser) {
      return res.status(400).json({ message: "CitizenID already exists" });
    } else {
      const { base64Data, fileName } = req.signatureData;
      await saveSignature(base64Data, fileName);
      const fullPath = fileName;
      const info = await users.create({
        citizenID,
        prefix,
        name,
        surname,
        role,
        email,
        phone,
        divisionName,
        sub_division,
        position,
        password: hashedPassword,
        birthday,
        type_of_employee,
        start_of_work_on,
        position_first_supeior,
        position_second_supeior,
        signature: fullPath,
      });
      return res.status(201).json(info);
      console.log("register success");
    }
  } catch (error) {
    res.sendStatus(500);
    console.log("error", error);
  }
};

//ใช้สำหรับเข้าสู่ระบบ โดยการเข้าระบบ 1ครั้ง จะอยู่ได้1ชั่วโมง
exports.login = async (req, res) => {
  try {
    const { citizenID, password } = req.body;
    const user = await dbSeq.users.findOne({
      where: { citizenID },
    });
    if (!user) {
      return res.status(404).json("CitizenID not found");
    }

    //verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json("Incorrect citizenID and password combination");
    }

    //Authenticate
    const token = jwt.sign({ userId: user.citizenID }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log(token);

    res.status(200).send({
      name: user.name,
      citizenID: user.citizenID,
      role: user.role,
      accessToken: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send("Sign in error");
  }
};

//ใช้ดึงข้อมูลของuserเพื่อนำมาเช้คrole
exports.currentUser = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await dbSeq.users.findOne({
      where: { citizenID: userId },
      // attributes: { exclude: ["password"] },
    });
    console.log("currentUser", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

//ใช้ดึงข้อมูลของuserที่เป็นaccountที่ใช้เข้าสู่ระบบ
exports.getProfile = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await dbSeq.users.findOne({
      where: { citizenID: userId },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error Fetching Details" });
  }
};

//ใช้updateข้อมูลส่วนตัวของuser
exports.profile = async (req, res) => {
  const userId = req.userId;
  const {
    citizenID,
    prefix,
    name,
    surname,
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
    const { base64Data, fileName } = req.signatureData;
    await saveSignature(base64Data, fileName);
    const fullPath = fileName;
    const rowsUpdated = await dbSeq.users.update(
      {
        citizenID,
        prefix,
        name,
        surname,
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
        signature: fullPath,
      },
      {
        where: { citizenID: userId },
        returning: true,
      }
    );

    if (rowsUpdated === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("update Data")
    res.json(rowsUpdated);
    
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Error updating user details" });
  }
};

//ใช้ดึงข้อมูลของuserจากcitizenID
exports.getUserById = async (req, res) => {
  const citizenID = req.params.citizenID;
  info = await dbSeq.users.findOne({
    where: { citizenID: citizenID },
  });
  res.json(info);
};

//ใช้ดึงข้อมูลลายเซ็นของผู้ตรวจสอบจากleaveID
exports.getSignatureInspector = async (req, res) => {
  const leaveID = req.params.leaveID;

  const getLeave = await dbSeq.leave.findOne({ where: { leaveID: leaveID } });
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

//ใช้ดึงข้อมูลลายเซ็นของผู้รับมอบปฏิบัติงานแทนจากleaveID
exports.getSignatureDeputy = async (req, res) => {
  const leaveID = req.params.leaveID;

  const getLeave = await dbSeq.leave.findOne({
    where: { leaveID: leaveID },
    include: [{ model: dbSeq.vacationleave }],
  });
  console.log(
    "getLeave.vacationleave.deputyName: ",
    getLeave.vacationleave.deputyName
  );
  const regex = /\((\d+)\)/;

  const matchDeputy = regex.exec(getLeave.vacationleave.deputyName);
  console.log("matchDeputy: ", matchDeputy ? matchDeputy[1] : null);

  if (matchDeputy && matchDeputy[1]) {
    const citizenID_User = matchDeputy[1];
    const fetchUser = await dbSeq.users.findOne({
      where: { citizenID: citizenID_User },
    });
    console.log("fetchUser: ", fetchUser);
    res.json(fetchUser.signature);
  } else {
    res.json(null);
    console.log("No Match First Superior.");
  }
};

//ใช้ดึงข้อมูลลายเซ็นของหัวหน้าคนแรกจากleaveID
exports.getSignatureFirstSuperior = async (req, res) => {
  const leaveID = req.params.leaveID;

  const getLeave = await dbSeq.leave.findOne({ where: { leaveID: leaveID } });
  console.log("getLeave.who_first_supeior: ", getLeave.who_first_supeior);
  const regex = /\((\d+)\)/;

  const matchFirstSuperior = regex.exec(getLeave.who_first_supeior);
  console.log(
    "matchFirstSuperior: ",
    matchFirstSuperior ? matchFirstSuperior[1] : null
  );

  if (matchFirstSuperior && matchFirstSuperior[1]) {
    const citizenID_User = matchFirstSuperior[1];
    const fetchUser = await dbSeq.users.findOne({
      where: { citizenID: citizenID_User },
    });
    console.log("fetchUser: ", fetchUser);
    res.json(fetchUser.signature);
  } else {
    res.json(null);
    console.log("No Match First Superior.");
  }
};

//ใช้ดึงข้อมูลลายเซ็นของหัวหน้าคนที่2จากleaveID
exports.getSignatureSecondSuperior = async (req, res) => {
  const leaveID = req.params.leaveID;

  const getLeave = await dbSeq.leave.findOne({ where: { leaveID: leaveID } });
  console.log("getLeave.who_second_supeior: ", getLeave.who_second_supeior);
  const regex = /\((\d+)\)/;

  const matchSecondSuperior = regex.exec(getLeave.who_second_supeior);
  console.log(
    "matchSecondSuperior: ",
    matchSecondSuperior ? matchSecondSuperior[1] : null
  );

  if (matchSecondSuperior && matchSecondSuperior[1]) {
    const citizenID_User = matchSecondSuperior[1];
    const fetchUser = await dbSeq.users.findOne({
      where: { citizenID: citizenID_User },
    });
    console.log("fetchUser: ", fetchUser);
    res.json(fetchUser.signature);
  } else {
    console.log("No Match First Superior.");
  }
};

exports.deleteUsers = async (req, res) => {
  const citizenID = req.params.citizenID;
  try {
    const data = await dbSeq.users.destroy({ where: { citizenID: citizenID } });
    res.status(201).json(data);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
