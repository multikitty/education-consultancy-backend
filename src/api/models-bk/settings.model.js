const mongoose = require('mongoose');

/**
 * Settings Schema
 * @private
 */
const SettingsSchema = new mongoose.Schema({
    email: { type: String, default: '' },
    address: { type: String, default: '' },

    discord: { type: String, default: '' },
    twitter: { type: String, default: '' },
    youtube: { type: String, default: '' },
    instagram: { type: String, default: '' },
    medium: { type: String, default: '' },
    reddit: { type: String, default: '' },
    telegram: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedIn: { type: String, default: '' },
    facebook: { type: String, default: '' },

    desc: { type: String, default: '' },
    domain: { type: String, default: '' },
    api: { type: String, default: '' },
    referrarPercentage: { type: Number },
}, { timestamps: true }
);

/**
 * @typedef Settings
 */

module.exports = mongoose.model('Settings', SettingsSchema);