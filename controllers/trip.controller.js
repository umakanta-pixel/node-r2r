const { directionApiCall } = require('../helpers/helper');
const transferLib = require('../lib/transfer.lib');
const { validationResult } = require("express-validator");
const flightController = require('./flight.controller')

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

    static async flightRoutes(data) {
        var final = [];
        // $flight = new FlightController();
        // $flightRoutes = $flight->airportRouteMapDetails($data);
        let flightRoutes = await flightController.getnearestairportDetails(data);
        // console.log("flightRoutes",flightRoutes);
        // return $flightRoutes;
        // foreach ($flightRoutes as $routes) {
        //     $tmp = ['total_duration' => 0, 'first_stop' => '', 'last_stop' => '', 'modes' => [], 'overview_polyline' => ''];
        //     $firstAirport = $routes['flightitineraries'][0]['departure_airport'] . ', ' . $routes['flightitineraries'][0]['departure_location'];
        //     $lastAirport = $routes['flightitineraries'][0]['arrival_airport'] . ', ' . $routes['flightitineraries'][0]['arrival_location'];
        //     $arrival = str_replace(" ", "T", $routes['flightitineraries'][0]['departure_at']);
        //     $departure = str_replace(" ", "T", $routes['flightitineraries'][0]['arrival_at']);

        //     $driveOne = $this->shortestDrivingToAirport(['start_point' => $data['start_point'], 'end_point' => $firstAirport, 'arrival' => $arrival]);
        //     $driveTwo = $this->shortestDrivingToAirport(['start_point' => $lastAirport, 'end_point' => $data['end_point'], 'departure' => $departure]);

        //     $tmp['total_duration'] += $driveOne['duration']['value'] + $driveTwo['duration']['value'] + $routes['onway_duration_hours'];
        //     $tmp['first_stop'] = $routes['flightitineraries'][0]['departure_airport'];
        //     // $tmp['last_stop'] = $routes['flightitineraries'][0]['arrival_airport'];
        //     $tmp['last_stop'] = $data['end_point'];
        //     array_push($tmp['modes'], $driveOne, $routes, $driveTwo);
        //     array_push($final, $tmp);
        // }
        final = await Promise.all(flightRoutes.map(async (routes) => {
            let tmp = { 'total_duration': 0, 'first_stop': routes['departure_airport'], 'last_stop': routes['arrival_airport'], 'overview_polyline': '' };
            // let firstAirport = routes['departure_airport'];
            // let lastAirport = routes['arrival_airport'] ;
            let departure = routes['itineraries']['segments'][0]['departure']['at'].replace(" ", "T");
            let arrival = routes['itineraries']['segments'][(routes['itineraries']['segments'].length) - 1]['arrival']['at'].replace(" ", "T");

            let driveOne = await tripController.drivingRoutes({ 'start_point': data['start_point'], 'end_point': routes['departure_airport'], 'departure': departure });
            let driveTwo = await tripController.drivingRoutes({ 'start_point': routes['arrival_airport'], 'end_point': data['end_point'], 'arrival': arrival });

            // console.log(driveOne);

            tmp['total_duration'] += driveOne['duration']['value'] + driveTwo['duration']['value'] + routes['onway_duration_hours'];
            tmp.modes = [driveOne, routes, driveTwo];
            // tmp['modes'].push({driveOne, routes, driveTwo});
            // final.push(tmp);
            return tmp;
        }));
        // console.log(final);
        return final;

        // const resultArray = await Promise.all(result.map(async (item) => {
        //     data = await AmadeusHelper.findFlight(item.start_iata.iata, item.end_iata.iata, departure_date);
        //     return { "data": data, "start_airpot": item.start_iata.name, "end_airport": item.end_iata.name };
        // }));
    }


    async combineRouteList(req, res) {

        try {
            // console.log(req.body);
            // return 1;
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

            const [isTransferAvailable, drivingRoute, flightRoutes] = await Promise.all([transferLib.hasLocation(req.body), tripController.drivingRoutes(req.body), tripController.flightRoutes(req.body)]);
            // console.log(drivingRoute);
            if (isTransferAvailable) {
                responseData['routes'].push({ total_duration: drivingRoute['duration']['value'], first_stop: drivingRoute['start_address'], last_stop: drivingRoute['end_address'], modes: drivingRoute, overview_polyline: drivingRoute['overview_polyline'] });
            }

            // console.log(flightRoutes);

            flightRoutes.map((flightRoute)=>{
                responseData['routes'].push(flightRoute);
            })

            res.send({
                res_code: 200,
                response: "Success",
                // data: flightRoutes
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