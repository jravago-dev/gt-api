const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const Account = Schema({
        userName: {
            type: String,
            unique: true,
            required: [true, 'Username is required.']
        },
        emailAddress: {
            type: String,
            unique: true,
            required: [true, 'E-mail address is required.']
        },
        passwordHash: String,
        firstName: String,
        lastName: String,
        isActivated: Boolean,
        isLocked: Boolean,
        activationCode: String
    }, {
        timestamps: true
    }

)

Account.pre('save', function(next) {
    var account = this;
    if (!account.isModified('passwordHash')) { return next() };
    bcrypt.hash(account.passwordHash, 15).then((hashedPassword) => {
        account.passwordHash = hashedPassword
        next()
    })
}, function(error) {
    next(error)
});

Account.methods.comparePassword = function(inputPassword, next) {
    bcrypt.compare(inputPassword, this.passwordHash, function(error, isEqual) {
        if (error) return next(error);
        next(null, isEqual)
    })
}


module.exports = mongoose.model('Accounts', Account)