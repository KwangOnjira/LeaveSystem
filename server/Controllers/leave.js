const dbSeq = require("../Config/index");
const { leave } = dbSeq;
dbSeq.sequelize.sync();

var zip = require("express-zip");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

//ใช้ดึงข้อมูลleaveทั้งหมดของuser ผ่านuserID ถูกนำมาใช้ในstaistic(หน้าประวัติการลา)
exports.getAllLeaveOfUser = async (req, res) => {
  const fiscal_year = req.params.fiscal_year;
  const userId = req.userId;
  info = await leave.findAll({
    where: { citizenID: userId, fiscal_year: fiscal_year },
    include: [
      { model: dbSeq.sickleave },
      { model: dbSeq.personalleave },
      { model: dbSeq.vacationleave },
      { model: dbSeq.maternityleave },
      { model: dbSeq.ordinationleave },
      { model: dbSeq.studyleave },
      { model: dbSeq.cancel_leave },
    ],
  });
  res.json(info);
};

//ใช้ดึงข้อมูลleaveทั้งหมดของuser ผ่านcitizenID ถูกนำมาใช้ในหน้าstatPerPerson
exports.getAllLeaveOfUserByCitizenID = async (req, res) => {
  const { citizenID, fiscal_year } = req.params;
  const leave = await dbSeq.leave.findAll({
    where: { citizenID: citizenID, fiscal_year: fiscal_year },
    include: [
      { model: dbSeq.sickleave },
      { model: dbSeq.personalleave },
      { model: dbSeq.vacationleave },
      { model: dbSeq.maternityleave },
      { model: dbSeq.ordinationleave },
      { model: dbSeq.studyleave },
      { model: dbSeq.cancel_leave },
    ],
    order: [["leaveID", "ASC"]],
  });
  res.json(leave);
};

exports.getAllLeaveByCitizenID = async (req, res) => {
  const { citizenID, fiscal_year } = req.params;
  const leave = await dbSeq.leave.findAll({
    where: { citizenID: citizenID, fiscal_year: fiscal_year },
    include: [
      { model: dbSeq.sickleave },
      { model: dbSeq.personalleave },
      { model: dbSeq.vacationleave },
      { model: dbSeq.maternityleave },
      { model: dbSeq.ordinationleave },
      { model: dbSeq.studyleave },
      { model: dbSeq.cancel_leave },
    ],
  });
  res.json(leave);
};

//ใช้ดึงข้อมูลleaveจากชนิดการลาและleaveID ถูกใช้ที่หน้าRepresentative(หน้าดูรายละเอียดของผู้รับมอบปฏิบัติงานแทน)
//ชื่อfunctionหน้าบ้านคือ getLeavebyIdForRequest
exports.getLeaveByIdForRequest = async (req, res) => {
  const { type, leaveID } = req.params;
  info = await leave.findOne({
    where: { type: type, leaveID: leaveID },
    include: [
      { model: dbSeq.sickleave },
      { model: dbSeq.personalleave },
      { model: dbSeq.vacationleave },
      { model: dbSeq.maternityleave },
      { model: dbSeq.ordinationleave },
      { model: dbSeq.studyleave },
    ],
  });
  res.json(info);
};

