const Algolia = require("algoliasearch")

class FerryController{
    async fetchFromAlgolia(req,res){
        // const dt = params.departure_datetime.split('T')[1]
        // const start_time = dt.split(':')[0] + ':' + dt.split(':')[1]
        const algoliaClient = new Algolia('C2CIGV0HZ4', '92c465f379330bfc3c60c340bb1aceac');
        const ferriesIndex = algoliaClient.initIndex("ferries_master_second");

        const data = await ferriesIndex.search(req.body.departure_port, {
            facetFilters: ['arrival_port:' + req.body.arrival_port]
        })
        // const routes = data.hits.filter(obj => obj.departure_time >= start_time);
        return res.json(data.hits);
    }
}

module.exports = new FerryController();