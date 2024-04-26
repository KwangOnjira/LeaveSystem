const express = require('express');
const { sameDivision, statisticUsers, sameBothDivAndSubDiv, getUsers, getUserforEdit, updateLastStatistic, updateStatistic, sameDivisionForRequest, sameBothDivAndSubDivForRequest, updateLeave, getDataLastStatisticByid, createStatisticByid, updateLeaveCount, divisionOfficePAO, divisionOfficePAOForRequest, samedivisionTypeEmployee, divisionOfficePAOTypeEmployee, sameBothDivAndSubDivTypeEmployee } = require('../Controllers/inspector');
const { authenticate } = require('../Middleware/auth');
const router = express.Router();


router.get('/sameDivision/:fiscal_year/:range',authenticate, sameDivision);
router.get('/divisionOfficePAO/:fiscal_year/:range',authenticate, divisionOfficePAO);
router.get('/sameBothDivAndSubDiv/:fiscal_year/:range',authenticate, sameBothDivAndSubDiv);
// router.get('/statisticUsers',authenticate, statisticUsers);
router.get('/getuser/:citizenID',authenticate, getUsers);
router.get('/getuserforEdit/:citizenID/:statisticID',authenticate, getUserforEdit);
router.put('/updateLastStatistic/:citizenID/:statisticID',authenticate, updateLastStatistic);


router.get('/samedivisionTypeEmployee/:fiscal_year/:range/:type_of_employee',authenticate, samedivisionTypeEmployee);
router.get('/divisionOfficePAOTypeEmployee/:fiscal_year/:range/:type_of_employee',authenticate, divisionOfficePAOTypeEmployee);
router.get('/sameBothDivAndSubDivTypeEmployee/:fiscal_year/:range/:type_of_employee',authenticate, sameBothDivAndSubDivTypeEmployee);


router.get('/sameDivisionForRequest',authenticate, sameDivisionForRequest);
router.get('/divisionOfficePAOForRequest',authenticate, divisionOfficePAOForRequest);
router.get('/sameBothDivAndSubDivForRequest',authenticate, sameBothDivAndSubDivForRequest);
router.put('/updateLeave/:leaveID',authenticate, updateLeave);
router.get('/getDataLastStatisticByid/:citizenID',authenticate, getDataLastStatisticByid);
router.post("/createStatisticByid/:citizenID", authenticate,createStatisticByid);
router.put('/updateLeaveCount/:statisticID',authenticate, updateLeaveCount);

module.exports = router;
