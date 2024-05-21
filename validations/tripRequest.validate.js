const tripRequestvalidator = (body) => {
    try {
        if (!body.hasOwnProperty("serviceTypes")) {
            return { res_code: 400, response: "Error", msg: 'Service type array is required' }
        }
        if(body.serviceTypes.length <1){
            return { res_code: 400, response: "Error", msg: 'At least one service type is required' }
        }
        if(body.serviceTypes.includes('car')){
            if (!body.hasOwnProperty("departure_datetime")) {
                return { res_code: 400, response: "Error", msg: 'Departure datetime is required' }
            }
            if (!body.hasOwnProperty("start_point")) {
                return { res_code: 400, response: "Error", msg: 'Start point is required' }
            }
            if (!body.hasOwnProperty("end_point")) {
                return { res_code: 400, response: "Error", msg: 'End point is required' }
            }
            if (!body.hasOwnProperty("start_place_id")) {
                return { res_code: 400, response: "Error", msg: 'Start place id is required' }
            }
            if (!body.hasOwnProperty("end_place_id")) {
                return { res_code: 400, response: "Error", msg: 'End place id is required' }
            }
        }
        if(body.serviceTypes.includes('ferry')){
            if (!body.hasOwnProperty("departure_datetime")) {
                return { res_code: 400, response: "Error", msg: 'Departure datetime is required' }
            }
            if (!body.hasOwnProperty("start_city_code")) {
                return { res_code: 400, response: "Error", msg: 'Start city code is required' }
            }
            if (!body.hasOwnProperty("end_city_code")) {
                return { res_code: 400, response: "Error", msg: 'End city code is required' }
            }
            if (!body.hasOwnProperty("start_point_latitude")) {
                return { res_code: 400, response: "Error", msg: 'Start point latitude is required' }
            }
            if (!body.hasOwnProperty("start_point_longitude")) {
                return { res_code: 400, response: "Error", msg: 'Start point longitude is required' }
            }
            if (!body.hasOwnProperty("end_point_latitude")) {
                return { res_code: 400, response: "Error", msg: 'End point latitude is required' }
            }
            if (!body.hasOwnProperty("end_point_longitude")) {
                return { res_code: 400, response: "Error", msg: 'End point longitude is required' }
            }
        }

    } catch (error) {
        return { res_code: 500, response: "Error", msg: error.message }
    }
}

module.exports = tripRequestvalidator