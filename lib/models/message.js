'use strict';

const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  conversation: {type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true},
  content: {type: String, required: true},
  createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Message', messageSchema);
