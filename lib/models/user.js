'use strict';

const mongoose = require('mongoose');
const jsonpatch = require('fast-json-patch');

const userSchema = mongoose.Schema({
  nickname: String,
  realname: String,
  forename: String,
  message: String,
  email: {type: String, required: true},
  password: {type: String, required: true},
  age: Number,
  bio: String,
  avatarUrl: String,
  conversations: [{type: mongoose.Schema.Types.ObjectId, ref: 'Conversation'}],
  friends: [{type: mongoose.Schema.Types.ObjectId, red: 'User'}],
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
});

userSchema.statics.patch = function(id, patches) {
  return this.findById(id).exec().then(user => {
    if(patches.length > 0 && !jsonpatch.apply(user, patches)) {
      throw new Error('The provided patch is not valid');
    } else {
      user.createdAt = Date.now();
      return user.save();
    }
  });
};

module.exports = mongoose.model('User', userSchema);
