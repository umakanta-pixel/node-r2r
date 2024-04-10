const { body, oneOf } = require("express-validator");


const routeDataValidateSchema = [

    body("serviceTypes").notEmpty().withMessage("service type array is required").bail().isArray({ min: 1, max: 10 }).withMessage("at least one service type is required").bail(),
    // body("serviceTypes").isArray({ min: 1, max: 10 }).withMessage("at least one service type is required").bail(),
    body("start_point").if(body('serviceTypes.car').notEmpty()).notEmpty().withMessage("Start point is required"),
    // body('serviceTypes').contains("car")

    // body("start_point").exists().withMessage("Start point is required"),
    // body("end_point").exists().withMessage("End point is required"),
    // body("departure").exists().withMessage("Departure date-time is required"),
    // body("start_lat").exists().withMessage("Start latitude is required"),
    // body("start_lon").exists().withMessage("Start longitude is required"),
    // body("end_lat").exists().withMessage("End latitude is required"),
    // body("end_lon").exists().withMessage("End longitude is required"),
    // body("startdate").exists().withMessage("Start date is required"),
    // body("starttime").exists().withMessage("Start time is required"),
    // body("start_place_id").exists().withMessage("Start place id is required"),
    // body("end_place_id").exists().withMessage("End place id is required"),



    // body("email").optional().isEmail().withMessage("Provide valid email"),
    // body("gender")
    //     .optional()
    //     .isString()
    //     .withMessage("Gender should be string")
    //     .isIn(["Male", "Female", "Other"])
    //     .withMessage("Gender value is invalid"),
    // body("dateOfBirth")
    //     .optional()
    //     .isDate()
    //     .withMessage("DOB should be valid date"),
    // body("phoneNumber")
    //     .optional()
    //     .isString()
    //     .withMessage("phone number should be string")
    //     .custom((value) => {
    //         if (value.length !== 10) {
    //             return Promise.reject("Phone number should be 10 digits");
    //         } else {
    //             return true;
    //         }
    //     }),
];

module.exports = routeDataValidateSchema;