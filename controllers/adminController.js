const sql_con = require("./sql_connection");
const bcrypt = require('bcrypt');

// @route /signup
// Create New Admin account
const signUp = async (req, res) => {
    const password = req.body.userPassword;
    const encryptedPassword = await bcrypt.hash(password, 10);

    let user_info = [ [req.body.userName, req.body.userEmail, encryptedPassword, 1] ];

    sql_con.query(`INSERT INTO User (userName, userEmail, userPassword, isAdmin) VALUES ?`,[user_info],
        function(err, result, fields) {
        if (err) {
            console.log(err);
            res.send({
                "result": "Conflict",
                "status": 409,
                "message": "Username already exists"
            });

        }
        else {
            res.send({
                "result": "success",
                "status": 200,
                "userName": req.body.userName,
                "userEmail": req.body.userEmail});
        }

    });
} // End Create new admin account

// @route /{adminName}/userlist
// GET list of registered users
const getUsers = async (req, res) => {

    let limit = req.params.limit;
    if(limit == null) {
        limit = 999999999999;
    }

    let user_info = [ limit, req.params.sort_by, req.params.name_like ];
    console.log(req.params.sort_by);
    console.log(limit);

    sql_con.query(`CALL getUsers(?, ?, ?)`,user_info,
        function(err, result, fields) {
            if (err) {
                console.log(err);
                res.send({
                    "result": "Not Found",
                    "status": 404,
                    "message": "Could not execute search"
                });

            }
            else {
                if(result.length === 0) {
                    res.send({
                        "result": "Not Found",
                        "status": 404,
                        "message": "No users found with criteria"
                    })
                }
                else {

                    res.send({
                        "result": "success",
                        "status": 200,
                        "users": result.slice(0, -1)
                    });
                }
            }

        });
} // End Get list of registered users

// @route /{adminName}/payment
// Update User payment Info
const updatePayment = async (req, res) => {


    let user_info = [ req.body.card_holder_name, req.body.new_card_number, req.body.new_card_date, req.body.userName ];

    sql_con.query(`UPDATE User SET cardholderName = ?, cardNumber = ?, cardExpire = STR_TO_DATE(?, '%m/%Y') WHERE`+
                    ` userName LIKE ?`, user_info,
        function(err, result, fields) {
            if (err) {
                console.log(err);
                res.send({
                    "result": "Bad Request",
                    "status": 400,
                    "message": "Could not update payment information"
                });

            }
            else {
                res.send({
                    "result": "success",
                    "status": 200
                });
            }

        });
} // End Update User payment Info

// @route /{adminName}/payment/history
// Retrieve user payment history
const paymentHistory = async (req, res) => {

    sql_con.query(`SELECT bill_date, id, bill_status, cost, ride_id FROM Bill WHERE userName LIKE ?`, [req.body.userName],
        function(err, result, fields) {
            if (err) {
                console.log(err);
                res.send({
                    "result": "Not Found",
                    "status": 404,
                    "message": "Could not find payments"
                });

            }
            // Else return success and payment info
            else {
                if(result.length === 0) {
                    res.send({
                        "result": "success",
                        "status": 200,
                        "message": "No payment history available"
                    })
                }
                else {
                    const invoices = result.map(invoice => ({Date: invoice.bill_date, Invoice_ID: invoice.id,
                        Status: invoice.bill_status, Cost: invoice.cost, Booking_FK: invoice.ride_id}));
                    res.send({
                        "result": "success",
                        "status": 200,
                        "invoices": invoices
                    })
                }

            }

        });
} // End GET user payment history

// @route /{adminName}/av/info
// Update AV information
const updateAV = async (req, res) => {

    const body = req.body;
    sql_con.query(`UPDATE Autonomous_Vehicle SET location = IFNull(?, location), av_status = IFNull(?, av_status), `+
            `mileage = IFNull(?, mileage), make = IFNull(?, make), model = IFNull(?, model), av_year = IFNull(?, av_year), `+
            `license = IFNull(?, license), service_state = IFNull(?, service_state), `+
            `moving_state = IFNull(?, moving_state), userName = IFNull(?, userName) WHERE id = ?`,
        [body.av_location, body.av_status, body.av_mileage, body.av_make, body.av_model, body.av_year, body.av_license,
            body.service_state, body.moving_state, body.userName, body.av_id],
        function(err, result, fields) {
            if (err) {
                console.log(err);
                res.send({
                    "result": "Bad Request",
                    "status": 400,
                    "message": "Could not update AV info"
                });

            }
            // Else return success
            else {
                res.send({
                    "result": "success",
                    "status": 200
                })
            }
        });
} // End Update AV Info

