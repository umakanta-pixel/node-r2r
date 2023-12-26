const express = require('express');
const router = express.Router();
const decryption = require("../middlewares/decryption")
const encryption = require("../middlewares/encryption")

const tripController = require('../controllers/trip.controller');
const routeDataValidateSchema = require('../validations/route.validation')


// router.use('/trip-planner', encryption, decryption, require("./trip.routes"));
// router.use('/trip-planner', require("./trip.routes"));
router.post('/trip-planner/routes',encryption,decryption, routeDataValidateSchema, tripController.combineRouteList);
// router.post('/trip-planner/routes', encryption, decryption, tripController.combineRouteList);

// router.use('/api/v1/users', decryption, require("./user.routes"));
// router.use('/api/v1/holidays', encryption, decryption, require("./holiday.routes"));

module.exports = router;