const { directionApiCall, logErrorToFile } = require('../helpers/helper');
// const Algolia = require("algoliasearch")

const transferLib = require('../lib/transfer.lib');
const flightController = require('./flight.controller');
const tripRequestvalidator = require('../validations/tripRequest.validate');
const { searchFerry } = require('../helpers/algolia.helper');

class tripController {
    constructor() { }

    static async drivingRoutes(params) {
        let finalRoutes = [];
        // params.mode='driving';
        const result = await directionApiCall(params);
        if (result.routes.length > 0) {
            result.routes.map((route) => {
                let term = route['legs'][0];
                finalRoutes = { type: 'car', distance: term['distance'], duration: term['duration'], start_address: term['start_address'], end_address: term['end_address'], overview_polyline: route['overview_polyline']['points'], start_place_id: result['geocoded_waypoints'][0]['place_id'], end_place_id: result['geocoded_waypoints'][1]['place_id'] };
            })
        }
        return finalRoutes;
    }

    static async flightRoutes(data) {
        var final = [];
        let flightRoutes = await flightController.getnearestairportDetails(data);
        // console.log(flightRoutes);
        final = await Promise.all(flightRoutes.map(async (routes) => {
            console.log(routes['itineraries']['segments']);
            let tmp = { 'total_duration': 0, 'first_stop': routes['departure_airport'], 'last_stop': routes['arrival_airport'], 'overview_polyline': '' };
            let departure = routes['itineraries']['segments'][0]['departure_date'];
            // let departure = routes['itineraries']['segments'][0]['departure_date'].replace(" ", "T");
            let arrival = routes['itineraries']['segments'][(routes['itineraries']['segments'].length) - 1]['arrival_date'];
            // let arrival = routes['itineraries']['segments'][(routes['itineraries']['segments'].length) - 1]['arrival_date'].replace(" ", "T");
            let driveOne = await tripController.drivingRoutes({ 'start_point': data['start_point'], 'end_point': routes['departure_airport'], 'departure': departure });
            let driveTwo = await tripController.drivingRoutes({ 'start_point': routes['arrival_airport'], 'end_point': data['end_point'], 'arrival': arrival });
            tmp['total_duration'] += driveOne['duration']['value'] + driveTwo['duration']['value'] + routes['onway_duration_hours'];
            tmp.modes = [driveOne, routes, driveTwo];
            return tmp;
        }));
        return final;
    }

    // async ferryRoutes(req, res) {
    //     var result = await ferryLib.routesByCoordinates(req.body);
    //     res.send(result);
    // }
    static async ferryRoutes(params) {
        const dt = params.departure_datetime.split('T')[1]
        const start_time = dt.split(':')[0] + ':' + dt.split(':')[1]
        const routes=searchFerry(params, start_time);
        const final = await Promise.all(routes.map(async (route) => {
            route.type = 'ferry';
            let tmp = {
                total_duration: route['duration_in_seconds'],
                first_stop: route['departure_port'] + ' port',
                last_stop: route['arrival_port'] + ' port',
                overview_polyline: '',
                modes: [route]
            };
            let driveOne = await tripController.drivingRoutes({
                'start_point': params.start_point_latitude + ',' + params.start_point_longitude,
                'end_point': route.departure_port_latitude + ',' + route.departure_port_longitude,
                'arrival': params.departure_datetime.split('T')[0] + 'T' + route.departure_time + ':00'
            });
            if (driveOne.length) {
                tmp.modes.unshift(driveOne);
                tmp.total_duration += driveOne['duration']['value']
            }
            let driveTwo = await tripController.drivingRoutes({
                'start_point': route.arrival_port_latitude + ',' + route.arrival_port_longitude,
                'end_point': params.end_point_latitude + ',' + params.end_point_longitude,
                'departure': params.departure_datetime.split('T')[0] + 'T' + route.arrival_time + ':00'
            });
            if (driveTwo.length) {
                tmp.modes.push(driveTwo);
                tmp.total_duration += driveTwo['duration']['value']
            }
            return tmp;
        }));
        return final;
    }
    // static async ferryRoutes(params) {
    //     const dt = params.departure_datetime.split('T')[1]
    //     const start_time = dt.split(':')[0] + ':' + dt.split(':')[1]
    //     const algoliaClient = new Algolia('C2CIGV0HZ4', '92c465f379330bfc3c60c340bb1aceac');
    //     const ferriesIndex = algoliaClient.initIndex("ferries_master");

