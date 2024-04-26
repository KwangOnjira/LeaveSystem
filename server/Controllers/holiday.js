const express = require("express");
const app = express();
app.use(express.json());

const dbSeq = require("../Config/index");
const { holiday } = dbSeq;
dbSeq.sequelize.sync();

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

exports.getHoliday = async (req, res) => {
  try {
    const data = await holiday.findAll({});
    res.json(data);
  } catch (error) {
    console.error("Error fetching holidays:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getHolidayById = async (req, res) => {
  const id = req.params.id
  try {
    const data = await holiday.findOne({where:{id:id}});
    res.json(data);
  } catch (error) {
    console.error("Error fetching holidays:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createHoliday = async (req, res) => {
  const {name,date} = req.body
  try {
    const data = await dbSeq.holiday.create({name,date});
    res.status(201).json(data);
  } catch (error) {
    console.error("Error fetching holidays:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteHoliday = async (req, res) => {
  const id = req.params.id
  try {
    const data = await dbSeq.holiday.destroy({where:{id:id}});
    res.status(201).json(data)
  } catch (error) {
    console.error("Error fetching holidays:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateHoliday = async (req, res) => {
  const id = req.params.id
  const { name,date } = req.body;
  try {
    const data = await dbSeq.holiday.update({name,date},{where:{id:id},returning: true,});
    res.json(data[1]);
  } catch (error) {
    console.error("Error fetching holidays:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