//ใช้ดึงข้อมูลleaveจากชนิดการลาและleaveID โดยดึงข้อมูลที่มีleaveIDเท่ากับleaveIDที่ส่งไปหรือน้อยกว่าโดยดึงมาแค่2ตัว ผ่านuserId ถูกใช้ที่หน้าdetailPerPerson,statistics(หน้าประวัติการลา)
//จะได้ข้อมูลleaveจากleaveIDของuserที่ส่งไป และได้ข้อมูลleaveก่อนหน้าleaveIDนั้น ที่มีชนิดการลาประเภทเดียวกัน
//ชื่อfunctionหน้าบ้านคือ getLeavebyId
exports.statisticDetailByLeave = async (req, res) => {
  const userId = req.userId;
  console.log("req.params:", req.params);
  const { type, leaveID,fiscal_year } = req.params;
  try {
    const leaveInfo = await leave.findAll({
      where: {
        citizenID: userId,
        type: type,
        fiscal_year:fiscal_year,
        leaveID: {
          [dbSeq.Sequelize.Op.or]: [
            leaveID,
            { [dbSeq.Sequelize.Op.lt]: leaveID },
          ],
        },
      },
      include: [
        { model: dbSeq.sickleave },
        { model: dbSeq.personalleave },
        { model: dbSeq.vacationleave },
        { model: dbSeq.maternityleave },
        { model: dbSeq.ordinationleave },
        { model: dbSeq.studyleave },
      ],
      order: [["leaveID", "DESC"]],
      limit: 2,
    });

    if (!leaveInfo || leaveInfo.length === 0) {
      return res.json({ error: "Leave not found" });
    }
    res.json(leaveInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//ใช้ดึงข้อมูลleaveจากชนิดการลาและleaveID โดยดึงข้อมูลที่มีleaveIDเท่ากับleaveIDที่ส่งไปหรือน้อยกว่าโดยดึงมาแค่2ตัว ผ่านcitizenID ถูกใช้ที่หน้าsecondSuperior,firstSuperior,statPerPerson,confirmRequest,detailPerPerson
//จะได้ข้อมูลleaveจากleaveIDของuserที่ส่งไป และได้ข้อมูลleaveก่อนหน้าleaveIDนั้น ที่มีชนิดการลาประเภทเดียวกัน
exports.prevLeave = async (req, res) => {
  console.log("req.params:", req.params);
  const { citizenID, type, leaveID,fiscal_year } = req.params;
  try {
    const leaveInfo = await leave.findAll({
      where: {
        citizenID: citizenID,
        type: type,
        fiscal_year:fiscal_year,
        leaveID: {
          [dbSeq.Sequelize.Op.or]: [
            leaveID,
            { [dbSeq.Sequelize.Op.lt]: leaveID },
          ],
        },
      },
      include: [
        { model: dbSeq.sickleave },
        { model: dbSeq.personalleave },
        { model: dbSeq.vacationleave },
        { model: dbSeq.maternityleave },
        { model: dbSeq.ordinationleave },
        { model: dbSeq.studyleave },
      ],
      order: [["leaveID", "DESC"]],
      limit: 2,
    });

    if (!leaveInfo || leaveInfo.length === 0) {
      return res.json({ error: "Leave not found" });
    }
    res.json(leaveInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//ใช้ดึงข้อมูลleaveผ่านuserIdและtype โดยจะใช้ดึงข้อมูลล่าสุดของการลาป่วยหรือลากิจหรือลาคลอดตามtypeที่ส่งมา
exports.prevLeaveOfUserID = async (req, res) => {
  const userId = req.userId;
  const {type,fiscal_year} = req.params;
  try {
    const leaveInfo = await leave.findOne({
      where: {
        citizenID: userId,
        type: type,
        fiscal_year:fiscal_year,
        status: "เสร็จสิ้น",
      },
      include: [
        { model: dbSeq.sickleave },
        { model: dbSeq.personalleave },
        { model: dbSeq.maternityleave },
      ],
      order: [["leaveID", "DESC"]],
      limit: 1,
    });

    if (!leaveInfo || leaveInfo.length === 0) {
      return res.json(null);
    }
    res.json(leaveInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//functionที่เขียนเพื่อสร้างรายละเอียดลาแต่ละชนิด ซึ่งจะถูกเรียกไปใช้ในleave
async function createLeave(type, leaveDetails, files) {
  try {
    const filesArray = Array.isArray(files) ? files : [files].filter(Boolean);
    const fileNames =
      type === "sickleave" ? filesArray.map((file) => file.filename) : [];
    const createLeave = await dbSeq.leave.create({
      topic: leaveDetails.topic,
      type: leaveDetails.type,
      fiscal_year: leaveDetails.fiscal_year,
      range: leaveDetails.range,
      to: leaveDetails.to,
      date: leaveDetails.date,
      contact: leaveDetails.contact,
      firstDay: leaveDetails.firstDay,
      lastDay: leaveDetails.lastDay,
      numDay: leaveDetails.numDay,
      status: leaveDetails.status,
      allow: leaveDetails.allow,
      comment: leaveDetails.comment,
      typeCount: leaveDetails.typeCount,
      citizenID: leaveDetails.citizenID,
      statisticID: leaveDetails.statisticID,
    });
    console.log("files:", files);
    console.log("Number of files:", filesArray.length);
    console.log("fileNames:", fileNames);

    switch (type) {
      case "sickleave":
        await dbSeq.sickleave.create({
          leaveID: createLeave.leaveID,
          reason: leaveDetails.reason,
          files: fileNames.join(","),
        });
        break;

      case "personalleave":
        await dbSeq.personalleave.create({
          leaveID: createLeave.leaveID,
          reason: leaveDetails.reason,
        });
        break;

      case "vacationleave":
        await dbSeq.vacationleave.create({
          leaveID: createLeave.leaveID,
          deputyName: leaveDetails.deputyName,
          date_deputy_confirm: leaveDetails.date_deputy_confirm,
        });
        break;

      case "maternityleave":
        await dbSeq.maternityleave.create({
          leaveID: createLeave.leaveID,
        });
        break;

      case "ordinationleave":
        await dbSeq.ordinationleave.create({
          leaveID: createLeave.leaveID,
          level: leaveDetails.level,
          useTo: leaveDetails.useTo,
          nameTemple: leaveDetails.nameTemple,
          addressTemple: leaveDetails.addressTemple,
          dateOrdi: leaveDetails.dateOrdi,
          stayTemple: leaveDetails.stayTemple,
          addressStayTemple: leaveDetails.addressStayTemple,
        });
        break;

      case "studyleave":
        await dbSeq.studyleave.create({
          leaveID: createLeave.leaveID,
          level: leaveDetails.level,
          salaryNumber: leaveDetails.salaryNumber,
          salaryAlphabet: leaveDetails.salaryAlphabet,
          typeStudy: leaveDetails.typeStudy,
          subject: leaveDetails.subject,
          degree: leaveDetails.degree,
          academy: leaveDetails.academy,
          countrystudy: leaveDetails.countrystudy,
          scholarshipstudy: leaveDetails.scholarshipstudy,
          course: leaveDetails.course,
          address: leaveDetails.address,
          countrytrain: leaveDetails.countrytrain,
          scholartrain: leaveDetails.scholartrain,
        });
        break;

      default:
        console.error("Invalid leave type");
        return null;
    }

    console.log(`Leave with type '${type}' created successfully`);
    return createLeave;
  } catch (error) {
    console.error("Error creating leave:", error);
    return null;
  }
}

//ใช้สร้างข้อมูลleave ประเภทการแจ้งลาทุกชนิด ยกเว้นยกเลิกลา
exports.leave = async (req, res) => {
  // const last = await lastStatistic(req, res);
  const type = req.params.type;
  const {
    citizenID,
    statisticID,
    fiscal_year,
    range,
    topic,
    to,
    date,
    contact,
    firstDay,
    lastDay,
    numDay,
    status,
    allow,
    comment,
    typeCount,
    reason,
    deputyName,
    date_deputy_confirm,
    accumulatedDays,
    leaveRights,
    totalDay,
    useTo,
    nameTemple,
    addressTemple,
    dateOrdi,
    stayTemple,
    addressStayTemple,
    level,
    salaryNumber,
    salaryAlphabet,
    typeStudy,
    subject,
    degree,
    academy,
    countrystudy,
    scholarshipstudy,
    course,
    address,
    countrytrain,
    scholartrain,
  } = req.body;

  try {
    console.log("start create");
    const uploadedFiles = req.files && req.files.length > 0 ? req.files : null;
    const leavedetail = await createLeave(
      type,
      {
        citizenID,
        statisticID,
        fiscal_year,
        range,
        type: type,
        topic,
        to,
        date,
        contact,
        firstDay,
        lastDay,
        numDay,
        status,
        allow,
        comment,
        typeCount,
        reason,
        deputyName,
        date_deputy_confirm,
        accumulatedDays,
        leaveRights,
        totalDay,
        useTo,
        nameTemple,
        addressTemple,
        dateOrdi,
        stayTemple,
        addressStayTemple,
        level,
        salaryNumber,
        salaryAlphabet,
        typeStudy,
        subject,
        degree,
        academy,
        countrystudy,
        scholarshipstudy,
        course,
        address,
        countrytrain,
        scholartrain,
      },
      uploadedFiles
    );
    console.log("data: ", leavedetail);
    res.status(201).json(leavedetail);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
};

exports.getLeaveForExport = async (req, res) => {
  const { leaveID } = req.params;
  info = await leave.findOne({
    where: { leaveID: leaveID },
    include: [
      { model: dbSeq.sickleave },
      { model: dbSeq.personalleave },
      { model: dbSeq.vacationleave },
    ],
  });
  res.json(info);
};

exports.dowloadFiles = async (req, res) => {
  try {
    const files = req.params.files.split(",");
    const filePaths = files.map((file) =>
      path.join(__dirname, "../uploads/medical/", file)
    );

    const zipFiles = filePaths.map((filePath) => {
      return { path: filePath, name: path.basename(filePath) };
    });

    res.zip(zipFiles, "medical_files.zip");
  } catch (error) {
    console.error("Error downloading files:", error);
    res.status(500).send("Error downloading files");
  }
};

exports.deleteRequest = async (req, res) => {
  const leaveID = req.params.leaveID;
  try {
    const data = await dbSeq.leave.destroy({ where: { leaveID: leaveID } });
    res.status(201).json(data);
  } catch (error) {
    console.error("Error fetching leave:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//ไม่ได้ใช้
// exports.getLeave = async (req, res) => {
//   const userId = req.userId;
//   info = await leave.findAll({
//     where: { citizenID: userId },
//     include: [{ model: dbSeq.statistic }],
//   });
//   res.json(info);
// };

// ไม่ได้ใช้
// exports.getLeaveStatBymyId = async (req, res) => {
//   const userId = req.userId;
//   const statid = req.params.statid;
//   info = await leave.findOne({
//     where: { citizenID: userId, statisticID: statid },
//   });
//   res.json(info);
// };

// //ไม่ได้ใช้
// //ใช้ดึงข้อมูลleave 2ตัวล่าสุด ผ่านuserId
// exports.getDataLastLeave = async (req, res) => {
//   const userId = req.userId;

//   try {
//     const getLastLeave = await dbSeq.leave.findAll({
//       where: { citizenID: userId },
//       order: [["leaveID", "DESC"]],
//       limit: 2,
//     });
//     if (getLastLeave) {
//       console.log("getLastLeave: ", getLastLeave);
//       return res.json(getLastLeave);
//     } else {
//       return res.status(404).json({ error: "Last statistic not found" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
