var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;
var FeedbackSchema = mongoose.Schema({
    text: String,
    projectID: ObjectId,
    image: String,
    type: String,
    browser: String,
    OS: String
});

module.exports = mongoose.model('Feedback', FeedbackSchema);