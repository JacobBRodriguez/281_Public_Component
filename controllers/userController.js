const sql_con = require("./sql_connection");
const bcrypt = require('bcrypt');


// @route /signup
// Sign Up New User
const signUp = async (req, res) => {
    const password = req.body.userPassword;
    const encryptedPassword = await bcrypt.hash(password, 10);

    let user_info = [ [req.body.userName, req.body.userEmail, encryptedPassword, 0] ];

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
} // End Sign Up User

// @route /login
// Login Existing User
const login = async (req, res) => {

    const password = req.body.userPassword;

    // Check if userName in system
    sql_con.query(`SELECT userName, userPassword, userEmail FROM User WHERE userName LIKE ?`,[req.body.userName], function(err, result, fields) {
        if (err) {
            console.log(err);
            res.send({
                "result": "unauthorized",
                "status": 401,
                "message": "Invalid credentials"
            });

        }
        else {

            // If no results found
            if(result.length == 0) {
                res.send({
                    "result": "Not Found",
                    "status": 400,
                    "message": "No user found with userName"
                })
            }
            else {
                // Found entry and need to compare passwords
                bcrypt.compare(password, result[0].userPassword, function (err, result_pass) {
                    if(result_pass == true) {
                        res.cookie('cookie', 'user', {maxAge: 9000000, httpOnly: false, path: '/'});
                        res.cookie('userName', result[0].userName);
                        res.send( {
                            "result": "Success",
                            "status": 200,
                            "userName": result[0].userName,
                            "userEmail": result[0].userEmail
                        })
                    }
                    else {
                        res.send({
                            "result": "unauthorized",
                            "status": 401,
                            "message": "Invalid credentials"
                        })
                    }
                })
            }
        }

    });
} // End Login User

// @route /{username}
// GET user profile info
const userProfile = async (req, res) => {

    let user_info = [ req.params.userName];

    sql_con.query(`SELECT userName, userEmail, gender, address, about FROM User WHERE userName LIKE ?`,[user_info],
        function(err, result, fields) {
        if (err) {
            console.log(err);
            res.send({
                "result": "Not Found",
                "status": 400,
                "message": "Could not find profile information"
            });

        }
        else {
            res.send({
                "result": "success",
                "status": 200,
                "profile": {
                    "userName": result[0].userName,
                    "userEmail": result[0].userEmail,
                    "gender": result[0].gender,
                    "location": result[0].address,
                    "about": result[0].about
                }
            })
        }

    });
} // End Get user profile

// @route /logout
// Logout user
const logout = async (req, res) => {

    res.clearCookie("cookie");
    res.clearCookie("userName");

    res.send({
        "result": "success",
        "status": 200,
        "message": "successfully logged out"
    });
} // End Logout user

// @route /{username}/update
// Update User profile
const updateProfile = async (req, res) => {

    let body = req.body;

    sql_con.query(`UPDATE User SET gender = IFNull(?, gender), address = IFNull(?, address), about = IFNull(?, about) WHERE userName LIKE ?`,
        [body.gender, body.address, body.about, req.params.userName],
        function(err, result, fields) {
            if (err) {
                console.log(err);
                res.send({
                    "result": "Not Acceptable",
                    "status": 406,
                    "message": "Update request not in acceptable format"
                });

            }
            else {
                res.send({
                    "result": "success",
                    "status": 202,
                    "message": "Profile Updated"
                })
            }

        });
} // End Update Profile

// @route /{username}/booking
// Book a specific AV
const bookAV = async (req, res) => {

    let body = req.body;

    sql_con.query(`CALL bookRide(?,?, @av_out); SELECT @av_out`, [body.av_id, req.params.userName],
        function(err, result, fields) {
            if (err) {
                console.log(err);
                res.send({
                    "result": "Not Found",
                    "status": 404,
                    "message": "Cannot find requested AV"
                });

            }
            // Else check if AV was booked or not
            else {
                console.log(result[0]);

                if(result[0].av_out == 'Booked'){
                    res.send({
                        "result": "success",
                        "status": 200
                    })
                }
                else {
                    res.send({
                        "result": "Conflict",
                        "status": 409,
                        "message": "Cannot book the requested AV"
                    })
                }
            }

        });
} // End Book AV

