var fs        = require('fs');
var path      = require('path');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/config.json')[env];

/**
 * Mongoose
 */
var mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.Promise = global.Promise;
var connectionStr = 'mongodb://' + config.host + ':27017/' + config.database;
mongoose.connect(connectionStr, {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(connectionStr);
  console.log('Database connected. Rock and/or roll!');
});

/**
 * 2016-10-16 http://stackoverflow.com/questions/4878756/javascript-how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
 */
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1);});//.toLowerCase();});
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var modelName = toTitleCase(file.slice(0, -3));
    var model = mongoose.model(modelName, require(path.join(__dirname, file))(mongoose));
    db[modelName] = model;
  });

db.mongoose = mongoose;

module.exports = db;
