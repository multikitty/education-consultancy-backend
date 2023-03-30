const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const {
  pwdSaltRounds,
  jwtExpirationInterval,
  pwEncryptionKey,
  uploadedImgPath
} = require('../../config/vars');

/**
 * User Schema
 * @private
 */
const UserSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  dob: { type: Date },
  referralKey: { type: String },
  refferedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: { type: String, required: true, lowercase: true, unique: true },
  password: { type: String, required: true },
  status: { type: Boolean, default: true },
  resetPasswordToken: { type: String },
  connectedWalletAddress: { type: String },
  profileImage: { type: String },
  bannerImage: { type: String },
  profileImageLocal: { type: String },
  bannerImageLocal: { type: String },
  userLevel: { type: Number, default: 0 }, //0- Basic, 1- Bronze, 2-Silver, 3- Gold, 4-Platinum
  userSubLevel: { type: Number }, //1,2,3
  userKeyStatus: { type: Number, required: true, default: 1 }, // 1- Non Verified KYC, 2- Verification Of KYC, 3- KYC Verified 
  twoFactorTempSecret: { type: String },
  twoFactorEnabled: { type: Boolean, default: false },
  referralBonus: { type: Number, default: 0 },
  deletedAccount: { type: Boolean, default: false }
}, { timestamps: true }
);

/**
 * Methods
 */

UserSchema.method({
  verifyPassword(password) {
    return bcrypt.compareSync(password, this.password);
  },
  transform() {
    const transformed = {};
    const fields = ['_id', 'firstName', 'lastName', 'email', 'profileImage', 'status', 'dob', 'connectedWalletAddress', 'bannerImage', 'referralKey', 'userKeyStatus', 'refferedBy', 'referralBonus'];

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
});

UserSchema.pre('save', async function save(next) {
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
 * @typedef User
 */

module.exports = mongoose.model('User', UserSchema);