// @route /{username}/booking/status
// Get the status of the booked AV
const getAVStatus = async (req, res) => {

    sql_con.query(`SELECT location FROM Autonomous_Vehicle WHERE id = (SELECT av_id FROM Ride WHERE userName LIKE ? `+
                    `AND ride_status LIKE 'in_progress')`, [req.params.userName],
        function(err, result, fields) {
            if (err) {
                console.log(err);
                res.send({
                    "result": "Not Found",
                    "status": 404,
                    "message": "Could not find requested information"
                });

            }
            // Else return AV location
            else {
                if(result.length != 0) {
                    res.send({
                        "result": "success",
                        "status": 200,
                        "AV_Status": {
                            "location": result[0].location
                        }
                    })
                }
                else {
                    res.send({
                        "result": "Not Found",
                        "status": 404,
                        "message": "Could not find requested information"
                    });
                }
            }

        });
} // End GET AV status

// @route /{username}/booking/cancel
// Cancel booking for user
const cancelBooking = async (req, res) => {

    sql_con.query(`CALL cancelRide(?)`, [req.params.userName],
        function(err, result, fields) {
            if (err) {
                console.log(err);
                res.send({
                    "result": "Forbidden",
                    "status": 403,
                    "message": "Ride could not be canceled"
                });

            }
            // Else return success for canceling ride
            else {
                res.send({
                    "result": "success",
                    "status": 200
                })
            }

        });
} // End Cancel Booking

// @route /{username}/booking/history
// Retrieve booking history
const bookingHistory = async (req, res) => {

    sql_con.query(`SELECT Ride.av_id, ride_date, ride_status, startLocation, finishLocation, cost FROM `+
                    ` Ride INNER JOIN Bill ON Ride.bill_id = Bill.id WHERE Ride.userName LIKE ?`, [req.params.userName],
        function(err, result, fields) {
            if (err) {
                console.log(err);
                res.send({
                    "result": "Not Found",
                    "status": 404,
                    "message": "Could not find booking history"
                });

            }
            // Else return success and booking info
            else {
                if(result.length === 0) {
                    res.send({
                        "result": "success",
                        "status": 200,
                        "message": "No booking history available"
                    })
                }
                else {
                    const bookings = result.map(booking => ({AV_ID: booking.av_id, Date: booking.ride_date,
                        Status: booking.ride_status, Start: booking.startLocation, Finish: booking.finishLocation,
                    Cost: booking.cost}));
                    res.send({
                        "result": "success",
                        "status": 200,
                        "bookings": bookings
                    })
                }

            }

        });
} // End GET booking history

// @route /{username}/invoice
// Pay for selected invoice
const payInvoice = async (req, res) => {

    sql_con.query(`UPDATE Bill SET bill_status = 'paid' WHERE id = ?`, [req.body.invoice_ID],
        function(err, result, fields) {
            if (err) {
                console.log(err);
                res.send({
                    "result": "Not Acceptable",
                    "status": 406,
                    "message": "Could not process payment"
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
} // End Pay Invoice

// @route /{username}/invoice/history
// Retrieve invoice history
const invoiceHistory = async (req, res) => {

    sql_con.query(`SELECT bill_date, id, bill_status, cost, ride_id FROM Bill WHERE userName LIKE ?`, [req.params.userName],
        function(err, result, fields) {
            if (err) {
                console.log(err);
                res.send({
                    "result": "Not Found",
                    "status": 404,
                    "message": "Could not find invoice history"
                });

            }
            // Else return success and booking info
            else {
                if(result.length === 0) {
                    res.send({
                        "result": "success",
                        "status": 200,
                        "message": "No invoice history available"
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
} // End GET invoice history


module.exports = {
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
}