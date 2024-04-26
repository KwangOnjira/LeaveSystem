const express = require('express');
const { getSuperior, getFirstSuperior, getSomeSecondSuperior, getUserFromPosition, updateFirstSuperior, getAllFirstSuperior, getAllSecondSuperiorInDivision, getAllHightSecondSuperior, getMatchStatus, getUserMatch, updateComment, updateCompleteStatus, getAllSuperiorInSameDivision, getUserFromOnlyPosition } = require('../Controllers/superior');
const { authenticate } = require('../Middleware/auth');
const router = express.Router()

router.get("/getUserFromPosition/:position/:divisionName",getUserFromPosition)
router.get("/getUserFromOnlyPosition/:position",getUserFromOnlyPosition)
router.get("/getSuperior",getSuperior)
router.get("/getAllFirstSuperior",getAllFirstSuperior)
router.get("/getAllSecondSuperiorInDivision",getAllSecondSuperiorInDivision)
router.get("/getAllHightSecondSuperior",getAllHightSecondSuperior)
router.get("/getFirstSuperior/:citizenID",getFirstSuperior)
router.get("/getSomeSecondSuperior/:citizenID",getSomeSecondSuperior)
router.get("/getAllSuperiorInSameDivision/:citizenID",getAllSuperiorInSameDivision)
router.put('/updateFirstSuperior',authenticate ,updateFirstSuperior);
router.get("/getMatchStatus",getMatchStatus)
router.get("/getUserMatch",authenticate,getUserMatch)
router.put('/updateComment/:leaveID' ,updateComment);
router.put('/updateCompleteStatus/:leaveID' ,updateCompleteStatus);

module.exports = router