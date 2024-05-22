const { default: axios } = require("axios");
var Amadeus = require('amadeus');
var amadeus = new Amadeus({
    clientId: 'JLugRVGroghG9AdfvU5G4PNQwzZu2Rc6',
    clientSecret: 'AXX3Ab3HFnHfjWyP'
});

exports.hotelSearch = (params) => {

    const cityCode = params.location;
    // return location;
    return new Promise((resolve, reject) => {
        amadeus.referenceData.locations.hotels.byCity.get({
            cityCode: cityCode,

        }).then(function (response) {
            resolve(response.data);
        }).catch(function (responseError) {
            resolve([])
        });
    });
};

exports.roomSearch = (params) => {

    //const hotelIds = params.hotelIds;
    //return hotelIds;
    return new Promise((resolve, reject) => {
        amadeus.shopping.hotelOffersSearch.get({
            'hotelIds': 'BWLON799',
            'adults': '2',
            'checkInDate': '2024-10-10',
            'checkOutDate': '2024-10-12',
            'roomQuantity':1
            }).then(function (response) {
                resolve(response.data);
            }).catch(function (response) {
                resolve([])
            });
    });

};

exports.roomOffer = (params) => {

    //const hotelIds = params.hotelIds;
    //return hotelIds;
    return new Promise((resolve, reject) => {

        amadeus.shopping.hotelOfferSearch('XXOO7U9JOJ').get().then(function (response) {
                resolve(response.data);
            }).catch(function (response) {
                console.error(response);
            });
    });

};