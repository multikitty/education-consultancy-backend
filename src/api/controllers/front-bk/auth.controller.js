const User = require('../../models/users.model');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const { sendEmail } = require('../../utils/emails/emails')
const { frontenUrl } = require('../../../config/vars');
const { uploadToCloudinary } = require('../../utils/upload');
var randomize = require('randomatic');
const randomstring = require("randomstring");
var CryptoJS = require("crypto-js");

exports.register = async (req, res, next) => {
  try {
    let { firstName, lastName, email, password, referralKey } = req.body;
    let referredByUserDeatils = await User.findOne({ referralKey });


    if (email && password) {
      email = email.toLowerCase();

      let user = await User.findOne({ email });
      if (user) {
        return res.status(200).send({ success: false, message: 'User already exists' });
      }

      let userPayload = {
        firstName, lastName, email, password,
        referralKey: randomize('ab0', 11),
      }

      if (referralKey) {
        userPayload.refferedBy = referredByUserDeatils._id
      }
      user = await User.create(userPayload);

      const rndmoken = randomstring.generate({ length: 16, charset: 'alphanumeric' })
      let content = { "${url}": `${process.env.REACT_APP_FRONT_URL}/verify-email/${rndmoken}`, "${email}": email, }
      const payload = {}
      payload.token = rndmoken
      payload.email = email
      payload.type = "verify-user"
      payload.data = { url: `${process.env.REACT_APP_FRONT_URL}/verify-email/${rndmoken}`, email: email, }
      payload.status = true
      await sendEmail(email, 'verify-user', content)

      var accessToken = await user.token();
      user = user.transform();

      let data = {
        ...user,
        accessToken,
      }

      return res.status(200).send({
        success: true,
        message: 'User registered successfully',
        data: data
      })
    }
    else return res.status(200).send({ success: false, message: 'Required fields are missing' });
  } catch (error) {
    next(error)
  }
}

/**
 * Returns jwt token if valid email and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    let { email, password, otp } = req.body;
    if (email)
      email = email.toLowerCase();

    if (email && password) {
      passport.use(new localStrategy({ usernameField: 'email' },
        (username, password, done) => {

          User.findOne({ email: username }, (err, user) => {
            if (err)
              return done(err);
            if (user && user.password === undefined) // unregistered email
              return done(null, false, { success: false, message: 'User does not exist!' });
            else if (!user) // unregistered email
              return done(null, false, { success: false, message: 'Incorrect email or password' });
            else if (!user.verifyPassword(password)) // wrong password
              return done(null, false, { success: false, message: 'Incorrect email or password' });
            else return done(null, user);
          }).populate({ path: "roleId", select: 'title' });
        })
      );
      // call for passport authentication
      passport.authenticate('local', async (err, user, info) => {
        if (err) return res.status(400).send({ err, success: false, message: 'Oops! Something went wrong while authenticating' });
        // registered user
        else if (user) {
          var accessToken = await user.token();
          user['password'] = undefined
          user['resetPasswordToken'] = undefined

          console.log("user = ", user)

          let data = {
            ...user._doc,
            accessToken,
          }
          await User.updateOne({ _id: user._id }, { $set: { accessToken } }, { upsert: true });
          return res.status(200).send({ success: true, message: 'You have logged in successfully', data });
        }

        // unknown user or wrong password
        else return res.status(200).send({ success: false, message: 'Incorrect email or password' });
      })(req, res);
    } else
      return res.status(200).send({ success: false, message: 'Email & password required' });
  } catch (error) {
    return next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    let { email } = req.body;
    if (email) {
      email = email.toLowerCase();
      User.findOne({ email }, async (err, user) => {
        if (err) return res.status(400).send({ err, success: false, message: 'Oops! Something went wrong while finding' });
        if (user) {
          const resetPasswordToken = randomstring.generate({
            length: 8,
            charset: 'alphanumeric'
          })
          user.resetPasswordToken = resetPasswordToken;
          user.save();

          let content = { "${url}": `${frontenUrl}/reset-password/${user._id}/${resetPasswordToken}` }
          await sendEmail(email, 'forgot-password', content)
          res.status(200).send({ success: true, message: 'Email sent successfully' });
        } else return res.status(200).send({ success: false, message: 'Please enter valid email' });
      });
    } else return res.status(200).send({ success: false, message: 'Please enter email' });
  } catch (error) {
    next(error)
  }
}

exports.resetPassword = async (req, res, next) => {
  try {
    let { password, resetPasswordToken } = req.body;

    User.findOne({ resetPasswordToken }, (err, user) => {
      if (err) return res.status(400).send({ err, success: false, message: 'Oops! Something went wrong while finding' });
      if (user) {
        user.resetPasswordToken = undefined;
        user.password = password;
        user.xOauth = CryptoJS.AES.encrypt(password, "SecureWay");
        user.save();

        // password has been reset successfully
        return res.status(200).send({ success: true, message: 'Your password is changed successfully!' });
      } else {
        return res.status(400).send({ message: 'Unsuccessful! Your reset token has been expired or no token exists. Kindly, make request again for password reset', success: false });
      }
    });
  } catch (e) {
    console.log(e)
    next(error)
  }
}

exports.changePassword = async (req, res, next) => {
  let { newPwd, currentPwd } = req.body;
  let userId = req.user
  User.findOne({ _id: userId }, (err, user) => {
    if (err) return res.status(400).send({ err, success: false, message: 'Oops! Something went wrong while finding' });
    if (user && user.verifyPassword(currentPwd)) {

      user.password = newPwd;
      user.xOauth = CryptoJS.AES.encrypt(newPwd, "SecureWay");
      user.save();

      // password has been successfully change
      return res.status(200).send({ success: true, message: 'Your password is changed successfully!' });
    } else {
      return res.status(400).send({ message: 'Unsuccessful! Current Password not matched', success: false });
    }
  });
}

exports.editProfile = async (req, res, next) => {
  try {

    let payload = req.body;
    let userId = req.user

    if (payload.newEmail) {
      User.findOne({ _id: userId }, (err, user) => {
        if (err) return res.status(400).send({ err, success: false, message: 'Oops! Something went wrong while finding' });
        if (user && user.verifyPassword(payload.password)) {
          user.email = payload.newEmail
          user.save();
          let data = user.transform();
          return res.status(200).send({ success: true, data, message: 'Your profile is updated successfully.' });
        } else {
          return res.status(400).send({ message: 'Unsuccessful! Invalid Password.', success: false });
        }
      })
    } else {

      // if (req.files) {
      //   for (const key in req.files) {
      //     const image = req.files[key][0]
      //     payload[key] = await uploadToCloudinary(image.path)
      //     payload[`${key}Local`] = image.filename
      //   }
      // }

      let user = await User.findByIdAndUpdate({ _id: userId }, { $set: payload }, { new: true });

      let userData = user.transform();
      let data = {
        ...userData,
      }

      return res.send({ success: true, data, message: "Your profile is updated successfully." });
    }
  } catch (error) {
    return next(error);
  }
};

exports.updateBanner = async (req, res, next) => {
  try {
    let payload = req.body;
    if (req.files) {
      for (const key in req.files) {
        const image = req.files[key][0]
        payload[key] = await uploadToCloudinary(image.path)
        payload[`${key}Local`] = image.filename
      }
    }

    await User.findByIdAndUpdate({ _id: payload._id }, { $set: payload });

    return res.send({ success: true, message: "Your profile banner updated successfully." });
  } catch (error) {
    return next(error);
  }
};