require('dotenv').config();
const { default: axios } = require("axios");

class ferryLibrary {

    constructor() {
        this.clientId = process.env.FERRIES_CLIENT_ID
        this.clientSecret = process.env.FERRIES_CLIENT_SECRET;
        this.grantType = process.env.FERRIES_GRANT_TYPE;
        this.tokenUrl = process.env.FERRIES_ACCESS_TOKEN_URL;
        this.apiUrl = process.env.FERRIES_API_END_POINT;
        // this.accessToken = ferryLibrary.generateToken() 
    }

    static async generateToken() {
        const url = 'https://tf-test-affiliate-api-sandbox.auth.eu-west-1.amazoncognito.com/oauth2/token';
        const body = {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: this.grantType
        }
        const headers = {
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded"
        }
        var result = await axios.post(url, body, { headers });
        return result.data.access_token;
    }

    static async searchFerries(countryCode = 'GB') {
        const accessToken = ferryLibrary.generateToken();
        var url = this.apiUrl + `countries/${countryCode}/routes?Culture=en-GB`;
        const headers = array(
            "Content-Type: application/json",
            "Authorization: Bearer " + accessToken,
        );
        // $response = Self::runRequest($url);
        // return $response;
    }

     async routesByCoordinates(params) {
        const accessToken = await ferryLibrary.generateToken();
        const url = `https://sandbox-api.test.directferriesconnect.com/api/v1.0/routes/${params.start_lat}/${params.start_lon}/${params.end_lat}/${params.end_lon}?Culture=en-GB`;
        const headers = {
            "accept": "application/json",
            "Authorization": "Bearer " + accessToken,
        }
        const result = await axios.get(url, { headers });
        return result.data;
    }

}

module.exports = new ferryLibrary();