var express = require('express');
var router = express.Router();

const {
    signUp,
    login,
    userProfile,
    logout,
    updateProfile,
    bookAV,
    getAVStatus,
    cancelBooking,
    bookingHistory,
    payInvoice,
    invoiceHistory
} = require('../controllers/userController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', signUp)
router.post('/login', login)
router.post('/logout', logout)
router.post('/:userName/booking', bookAV)
router.post('/:userName/invoice', payInvoice)


router.put('/:userName/update', updateProfile)

router.get('/:userName', userProfile)
router.get('/:userName/booking/status', getAVStatus)
router.get('/:userName/booking/history', bookingHistory)
router.get('/:userName/invoice/history', invoiceHistory)

router.delete('/:userName/booking/cancel', cancelBooking)

module.exports = router;
