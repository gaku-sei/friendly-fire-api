const crypto = require('crypto');

exports.encrypt = (val, algo) => {
  const hash = crypto.createHash(algo || 'sha512');
  hash.update(val);
  return hash.digest('hex');
};
