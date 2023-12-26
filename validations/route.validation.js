const { body } = require("express-validator");

const routeDataValidateSchema = [
    body("start_point")
        // .exists({ checkFalsy: true })
        .exists()
        // .withMessage("User name is required")
        // .isString()
        .withMessage("Start point is required"),
    body("end_point")
        .exists()
        // .withMessage("Password is required")
        // .isString()
        // .withMessage("Password should be string")
        // .isLength({ min: 5 })
        .withMessage("End point is required"),
    body("departure").exists().withMessage("Departure date-time is required"),
    body("start_lat").exists().withMessage("Start latitude is required"),
    body("start_lon").exists().withMessage("Start longitude is required"),
    body("end_lat").exists().withMessage("End latitude is required"),
    body("end_lon").exists().withMessage("End longitude is required"),
    body("startdate").exists().withMessage("Start date is required"),
    body("starttime").exists().withMessage("Start time is required"),
    body("start_place_id").exists().withMessage("Start place id is required"),
    body("end_place_id").exists().withMessage("End place id is required"),
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