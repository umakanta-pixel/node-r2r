const { directionApiCall } = require('../helpers/helper');
const transferLib = require('../lib/transfer.lib');
const { validationResult } = require("express-validator");

class tripController {
    constructor() { }

    static async drivingRoutes(params) {
        let finalRoutes = [];
        const result = await directionApiCall(params);
        if (result.routes.length > 0) {
            result.routes.map((route) => {
                let term = route['legs'][0];
                finalRoutes = { type: 'car', distance: term['distance'], duration: term['duration'], start_address: term['start_address'], end_address: term['end_address'], overview_polyline: route['overview_polyline']['points'], start_place_id: result['geocoded_waypoints'][0]['place_id'], end_place_id: result['geocoded_waypoints'][1]['place_id'] };
            })
        }
        // console.log(finalRoutes);
        return finalRoutes;
    }


    async combineRouteList(req, res) {

        try {
            console.log(req.body);
            return 1;
            const errors = validationResult(req);
            // if there is error then return Error
            if (!errors.isEmpty()) {
                return res.json({
                    res_code: 201,
                    response: errors.array(),
                });
            }

            var responseData = { searchDetails: req.body };
            responseData['routes'] = [];
            const [isTransferAvailable, drivingRoute] = await Promise.all([transferLib.hasLocation(req.body), tripController.drivingRoutes(req.body)]);
            // console.log(drivingRoute);
            if (isTransferAvailable) {
                responseData['routes'].push({ total_duration: drivingRoute['duration']['value'], first_stop: drivingRoute['start_address'], last_stop: drivingRoute['end_address'], modes: drivingRoute, overview_polyline: drivingRoute['overview_polyline'] });
            }

            res.send({
                res_code: 200,
                response: "Success",
                data: responseData
            })

        } catch (error) {
            const stackLines = error.stack.split('\n');
            res.send({
                res_code: 201,
                response: "Something unexpected happened. Try again later.",
                server_message: error.message,
                line: stackLines[1].trim() ?? ''
            })

        }
    }
}

module.exports = new tripController();