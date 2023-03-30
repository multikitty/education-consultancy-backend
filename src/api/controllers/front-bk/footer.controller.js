const Settings = require('../../models/settings.model');
const NewsLetter = require('../../models/newsletter.model');
const { checkDuplicate } = require('../../middlewares/error');
const axios = require('axios');

exports.submit = async (req, res, next) => {
    try {
        let payload = req.body

        let newsLetter = await NewsLetter.create(payload);

        if (newsLetter)
            return res.send({ success: true, message: "Email Submitted Successfully." });

    } catch (error) {
        if (error.code === 11000 || error.code === 11001)
            checkDuplicate(error, res, 'Email');
        else
            return next(error);
    }
}

exports.get = async (req, res, next) => {
    try {
        let footer = await Settings.findOne({}, { discord: 1, twitter: 1, youtube: 1, instagram: 1, medium: 1, reddit: 1, telegram: 1, github: 1, linkedIn: 1, facebook: 1, desc: 1, _id: 0 }).lean(true);
        return res.send({ success: true, message: "Footer Retrieved Successfully.", footer });
    } catch (error) {
        return next(error);
    }
}

exports.cryptocurrencyListing = async(req,res,next) => {
    let response = null;
    new Promise(async (resolve, reject) => {
      try {
        response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
          headers: {
            'X-CMC_PRO_API_KEY': '7c9a4cbf-413c-4d75-a6d5-8ac2740fe4fd',
          },
        });
      } catch(ex) {
        response = null;
        // error
        console.log(ex);
        reject(ex);
      }
      if (response) {
        // success
        const json = response.data;
        let currenciesData = json.data
        currenciesData = currenciesData.slice(0,6)
        resolve(currenciesData);
        res.send({success: true, message: "Currencies Fetched Successfully", currenciesData})

      }
    });
}