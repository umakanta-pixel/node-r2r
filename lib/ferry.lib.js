require('dotenv').config();
const { default: axios } = require("axios");

class ferryLibrary {

    constructor() {
        this.clientId = process.env.FERRIES_CLIENT_ID
        this.clientSecret = process.env.FERRIES_CLIENT_SECRET;
        this.grantType = process.env.FERRIES_GRANT_TYPE;
        this.tokenUrl = process.env.FERRIES_ACCESS_TOKEN_URL;
    }


}

module.exports = new ferryLibrary();