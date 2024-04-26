const express = require('express');
const { getHoliday, createHoliday, deleteHoliday, updateHoliday, getHolidayById } = require('../Controllers/holiday');
const { authenticate } = require('../Middleware/auth');
const router = express.Router()

router.get("/getHoliday",authenticate,getHoliday)
router.get("/getHolidayById/:id",authenticate,getHolidayById)
router.post("/createHoliday",authenticate,createHoliday)
router.delete("/deleteHoliday/:id",authenticate,deleteHoliday)
router.put("/updateHoliday/:id",authenticate,updateHoliday)

module.exports = router