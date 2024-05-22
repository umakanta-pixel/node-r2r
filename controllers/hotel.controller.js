const Hotel = require('../helpers/hotelHelper');
class hotelController {
    constructor() { }

    async getHotelDetails(req,res) {
        let result = [];
        let data;
        try {
            data = await Hotel.getHotelDetails(req.body);
            
        } catch (error) {
            const stackLines = error.stack.split('\n');
            res.send({
                res_code: 201,
                response: "Something unexpected happened. Try again later.",
                server_message: error,
                line: stackLines[1].trim() ?? ''
            })
        }
        res.send(data);
    }
    async getRoomDetails(req,res) {
        let result = [];
        let room = await Hotel.roomOffer(result);
        res.send(room);
    }
}



module.exports = new hotelController();