// @route /{adminName}/invoice/create
// Create Bill entry for completed ride
const createBill = async (req, res) => {

    const body = req.body;
    sql_con.query(`INSERT INTO Bill (bill_status, ride_id, cost, userName, bill_date, av_id) `+
                    `VALUES ('outstanding', ?, ?, ?, now(), ?); UPDATE Ride SET ride_status = 'completed' `+
        `WHERE id = ?` , [body.ride_id, body.cost, body.userName, body.AV_ID, body.ride_id],
        function(err, result, fields) {
            if (err) {
                console.log(err);
                res.send({
                    "result": "Bad Request",
                    "status": 400,
                    "message": "Could not create Bill entry"
                });

            }
            // Else return success
            else {
                res.send({
                    "result": "success",
                    "status": 200
                })
            }
        });
} // End Create Bill Entry

// @route GET /av/all
// Retrieve all AVs
const allAVs = async (req, res) => {

    sql_con.query(`SELECT id, userName, moving_state, service_state, location `+
        `FROM Autonomous_Vehicle`, [req.body.userName],
        function(err, result, fields) {
            if (err) {
                console.log(err);
                res.send({
                    "result": "Not Found",
                    "status": 404,
                    "message": "Could not get AVs"
                });

            }
            // Else return success and all AV info
            else {
                if(result.length === 0) {
                    res.send({
                        "result": "success",
                        "status": 200,
                        "message": "No AVs to be found"
                    })
                }
                else {
                    const AVs = result.map(av => ({AV_ID: av.id, Moving_State: av.moving_state,
                        Service_State: av.service_state, Location: av.location, userName: av.userName}));
                    res.send({
                        "result": "success",
                        "status": 200,
                        "AVs": AVs
                    })
                }

            }

        });
} // End GET all AVs

// @route GET /av/{av_id}
// Retrieve single AV by ID
const oneAV = async (req, res) => {

    sql_con.query(`SELECT id, userName, moving_state, service_state, location `+
        `FROM Autonomous_Vehicle WHERE id = ?`, [req.params.av_id],
        function(err, result, fields) {
            if (err) {
                console.log(err);
                res.send({
                    "result": "Not Found",
                    "status": 404,
                    "message": "Could not get AV"
                });

            }
            // Else return success and AV info
            else {
                if(result.length === 0) {
                    res.send({
                        "result": "Not Found",
                        "status": 404,
                        "message": "No AV could be found"
                    })
                }
                else {
                    const AV = result.map(av => ({AV_ID: av.id, Moving_State: av.moving_state,
                        Service_State: av.service_state, Location: av.location, userName: av.userName}));
                    res.send({
                        "result": "success",
                        "status": 200,
                        "AV": AV
                    })
                }

            }

        });
} // End GET all AVs

// @route GET /av/{av_id}/ride/history
// Retrieve all ride history for single AV by ID
const avRideHistory = async (req, res) => {

    sql_con.query(`SELECT id, userName, startLocation, finishLocation, estimatedArrival, ride_date `+
        `FROM Ride WHERE av_id = ?`, [req.params.av_id],
        function(err, result, fields) {
            if (err) {
                console.log(err);
                res.send({
                    "result": "Not Found",
                    "status": 404,
                    "message": "Could not get AV ride history"
                });

            }
            // Else return success and AV ride history
            else {
                if(result.length === 0) {
                    res.send({
                        "result": "Not Found",
                        "status": 404,
                        "message": "No AV ride history available"
                    })
                }
                else {
                    const AV = result.map(av => ({Ride_ID: av.id, Username: av.userName,
                        Start_Location: av.startLocation, End_Location: av.finishLocation,
                        Estimated_Arrival: av.estimatedArrival, Ride_Date: av.ride_date}));
                    res.send({
                        "result": "success",
                        "status": 200,
                        "AV_Ride_History": AV
                    })
                }

            }

        });
} // End GET AV ride history


module.exports = {
    signUp,
    getUsers,
    updatePayment,
    paymentHistory,
    updateAV,
    createBill,
    allAVs,
    oneAV,
    avRideHistory
}