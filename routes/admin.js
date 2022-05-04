const express = require('express');
const router = express.Router();

const {
    signUp,
    getUsers,
    updatePayment,
    paymentHistory,
    updateAV,
    createBill,
    allAVs,
    oneAV,
    avRideHistory,
    updateRide,
    activeRides,
    registerAV
} = require('../controllers/adminController')

// Will be reusing many of the user routes due to same functionality
const {
    login,
    userProfile,
    logout,
    updateProfile,
    bookAV,
    getAVStatus,
    cancelBooking,
    bookingHistory
} = require('../controllers/userController')

router.post('/signup', signUp)
router.post('/login', login)
router.post('/logout', logout)
router.post('/:userName/booking', bookAV)
router.post('/:userName/payment', updatePayment)
router.post('/:userName/av/info', updateAV)
router.post('/:userName/invoice/create', createBill)
router.post('/:userName/ride/info', updateRide)
router.post('/av/register', registerAV)

router.put('/:userName/update', updateProfile)

router.get('/:userName', userProfile)
router.get('/:userName/userlist/:limit?/:sort_by?/:name_like?', getUsers)
router.get('/:userName/booking/status', getAVStatus)
router.get('/:userName/booking/history', bookingHistory)
router.get('/:userName/payment/history', paymentHistory)
router.get('/av/all', allAVs)
router.get('/av/:av_id', oneAV)
router.get('/av/:av_id/ride/history', avRideHistory)
router.get('/:userName/ride/active', activeRides)

router.delete('/:userName/booking/cancel', cancelBooking)

module.exports = router;