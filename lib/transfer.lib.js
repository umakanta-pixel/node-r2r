require('dotenv').config();
const { default: axios } = require("axios");
// const { logErrorToFile } = require('../helpers/helper');
// const logger = require('../helpers/logger');

class transferLibrary {

    constructor() {
        this.apiKey = process.env.LIMOUSINE_API_KEY
        this.apiEndPoint = process.env.LIMOUSINE_API_END_POINT;
    }

    //checking if location is servicable or not
    async hasLocation(params) {
        try {
            const dt=params.departure_datetime.split('T')[1]
            const start_time_time=dt.split(':')[0]+':'+dt.split(':')[1]
            const url = this.apiEndPoint + '/en/mapi/v3/vehicles/booking_query/';
            const headers = {
                'Content-Type': 'application/json',
                "partner": this.apiKey
            };
            const request = {
                "start_place_id": params.start_place_id,
                "end_place_id": params.end_place_id,
                "start_time_date": params.departure_datetime.split('T')[0],
                "start_time_time": start_time_time,
            };
            // console.log('request',request);
            const result = await axios.post(url, request, { headers })
            return (result.data.limousines.length > 0) ? true : false;
        } catch (error) {
            // logger.error(error.response.data, url: url)
            // logErrorToFile(error)
            // console.log('transfer api call: ',error.message);
            return false;
        }

    }
}

module.exports = new transferLibrary();