    //     const data = await ferriesIndex.search(params.start_city_code, {
    //         facetFilters: ['arrival_city_code:' + params.end_city_code]
    //     })
    //     const routes = data.hits.filter(obj => obj.departure_time >= start_time);

    //     // return data.hits
    //     // return routes;
    //     const final = await Promise.all(routes.map(async (route) => {
    //         route.type = 'ferry';
    //         let tmp = {
    //             total_duration: route['duration_in_seconds'],
    //             first_stop: route['departure_port'] + ' port',
    //             last_stop: route['arrival_port'] + ' port',
    //             overview_polyline: '',
    //             modes: [route]
    //         };
    //         let driveOne = await tripController.drivingRoutes({
    //             'start_point': params.start_point_latitude + ',' + params.start_point_longitude,
    //             'end_point': route.departure_port_latitude + ',' + route.departure_port_longitude,
    //             'arrival': params.departure_datetime.split('T')[0] + 'T' + route.departure_time + ':00'
    //         });
    //         if (driveOne.length) {
    //             tmp.modes.unshift(driveOne);
    //             tmp.total_duration += driveOne['duration']['value']
    //         }
    //         let driveTwo = await tripController.drivingRoutes({
    //             'start_point': route.arrival_port_latitude + ',' + route.arrival_port_longitude,
    //             'end_point': params.end_point_latitude + ',' + params.end_point_longitude,
    //             'departure': params.departure_datetime.split('T')[0] + 'T' + route.arrival_time + ':00'
    //         });
    //         if (driveTwo.length) {
    //             tmp.modes.push(driveTwo);
    //             tmp.total_duration += driveTwo['duration']['value']
    //         }
    //         return tmp;
    //     }));
    //     return final;
    // }


    async combineRouteList(req, res) {

        try {
            const validationError = tripRequestvalidator(req.body);
            if (validationError) {
                return res.json(validationError);
            }

            var responseData = { searchDetails: req.body };
            responseData['routes'] = [];

            const [isTransferAvailable, drivingRoute, flightRoutes, ferryRoutes] = await Promise.all([
                req.body.serviceTypes.includes('car') && transferLib.hasLocation(req.body),
                req.body.serviceTypes.includes('car') && tripController.drivingRoutes(req.body),
                req.body.serviceTypes.includes('flight') && tripController.flightRoutes(req.body),
                req.body.serviceTypes.includes('ferry') && tripController.ferryRoutes(req.body)
            ]);
            // const [isTransferAvailable, drivingRoute, flightRoutes] = await Promise.all([transferLib.hasLocation(req.body), tripController.drivingRoutes(req.body), tripController.flightRoutes(req.body)]);
            // console.log(isTransferAvailable);
            if (isTransferAvailable) {
                responseData['routes'].push({
                    total_duration: drivingRoute['duration']['value'],
                    first_stop: drivingRoute['start_address'],
                    last_stop: drivingRoute['end_address'],
                    modes: drivingRoute,
                    overview_polyline: drivingRoute['overview_polyline']
                });
            }

            if (ferryRoutes.length > 0) {
                ferryRoutes.map((route) => {
                    responseData['routes'].push(route);
                })
            }

            // flightRoutes.map((flightRoute) => {
            //     responseData['routes'].push(flightRoute);
            // })

            res.send({
                res_code: 200,
                response: "Success",
                data: responseData
            })

        } catch (error) {
            // logErrorToFile(error)
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