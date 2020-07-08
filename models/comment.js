
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
var Comments = new Schema({

comment :String,    
name :String
});
module.exports = mongoose.model('Comments', Comments);
