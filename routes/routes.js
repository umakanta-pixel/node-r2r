const express = require('express');
const router = express.Router();
const decryption = require("../middlewares/decryption")
const encryption = require("../middlewares/encryption")

const tripController = require('../controllers/trip.controller');
const routeDataValidateSchema = require('../validations/route.validation')


// router.post('/api/v1/trip-planner/routes', tripController.combineRouteList);
// router.post('/api/v1/trip-planner/routes',routeDataValidateSchema, tripController.combineRouteList);
router.post('/api/v1/trip-planner/routes', encryption, decryption, tripController.combineRouteList);
// router.post('/api/v1/trip-planner/ferry', tripController.ferryRoutes);

module.exports = router;