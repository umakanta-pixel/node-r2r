const { default: axios } = require("axios");
var Amadeus = require('amadeus');
var amadeus = new Amadeus({
    clientId: 'JLugRVGroghG9AdfvU5G4PNQwzZu2Rc6',
    clientSecret: 'AXX3Ab3HFnHfjWyP'
});
// var AmadeusHelper = function () { };
// exports.directionApiCall = async (params) => {
//     var direction_url = 'https://maps.googleapis.com/maps/api/directions/json?'
//         + 'origin=' + encodeURIComponent(params.start_point)
//         + '&destination=' + encodeURIComponent(params.end_point)
//         + '&mode=' + encodeURIComponent(params.mode)
//         + '&key=' + process.env.GOOGLE_MAPS_API_KEY;
//     direction_url += (params.mode == 'transit') ? '&transit_mode=train&alternatives=true' : '&transit_mode=driving';
//     direction_url += (params.departure) ? '&departure_time=' + (Date.parse(params.departure + '.000Z') / 1000) : '&arrival_time=' + (Date.parse(params.arrival + '.000Z') / 1000);
//     const result = await axios.get(direction_url);
//     return result.data;
// }
exports.getnearestairport = (lat, lon) => {
    return new Promise((resolve, reject) => {
        amadeus.referenceData.locations.airports.get({
            latitude: lat,
            longitude: lon,
            sort: 'analytics.flights.score',
            radius: '100'
        }).then(function (response) {
            resolve(response.data);
        }).catch(function (responseError) {
            console.log(responseError.code);
        });
    });
}
exports.findFlight = function (originLocationCode, destinationLocationCode, departureDate) {
    //console.log(originLocationCode,destinationLocationCode);
    return new Promise((resolve, reject) => {
        amadeus.shopping.flightOffersSearch.get({
            originLocationCode: originLocationCode,
            destinationLocationCode: destinationLocationCode,
            departureDate: departureDate,
            adults: '1',
            max: 1
        }).then(function (response) {
            resolve(response.data);
        }).catch(function (responseError) {
            resolve([])
        });
    });
};
// exports.parseDuration = (durationString)=>{
//     const match = durationString.match(/pt(\d+)h(\d+)m/);

//     if (!match) {
//         throw new Error('Invalid duration format');
//     }

//     const hours = parseInt(match[1], 10);
//     const minutes = parseInt(match[2], 10);

//     return { hours, minutes };
// }

exports.parseDuration = (duration) => {
    // Check if the duration starts with 'pt' (ISO 8601 duration format)
    var hours = 0;
    var minutes = 0;
    var seconds = 0;
    if (duration.startsWith('pt')) {
        // Remove 'pt' from the duration string
        duration = duration.slice(2);

        // Initialize variables for hours, minutes, and seconds


        // Extract hours, minutes, and seconds from the duration string
        if (duration.includes('h')) {
            const hoursIndex = duration.indexOf('h');
            hours = parseInt(duration.slice(0, hoursIndex));
            duration = duration.slice(hoursIndex + 1);
        }

        if (duration.includes('m')) {
            const minutesIndex = duration.indexOf('m');
            minutes = parseInt(duration.slice(0, minutesIndex));
            duration = duration.slice(minutesIndex + 1);
        }

        if (duration.includes('s')) {
            seconds = parseInt(duration.slice(0, duration.indexOf('s')));
        }

        // Return an object with hours, minutes, and seconds
        return { hours, minutes, seconds };
    } else {
        return { hours, minutes, seconds };
        // If the duration format is not recognized, return an error message or handle accordingly
        //   return { error: 'Invalid duration format' };
        console.log("duration parse error");
    }

}

exports.calculateTime = function (durationString) {
    const { hours, minutes, seconds } = this.parseDuration(durationString);

    const totalMinutes = hours * 60 + minutes + seconds;
    return totalMinutes;
}

