const {searchLocations} =require('../helpers/algolia.helper')

exports.searchContent = async (req, res) => {
   const result=await searchLocations(req.body);
   res.send(result);
}

exports.getContent = async (req, res) => {
    const result=await searchLocations(req.body);
    res.send(result);
}

// module.exports =searchContent