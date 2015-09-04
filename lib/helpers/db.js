const mongoose = require('mongoose');

exports.init = dbname => {
  mongoose.connect(`mongodb://localhost/${dbname}`);
};
