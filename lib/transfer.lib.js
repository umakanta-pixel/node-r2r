require('dotenv').config();
const { default: axios } = require("axios");

class transferLibrary {

    constructor() {
        this.apiKey = process.env.LIMOUSINE_API_KEY
        this.apiEndPoint = process.env.LIMOUSINE_API_END_POINT;
    }

    //checking if location is servicable or not
    async hasLocation(params) {
        const url = this.apiEndPoint + '/en/mapi/v3/vehicles/booking_query/';
        const headers = {
            'Content-Type': 'application/json',
            "partner": this.apiKey
        };
        const request = {
            "start_place_id": params.start_place_id,
            "end_place_id": params.end_place_id,
            "start_time_date": params.startdate,
            "start_time_time": params.starttime,
        };
        const result = await axios.post(url, request, { headers })
        return (result.data.limousines.length > 0) ? true : false;
        // return result;
    }
}

module.exports = new transferLibrary();