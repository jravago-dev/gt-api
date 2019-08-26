const AccountModel = require('../models/account.model');
const jwt = require('jsonwebtoken')
const { gtSecret, sendgridSecret, appEmail, activationTemplateCode, apiLink } = require('../../config');
const sgMail = require('@sendgrid/mail')

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
        isActivated: false,
        isLocked: false,
        activationCode: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    })

    AccountModel.findOne({
        emailAddress: req.body.emailAddress
    }).then((result) => {
        if (result !== null) {
            res.status(400).send({
                message: `That e-mail address is already taken.`
            })

        } else {
            account.save()
                .then(result => {
                    sendActivationEmail(req.body.emailAddress, `${apiLink}/activate/${result.activationCode}`, `${req.body.firstName}`)
                    res.status(200).send({
                        message: `Registration successful. Check your e-mail address to activate your account.`,
                    })
                })
                .catch(error => {
                    res.status(400).send({
                        message: `${error.message}`
                    })
                })


        }
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
                            emailAddress: account.emailAddress,
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

exports.activateAccount = (req, res) => {

    AccountModel.findOneAndUpdate({
        activationCode: req.params.activationCode,
        isActivated: false
    }, {
        $set: {
            isActivated: true,
            activationCode: ''
        }
    }, function(err, doc) {
        if (err) {
            return res.status(400).send({
                message: `An error occurred: ${err.message}`
            })
        }

        if (doc) {
            return res.status(200).send({
                message: `Account has been activated.`
            })
        } else {
            res.redirect('/')
        }
    })

}

function sendActivationEmail(emailAddress, activationKey, firstName) {
    sgMail.setApiKey(sendgridSecret);
    const msg = {
        to: emailAddress,
        from: appEmail,
        templateId: activationTemplateCode,
        dynamic_template_data: {
            activation_link: activationKey,
            name: firstName

        }

    };
    sgMail.send(msg)
        .then(res => {
            console.log(`Sent.`)
        })
        .catch(error => {
            console.log(`Failed: ${error.message}`)
        })
}