const ObjectId = require('mongoose').Types.ObjectId
const User = require('../../models/users.model');
const { uploadToCloudinary } = require('../../utils/upload');

exports.update = async (req, res, next) => {
  try {
    let payload = req.body;
    let { userId } = req.params
    if (req.files) {
      for (const key in req.files) {
        const image = req.files[key][0]
        payload[key] = await uploadToCloudinary(image.path)
        payload[`${key}Local`] = image.filename
      }
    }

    let user = await User.findByIdAndUpdate({ _id: userId }, { $set: payload }, { new: true });
    let data = user.transform();
    return res.send({ success: true, data, message: "Your profile is updated successfully." });
  } catch (error) {
    return next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    let { userId } = req.params;
    let user = await User.findOne({ _id: ObjectId(userId) });
    user = user.transform();
    return res.send({ success: true, data: user, message: "Users fetched succesfully" });
  } catch (error) {
    return next(error);
  }
};


exports.uploadContent = async (req, res, next) => {
  try {
    const files = req.file ? `${req.file.filename}` : "";
    return res.json({ success: true, message: 'File upload successfully', data: files })
  } catch (error) {
    return res.status(400).send({ success: false, message: error });
  }
};

exports.getUserReferrals = async (req, res, next) => {
  try {
    let { userId } = req.params;
    let userReferrals = await User.find({ refferedBy: ObjectId(userId) });
    return res.send({ success: true, userReferrals, message: "User Referrals Retrieved Successfully." });
     } catch (error) {
    return next(error);
  }
};


exports.getTokenStats = async (req, res, next) => {
  try{
    const { symbol } = req.params
    

  } catch (error) {
    return next(error);
  }
} 