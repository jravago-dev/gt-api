const AccountModel = require('../models/account.model');
const jwt = require('jsonwebtoken')
const { gtSecret } = require('../../config');
require('dotenv').config();

exports.registerAccount = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Cannot save blank details."
        })
    }

    const account = new AccountModel({
        userName: req.body.userName,
        emailAddress: req.body.emailAddress,
        passwordHash: req.body.passwordHash,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        isActivated: req.body.isActivated,
        isLocked: req.body.isLocked
    })

    account.save()
        .then(result => {
            res.status(200).send({
                message: `Registration successful.`,
                account: result
            })
        })
        .catch(error => {
            res.status(400).send({
                message: `${error.message}`
            })
        })
}

exports.login = (req, res) => {
    AccountModel.findOne({
            userName: req.body.userName,
            isLocked: false,
            isActivated: true
        })
        .then((account) => {
            if (account !== null) {
                account.comparePassword(req.body.passwordHash, (error, isEqual) => {
                    if (isEqual) {
                        let token = jwt.sign({ accountId: account._id }, gtSecret)
                        res.status(200).json({
                            fullName: `${account.firstName} ${account.lastName}`,
                            token
                        })
                    } else {
                        res.status(401).send({
                            message: `Invalid password.`
                        })
                    }
                })
            } else {
                res.status(401).send({
                    message: `Invalid account credentials.`
                })
            }
        })
        .catch((error) => {
            res.status(500).send({
                message: `An error has occurred: ${error.message}`
            })
        })

}