const algoliaConfig = require("../config/algolia");

const searchLocations = async ({ country, continent, required }) => {
    const cityIndex = await algoliaConfig("city_master");
    let data = await cityIndex.search(country || continent);
    let content = data.hits || [];
    return content;
    // return (required == 'country' && filterCountry(content)) || (required == 'city' && filterCity(content));
}

const searchLocationsByText = async ({ searchTxt, required }) => {
    const cityIndex = await algoliaConfig("city_master");
    let data = await cityIndex.search(searchTxt);
    let content = data.hits || [];
    return content;
    // return (required == 'country' && filterCountry(content)) || (required == 'city' && filterCity(content));
}

const searchFerry = async (params, start_time) => {
    const ferriesIndex = await algoliaConfig("ferries_master");

    const data = await ferriesIndex.search(params.start_city_code, {
        facetFilters: ['arrival_city_code:' + params.end_city_code]
    })
    return data.hits.filter(obj => obj.departure_time >= start_time);
}

// const filterCountry = (arr) => {
//     var parsed = arr.map(function (item) {
//         return {
//             country: item.country
//         }
//     })
//     return parsed;
// }

// const filterCity = (arr) => {
//     var parsed = arr.map(function (item) {
//         return {
//             city: item.city
//         }
//     })
//     return parsed;
// }

module.exports = { searchLocations, searchFerry, searchLocationsByText };