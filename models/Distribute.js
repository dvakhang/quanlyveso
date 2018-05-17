/**
 * Written by khang <dvakhang34@gmail.com> on May 11, 2018
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const relationship = require("mongoose-relationship");

const distributeSchema = new mongoose.Schema({
  block: Number,
  quantity: Number,
  type: String,
  agent: { type: Schema.ObjectId, ref: 'Agent', childPath: 'distributes' },
}, {
  timestamps: true
});

const Distribute = mongoose.model('Distribute', distributeSchema);

module.exports = Distribute;
