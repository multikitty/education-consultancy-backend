const byPassedRoutes = ['/v1/cron/conversion/rate/','/v1/admin/staff/create','/v1/front/test','/v1/front/auth/login','/v1/admin/staff/login','/v1/front/auth/register','/v1/front/auth/login','/v1/front/auth/forgot-password','/v1/front/auth/reset-password','/v1/mobile/auth/sigin','/v1/mobile/auth/signup','/v1/mobile/auth/forgotPassword','/v1/front/games/get-games'];
const User = require('../../models/users.model');
const Admin = require('../../models/admin.model')
const CryptoJS = require("crypto-js");
const { pwEncryptionKey, frontEncSecret } = require('./../../../config/vars');
const jwt = require('jsonwebtoken');

exports.authenticate = async (req, res, next) => {
    if (req.originalUrl.indexOf("/v1/") > -1) {
        if (byPassedRoutes.indexOf(req.originalUrl) > -1 || req.originalUrl.indexOf("/v1/xyz") > -1) {
            next();
        }
        else {
            if (req.headers['x-auth-token']) {
                var decryption_string = req.headers['x-auth-token'];
                
                if (req.token) {
                    var bytes = CryptoJS.AES.decrypt(req.token, decryption_string);
                    // var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
                    // if (decryptedData !== frontEncSecret) {
                    //     const message = 'auth_request_required_front_error1'
                    //     return res.status(405).json({ success: false, message });
                    // }
                    // else {
                        next();
                    // }
                }
                else if (req.method.toLocaleLowerCase() !== 'options') {
                    const message = 'auth_request_required_front_error2'
                    return res.status(405).json({ success: false, message });
                }
                else {
                    next();
                }
            }
            else if (req.method.toLocaleLowerCase() !== 'options' && 
                    (req.url.indexOf('/v1/admin/staff/private-admin') > -1)) {
                    next()
            }
            else if (req.method.toLocaleLowerCase() !== 'options') {
                const message = 'auth_request_required_front_error3'
                return res.status(405).json({ success: false, message });
            }
            else {
                next();
            }
        }
    }
    else {
        next();
    }
}

exports.userValidation = async (req, res, next) => {
    let flag = true;
    req.user = 0;
    if (req.headers['x-access-token']) {
        await jwt.verify(req.headers['x-access-token'], pwEncryptionKey, async (err, authorizedData) => {
            if (err) {
                flag = false;
                const message = 'session_expired_front_error'
                return res.send({ success: false, userDisabled: true, message, err });
            }
            else {
                const reqPlatform = Number(req.headers['user-platform'])
                req.user = authorizedData.sub;
                if (reqPlatform === 1) {
                    let user = await User.findById({ _id: req.user }).lean();
                    if (!user) {
                        flag = false;
                        return res.send({ success: false, user404: true, message: 'There is no account linked to that id', notExist: 1 });
                    }
                }
                else if (reqPlatform === 2) {
                    let admin = await Admin.findById({ _id: req.user }).lean();
                    if (!admin) {
                        flag = false;
                        return res.send({ success: false, user404: true, message: 'There is no account linked to that id', notExist: 1 });
                    }
                }
            }
        })
    }
    else if (req.method.toLocaleLowerCase() !== 'options') {
        req.user = 0;
    }

    if (flag)
        next();
}
