const CryptoJS = require('crypto-js');

const decryption = (req, res, next) => {

    if (req.body.request_data) {
        let decryptedData = CryptoJS.AES.decrypt(req.body.request_data, "aLtAeNCrypT").toString(
            CryptoJS.enc.Utf8
        );
        delete req.request_data;
        req.body = JSON.parse(decryptedData);
        next();
    } else {
        if (process.env.APP_ENV == 'prod') {
            res.send({
                res_code: 201,
                response: "Missing parameter."
            })
        } else {
            next();
        }
    }
}

module.exports = decryption