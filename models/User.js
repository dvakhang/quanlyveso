/**
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Khang.Dong <dvakhang34@gmail.com> on May 01, 2018
 */
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const relationship = require("mongoose-relationship");
const namedScopesPlugin = require('mongoose-named-scopes')

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: String,
  tokens: Array,
  passwordResetToken: String,
  passwordResetExpires: Date,
  publish: { type: Boolean, default: true },
  admin: { type: Boolean, default: false },
  deleteFlag: { type: Boolean, default: false },
  activeFlag: { type: Boolean, default: true },

  profile: {
    name: String,
    gender: String,
    phone: String,
    location: String,
    website: String,
    picture: String,
    about: String,
    firstname: String,
    lastname: String
  },

  role: {
    type: String,
    default: 'USER',
  },

  distributeOrder: {
    type: Number,
    default: 0
  },
  domains: [{ type: Schema.ObjectId, ref: 'DistributeDomain' }]
}, { timestamps: true });

/**
 * Plugins
 */
userSchema.plugin(namedScopesPlugin)

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

userSchema.scope('salers').where('role').equals('SALE').where('activeFlag').equals(true)

const User = mongoose.model('User', userSchema);

module.exports = User;
