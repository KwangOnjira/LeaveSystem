const express = require('express');
const { leave, statisticDetailByLeave, prevLeave, getAllLeaveOfUser, prevLeaveOfUserID, getAllLeaveOfUserByCitizenID, getLeaveForExport, dowloadFiles, getAllLeaveByCitizenID, deleteRequest, getLeaveByIdForRequest} = require('../Controllers/leave');
const { authenticate } = require('../Middleware/auth');
const { upload } = require('../Middleware/upload');
const router = express.Router()

router.post("/leave/:type",authenticate,upload,leave)
// router.get("/getLeave",authenticate,getLeave)
// router.get("/getDataLastLeave",authenticate,getDataLastLeave)
// router.get("/getLeaveStatBymyId/:statid",authenticate,getLeaveStatBymyId)
router.get("/statisticsDetailLeave/:type/:leaveID/:fiscal_year", authenticate,statisticDetailByLeave);
router.get("/getLeaveByIdForRequest/:type/:leaveID",authenticate,getLeaveByIdForRequest)
router.get("/prevLeave/:citizenID/:type/:leaveID/:fiscal_year",authenticate,prevLeave)
router.get("/getAllLeaveOfUser/:fiscal_year",authenticate,getAllLeaveOfUser)
router.get("/prevLeaveOfUserID/:type/:fiscal_year",authenticate,prevLeaveOfUserID)
router.get("/getAllLeaveOfUserByCitizenID/:citizenID/:fiscal_year/",authenticate,getAllLeaveOfUserByCitizenID)
router.get("/getAllLeaveByCitizenID/:citizenID/:fiscal_year/",authenticate,getAllLeaveByCitizenID)
router.get("/getLeaveForExport/:leaveID",authenticate,getLeaveForExport)
router.get("/dowloadFiles/:files",authenticate,dowloadFiles)
router.delete("/deleteRequest/:leaveID",authenticate,deleteRequest)


module.exports = router