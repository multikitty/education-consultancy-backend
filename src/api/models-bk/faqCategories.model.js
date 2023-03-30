const mongoose = require('mongoose');

/**
 * FAQCategories Schema
 * @private
 */
const FaqCategoriesSchema = new mongoose.Schema({
    title: { type: String, required: true, unique:true },
    desc: { type: String, required: true, default: ''},
    status: { type: Boolean, default: false},
}, { timestamps: true }
);

/**
 * @typedef FAQCategories
 */

module.exports = mongoose.model('faq-categories', FaqCategoriesSchema);