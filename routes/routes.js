const express = require('express');
const router = express.Router();
const decryption = require("../middlewares/decryption")
const encryption = require("../middlewares/encryption")

const tripController = require('../controllers/trip.controller');
const routeDataValidateSchema = require('../validations/route.validation')


router.post('/trip-planner/routes',encryption,decryption, routeDataValidateSchema, tripController.combineRouteList);

module.exports = router;