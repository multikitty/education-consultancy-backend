const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const {
    pwdSaltRounds,
    jwtExpirationInterval,
    pwEncryptionKey
} = require('../../config/vars');

/**
 * Admin Schema
 * @private
 */
const AdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    roleId: { type: String, required: true },
    status: { type: Boolean, required: true, default: false },
    image: { type: String },
    imageLocal: { type: String },
    resetCode: { type: String }
}, { timestamps: true }
);

AdminSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

AdminSchema.methods.getPasswordHash = async function (password) {
    const rounds = pwdSaltRounds ? parseInt(pwdSaltRounds) : 10;
    const hash = await bcrypt.hash(password, rounds);
    return hash
}

/**
 * Methods
 */
AdminSchema.method({
    transform() {
        const transformed = {};
        const fields = ['email'];
        fields.forEach((field) => {
            transformed[field] = this[field];
        });
        return transformed;
    },

    token() {
        const playload = {
            exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
            iat: moment().unix(),
            sub: this._id,
        };
        return jwt.encode(playload, pwEncryptionKey);
    },
    async passwordMatches(password) {
        return bcrypt.compare(password, this.password);
    }
});

AdminSchema.pre('save', async function save(next) {
    try {
        if (!this.isModified('password')) return next();
        const rounds = pwdSaltRounds ? parseInt(pwdSaltRounds) : 10;
        const hash = await bcrypt.hash(this.password, rounds);
        this.password = hash;
        return next();
    }
    catch (error) {
        return next(error);
    }
});

/**
 * @typedef Admin
 */

module.exports = mongoose.model('Admin', AdminSchema);