const Contact = require('../../models/contact.model');
const Settings = require('../../models/settings.model')
const mongoose = require('mongoose')
const { uploadToCloudinary } = require('../../utils/upload')
const { sendEmail } = require('../../utils/emails/emails')
exports.create = async (req, res, next) => {
  try {

    let contact = await Contact.create(req.body);
    res.send({ success: true, data: contact, message: 'Support Form successfully send' });
  } catch (error) {
    return next(error);
  }
};