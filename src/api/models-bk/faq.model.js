const mongoose = require('mongoose');

/**
 * FAQ Schema
 * @private
 */
const FaqSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    catId: { type: mongoose.Schema.Types.ObjectId, ref: 'faq-categories', required: true },
    desc: { type: String, required: true, default: '' },
    status: { type: Boolean, default: false },
}, { timestamps: true }
);

/**
 * @typedef FAQ
 */

module.exports = mongoose.model('faq', FaqSchema);