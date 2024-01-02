const AmadeusHelper = require('../helpers/flighthelper');
class flightController {
    constructor() { }

    async getnearestairportDetails(params) {

        let result = [];
        let data;
        let start_lat, start_lon, end_lat, end_lon, departure_date;
        start_lat = params.start_lat;
        start_lon = params.start_lon;
        end_lat = params.end_lat;
        end_lon = params.end_lon;
        departure_date = params.startdate;
        try {
            let startiata = await flightController.getNearestIata(start_lat, start_lon);
            let endtiata = await flightController.getNearestIata(end_lat, end_lon);
            startiata.map(start_iata => {
                endtiata.map(end_iata => {
                    result.push({ start_iata, end_iata });
                });
            });

            const resultArray = await Promise.all(result.map(async (item) => {
                data = await AmadeusHelper.findFlight(item.start_iata.iata, item.end_iata.iata, departure_date);
                return { "data": data, "start_airpot": item.start_iata.name, "end_airport": item.end_iata.name };
            }));
            // console.log(resultArray);
            // let filteredArray = resultArray[0].data.filter(subArray => subArray.length > 0)
            let flightArray = [];
            resultArray.map((flight) => {
                if (flight.data.length > 0) {
                    let inputstring = flight.data[0].itineraries[0].duration;
                    // console.log("inputstring",inputstring);
                    const duration = AmadeusHelper.calculateTime(inputstring.toLowerCase());
                    flightArray.push({
                        // 'duration': 10,
                        'onway_duration_hours': duration,
                        "flightid": flight.data[0].id,
                        "type": "flight",
                        "itineraries": flight.data[0].itineraries[0],
                        "departure_airport": flight.start_airpot,
                        "arrival_airport": flight.end_airport
                    })
                }

            })
            //console.log(flightArray);
            // res.send(flightArray);
            return flightArray;
        } catch (error) {
            const stackLines = error.stack.split('\n');
            // res.send({
            //     res_code: 201,
            //     response: "Flight api error.",
            //     server_message: error.message,
            //     line: stackLines[1].trim() ?? ''
            // })
            console.log("flight error =",error.message);
            console.log(" error line =",stackLines[1].trim() ?? '');
        }


    }

    static async getNearestIata(lat, lon) {

        var details = await AmadeusHelper.getnearestairport(lat, lon);
        try {
            var iataCode = [];
            if (details.length > 0) {

                details.map((iata) => {
                    if (iata.relevance > 2.0) {
                        iataCode.push({ "iata": iata.iataCode, "name": iata.name+' '+iata.subType+' '+iata.address.cityName +' '+iata.address.countryName });
                    }
                });

            } else {
                iataCode = [];
            }
            // console.log("details",details);
            return iataCode;

        } catch (error) {
            console.log(error);
        }

    };
}

module.exports = new flightController();