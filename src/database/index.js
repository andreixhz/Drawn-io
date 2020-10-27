const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/drawiodata');
mongoose.Promise = global.Promise;
module.exports = mongoose;