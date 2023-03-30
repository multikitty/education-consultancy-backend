const mongoose = require('mongoose');

/**
 * Activity Schema
 * @private
 */
const ActivitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: Number },
    price: { type: Number },
    currency: { type: String }
}, { timestamps: true }
);

/**
 * @typedef Activities
 */

module.exports = mongoose.model('Activities', ActivitySchema);
