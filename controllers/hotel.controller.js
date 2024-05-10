const Hotel = require('../helpers/hotelHelper');
class hotelController {
    constructor() { }

    async getHotelDetails(req,res) {
        let result = [];
        let data;
        try {
            data = await Hotel.getHotelDetails(req.body);
        } catch (error) {
            console.log(error);
        }
        res.send(data);
    }
}

module.exports = new hotelController();