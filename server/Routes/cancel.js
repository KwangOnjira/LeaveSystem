const express = require("express");
const { authenticate } = require("../Middleware/auth");
const { getLeavebyUserID, createCancelLeave, updateAllowLeave, cancelSameDivisionForRequest, getCancelLeave, updateCancelLeave, getMatchStatusCancel, getUserMatchCancel, updateCommentCancel, updateCompleteStatusCancel, createStatisticByidCancel, getLastLeavebyUserID, getStatisticLastLeavebyUserID, getCancelLeaveForExport, getSignatureInspectorForCancel, deleteCancelRequest } = require("../Controllers/cancel");
const router = express.Router();

router.get('/getLeavebyUserID/:leaveID',authenticate, getLeavebyUserID)
router.post('/createCancelLeave',authenticate, createCancelLeave)
router.get('/cancelSameDivisionForRequest',authenticate, cancelSameDivisionForRequest);
router.get('/getMatchStatusCancel',authenticate, getMatchStatusCancel);
router.get('/getUserMatchCancel',authenticate, getUserMatchCancel);
router.get('/getCancelLeave/:citizenID/:cancelID',authenticate, getCancelLeave);
router.get('/getLastLeavebyUserID/:citizenID/:leaveID', getLastLeavebyUserID);
router.get('/getStatisticLastLeavebyUserID/:citizenID/:leaveID', getStatisticLastLeavebyUserID);
router.get('/getCancelLeaveForExport/:cancelID',authenticate, getCancelLeaveForExport);
router.get('/getSignatureInspectorForCancel/:cancelID',authenticate, getSignatureInspectorForCancel);
router.put('/updateAllowLeave/:leaveID',authenticate, updateAllowLeave);
router.put('/updateCancelLeave/:cancelID',authenticate, updateCancelLeave);
router.put('/updateCommentCancel/:cancelID',authenticate, updateCommentCancel);
router.put('/updateCompleteStatusCancel/:cancelID',authenticate, updateCompleteStatusCancel);
router.post('/createStatisticByidCancel/:citizenID',authenticate, createStatisticByidCancel);
router.delete("/deleteCancelRequest/:cancelID",authenticate,deleteCancelRequest)

module.exports = router;