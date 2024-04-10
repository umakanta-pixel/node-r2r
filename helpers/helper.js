const { default: axios } = require("axios");
const fs = require('fs');

exports.directionApiCall = async (params) => {
    try {
        var direction_url = 'https://maps.googleapis.com/maps/api/directions/json?'
            + 'origin=' + encodeURIComponent(params.start_point)
            + '&destination=' + encodeURIComponent(params.end_point)
            + '&mode=' + encodeURIComponent(params.mode)
            + '&key=' + process.env.GOOGLE_MAPS_API_KEY;
        direction_url += (params.mode == 'transit') ? '&transit_mode=train&alternatives=true' : '&transit_mode=driving';
        direction_url += (params.departure) ? '&departure_time=' + (Date.parse(params.departure + '.000Z') / 1000) : '&arrival_time=' + (Date.parse(params.arrival + '.000Z') / 1000);
        const result = await axios.get(direction_url);
        // console.log(direction_url);
        return result.data;
    } catch (error) {
        // this.logErrorToFile(error);
        return [];
    }
}

exports.logErrorToFile = (error) => {
    const logMessage = `${new Date().toISOString()}- ${error.response.data} - ${error.stack.split('\n')}\n`;
    // const logMessage = `${new Date().toISOString()} - ${error.stack}\n`;

    fs.appendFile('error.log', logMessage, (err) => {
        if (err) {
            console.error('Error writing to error.log:', err);
        }
    });
}