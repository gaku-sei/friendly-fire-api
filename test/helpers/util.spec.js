'use strict';

var util = require('../../lib/helpers/util');
var chai = require('chai');

chai.should();

describe('util', function() {
  describe('#encrypt', function() {
    it('should encrypt a string according to the provided algorythm', function() {
      var input = 'foobar';
      var outputs = {
        sha1: '8843d7f92416211de9ebb963ff4ce28125932878',
        md5: '3858f62230ac3c915f300c664312c63f'
      };
      for(var key in outputs) {
        util.encrypt(input, key).should.equal(outputs[key]);
      }
    });

    it('should encrypt a string in sha512 if no algorythm is provided', function() {
      var input = 'foobar';
      var output = '0a50261ebd1a390fed2bf326f2673c145582a6342d523204973d0219337f81616a8069b012587cf5635f6925f1b56c360230c19b273500ee013e030601bf2425';
      util.encrypt(input).should.equal(output);
    });
  });
});
