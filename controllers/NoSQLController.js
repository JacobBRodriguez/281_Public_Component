const nosql_con = require("./NoSQL_connection");
const { v4 : uuidv4 } = require('uuid');

// @route PUT /service_record
// Create a new service record entry
const insertSR = async (req, res) => {

    const items = {...req.body};
    items.id = uuidv4();

    let params = {
        TableName: 'Service_Records',
        Item: items
    };

    nosql_con.put(params, function(err, result) {
            if (err) {
                console.log(err);
                res.send({
                    "result": "Bad Request",
                    "status": 400,
                    "message": "Could not insert item"
                });

            }
            else {
                res.send({
                    "result": "success",
                    "status": 200,
                    "item": result
                });
            }
        });
} // End Create new service record

// @route PUT /ride_statistic
// Create a new ride statistic entry
const insertRS = async (req, res) => {

    const items = {...req.body};
    items.id = uuidv4();

    let params = {
        TableName: 'Ride_Statistics',
        Item: items
    };

    nosql_con.put(params, function(err, result) {
        if (err) {
            console.log(err);
            res.send({
                "result": "Bad Request",
                "status": 400,
                "message": "Could not insert item"
            });

        }
        else {
            res.send({
                "result": "success",
                "status": 200,
                "item": result
            });
        }
    });
} // End Create new ride statistic

// @route PUT /sensor_info
// Create a new sensor information entry
const insertSI = async (req, res) => {

    const items = {...req.body};
    items.id = uuidv4();

    let params = {
        TableName: 'Sensor_Information',
        Item: items
    };

    nosql_con.put(params, function(err, result) {
        if (err) {
            console.log(err);
            res.send({
                "result": "Bad Request",
                "status": 400,
                "message": "Could not insert item"
            });

        }
        else {
            res.send({
                "result": "success",
                "status": 200,
                "item": result
            });
        }
    });
} // End Create new sensor info item

// @route PUT /emergency_log
// Create a new emergency data log entry
const insertEDL = async (req, res) => {

    const items = {...req.body};
    items.id = uuidv4();

    let params = {
        TableName: 'Emergency_Data_Logs',
        Item: items
    };

    nosql_con.put(params, function(err, result) {
        if (err) {
            console.log(err);
            res.send({
                "result": "Bad Request",
                "status": 400,
                "message": "Could not insert item"
            });

        }
        else {
            res.send({
                "result": "success",
                "status": 200,
                "item": result
            });
        }
    });
} // End Create new emergency data log item

// @route GET /emergency_log
// GET all emergency logs
const getELD = async (req, res) => {

    let params = {
        TableName: 'Emergency_Data_Logs'
    };

    nosql_con.scan(params, function(err, result) {
        if (err) {
            console.log(err);
            res.send({
                "result": "Bad Request",
                "status": 400,
                "message": "Could not get items"
            });

        }
        else {
            res.send({
                "result": "success",
                "status": 200,
                "item": result
            });
        }
    });
} // End Get all emergency log data

// @route GET /sensor_info
// GET all sensor information entries
const getSI = async (req, res) => {

    let params = {
        TableName: 'Sensor_Information'
    };

    nosql_con.scan(params, function(err, result) {
        if (err) {
            console.log(err);
            res.send({
                "result": "Bad Request",
                "status": 400,
                "message": "Could not get items"
            });

        }
        else {
            res.send({
                "result": "success",
                "status": 200,
                "item": result
            });
        }
    });
} // End GET sensor info

// @route GET /ride_statistic
// GET all ride statistic entries
const getRS = async (req, res) => {

    let params = {
        TableName: 'Ride_Statistics'
    };

    nosql_con.scan(params, function(err, result) {
        if (err) {
            console.log(err);
            res.send({
                "result": "Bad Request",
                "status": 400,
                "message": "Could not get items"
            });

        }
        else {
            res.send({
                "result": "success",
                "status": 200,
                "item": result
            });
        }
    });
} // End GET ride statistic data

// @route GET /service_record
// GET all service records
const getSR = async (req, res) => {

    let params = {
        TableName: 'Service_Records'
    };

    nosql_con.scan(params, function(err, result) {
        if (err) {
            console.log(err);
            res.send({
                "result": "Bad Request",
                "status": 400,
                "message": "Could not get items"
            });

        }
        else {
            res.send({
                "result": "success",
                "status": 200,
                "item": result
            });
        }
    });
} // End GET all service records



module.exports = {
    insertSR,
    insertRS,
    insertSI,
    insertEDL,
    getELD,
    getSI,
    getRS,
    getSR
}