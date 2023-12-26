const CryptoJS = require('crypto-js');

const encryption = (req, res, next) => {

    var oldSend = res.json;

    res.json = function (data) {
        let encryptedData = CryptoJS.AES.encrypt(JSON.stringify(arguments[0]), "aLtAeNCrypT").toString();
        if (process.env.APP_ENV == 'prod') {
            arguments[0] = { response_data: encryptedData };
        } else {
            arguments[0] = { response_data: encryptedData, main_data: arguments[0] };
        }
        // arguments[0] = { response_data: encryptedData };
        oldSend.apply(res, arguments);
    }
    next();
}

module.exports = encryption