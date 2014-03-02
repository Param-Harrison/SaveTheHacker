var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;
var ProjectSchema = mongoose.Schema({
    name: String,
    companyID: ObjectId
});

module.exports = mongoose.model('Project', ProjectSchema);