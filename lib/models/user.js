const mongoose = require('mongoose');
const jsonpatch = require('fast-json-patch');
const util = require('../helpers/util');

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
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
  //friends
  //conversations
});

userSchema.pre('save', function(next) {
  if(!this._id) {
    this.password = util.encrypt(this.password);
  }
  next();
});

userSchema.statics.patch = function(id, patches) {
  return this.findById(id).exec().then(user => {
    if(patches.length > 0 && !jsonpatch.apply(user, patches)) {
      throw new Error('The provided patch is not valid');
    } else {
      return user.save();
    }
  });
};

module.exports = mongoose.model('User', userSchema);
