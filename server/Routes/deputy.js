const express = require("express");
const { getUserinSameDivision, getUserForDeputy, updateStatus, updateDateDeputy, } = require("../Controllers/deputy");
const { authenticate } = require("../Middleware/auth");
const router = express.Router();

router.get("/getUserinSameDivision", authenticate, getUserinSameDivision)
router.get("/getUserForDeputy", authenticate, getUserForDeputy)
router.put("/updateStatus/:leaveID", authenticate, updateStatus)
router.put("/updateDateDeputy/:leaveID", authenticate, updateDateDeputy)
// router.get("/getLeaveForDeputy/:citizenID/:leaveID", authenticate, getLeaveForDeputy)

module.exports = router;