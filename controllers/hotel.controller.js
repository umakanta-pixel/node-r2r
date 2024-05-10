const Hotel = require('../helpers/hotelHelper');
class hotelController {
    constructor() { }

    async getHotelDetails(req,res) {
        let result = [];
        let data;
        try {
            data = await Hotel.getHotelDetails(req.body);
        } catch (error) {
            res.send({
                res_code: 201,
                response: "Something unexpected happened. Try again later.",
                server_message: error,
                line: stackLines[1].trim() ?? ''
            })
        }
        res.send(data);
    }
}

module.exports = new hotelController();