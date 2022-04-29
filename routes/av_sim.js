const express = require('express');
const router = express.Router();

const {
    insertSR,
    insertRS,
    insertSI,
    insertEDL,
    getELD,
    getSI,
    getRS,
    getSR,
    getSingleAVSR
} = require('../controllers/NoSQLController')

router.put('/service_record', insertSR)
router.put('/ride_statistic', insertRS)
router.put('/sensor_info', insertSI)
router.put('/emergency_log', insertEDL)

router.get('/emergency_log', getELD)
router.get('/sensor_info', getSI)
router.get('/ride_statistic', getRS)
router.get('/service_record', getSR)
router.get('/service_record/:av_id', getSingleAVSR)

module.exports = router;