const express = require("express");
const { authenticate } = require("../Middleware/auth");
const { getAllUsers, getAllStatistics, getFiscalYear, getAllUsersWithAllStatistic, getAllStatisticsOfUser, getUserData, getRange, getStatisticsOfUserForAdmin, updateDataUser, resetPasswordForAdmin } = require("../Controllers/admin");
// const { createStatForAllUserInReset6Month } = require("../Controllers/admin");
const router = express.Router();

// router.post("/createStatForReset6Month",authenticate,createStatForAllUserInReset6Month)
router.get("/getAllUsers",authenticate,getAllUsers)
router.get("/getAllStatistics",authenticate,getAllStatistics)
router.get("/getAllUsersWithAllStatistic",authenticate,getAllUsersWithAllStatistic)
router.get("/getAllStatisticsOfUser/:citizenID",authenticate,getAllStatisticsOfUser)
router.get("/getFiscalYear",authenticate,getFiscalYear)
router.get("/getRange/:fiscal_year",authenticate,getRange)
router.get("/getUserData/:citizenID",authenticate,getUserData)
router.get("/getStatisticsOfUserForAdmin/:citizenID",authenticate,getStatisticsOfUserForAdmin)
router.put("/updateDataUser/:citizenID",authenticate,updateDataUser)
router.put("/resetPasswordForAdmin/:citizenID",authenticate,resetPasswordForAdmin)

module.exports = router