var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var ObjectId = mongoose.Schema.Types.ObjectId;
var userSchema = mongoose.Schema({
    local: {
        email: String,
        password: String,
        name: String,
        companyID: ObjectId,
        designation: String
    }
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);