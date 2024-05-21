const Algolia = require("algoliasearch")

const algoliaConfig = async (indexName) => {
    // console.log(process.env.ALGOLIA_APP_ID);
    const appId = process.env.ALGOLIA_APP_ID;
    const adminKey = process.env.ALGOLIA_ADMIN_KEY;
    const algoliaClient = new Algolia(appId, adminKey);
    // return algoliaClient;
    const algoliaIndex = algoliaClient.initIndex(indexName);
    return algoliaIndex;
}

module.exports = algoliaConfig;