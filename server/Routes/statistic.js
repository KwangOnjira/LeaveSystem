const express = require('express');
const { statistic,createStatistic, getDataLastStatistic, getStatisticById, getPrevStatisticById, getStatisticsOfUser, getDataLastStatisticByCitizen } = require('../Controllers/statistic');
const { authenticate } = require('../Middleware/auth');
const router = express.Router()

router.post("/createStat", authenticate, createStatistic);
router.get("/statistics", authenticate, statistic);
// router.get("/lastStatistic", authenticate,lastStatistic);
router.get("/getDataLastStatistic", authenticate,getDataLastStatistic);
router.get("/getDataLastStatisticByCitizen/:citizenID", authenticate,getDataLastStatisticByCitizen);
router.get("/getStatisticById/:statisticID", authenticate,getStatisticById);
// router.get("/statisticDetailByStatistic/:statisticID", authenticate,statisticDetailByStatistic);
router.get("/getStatisticsOfUser/:citizenID/:fiscal_year", authenticate,getStatisticsOfUser);

module.exports = router