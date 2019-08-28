const JournalModel = require('../models/journal.model');
require('dotenv').config();

exports.getJournalEntries = (req, res) => {

    JournalModel
        .aggregate([{
                $match: {
                    emailAddress: req.body.emailAddress,
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: {
                        date: {
                            $dateToString: { format: "%Y-%m-%d", date: "$journalDate" }
                        }
                    },
                    journalEntries: {
                        $push: '$$ROOT'
                    }
                }
            }
        ])
        .exec(function(err, journalRecords) {
            if (err) {
                return res.status(400).send({
                    message: `Cannot retrieve journal entries: ${err.message}`
                })
            }

            return res.status(200).send(journalRecords)

        })

}

exports.getJournalEntry = (req, res) => {

    JournalModel.findOne({
            _id: req.params.journalId
        })
        .exec(function(err, journalRecord) {
            if (err) {
                return res.status(400).send({
                    message: `Cannot retrieve journal entry: ${err.message}`
                })
            }
            return res.status(200).send({
                journalRecord
            })
        })
}

exports.saveJournal = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Cannot save blank details."
        })
    }

    const journalEntry = new JournalModel({
        emailAddress: req.body.emailAddress,
        journalDate: new Date(Date.now()),
        journalBody: req.body.journalBody.toString().trim(),
        journalStatus: req.body.journalStatus,
        isDeleted: false
    })

    journalEntry.save()
        .then(result => {
            return res.status(200).send({
                message: `Journal Entry has been saved.`
            })
        })
        .catch(error => {
            return res.status(400).send({
                message: `An error has occured while saving: ${error.message}`
            })
        })
}

exports.updateJournal = (req, res) => {


    if (!req.body) {
        return res.status(400).send({
            message: "Cannot save blank details."
        })
    }


    JournalModel.findById(req.body.journalId, function(err, oldJournal) {
            if (err) {
                return res.status(400).send({
                    message: `An error has occured while saving: ${err.message}`
                })
            }

            oldJournal.journalDate = req.body.journalDate;
            oldJournal.journalStatus = req.body.journalStatus;
            oldJournal.journalBody = req.body.journalBody;

            oldJournal.save().then(result => {
                    return res.status(200).send({
                        message: `Journal Entry has been saved.`
                    })
                })
                .catch(error => {
                    return res.status(400).send({
                        message: `An error has occured while saving: ${error.message}`
                    })
                })


        })
        .catch(error => {
            return res.status(400).send({
                message: `An error has occured while saving: ${error.message}`
            })
        })

}

exports.deleteJournal = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Cannot save blank details."
        })
    }


    JournalModel.findById(req.body.journalId, function(err, oldJournal) {
            if (err) {
                return res.status(400).send({
                    message: `An error has occured while saving: ${err.message}`
                })
            }

            oldJournal.isDeleted = true;
            oldJournal.save().then(result => {
                    return res.status(200).send({
                        message: `Journal Entry has been deleted.`
                    })
                })
                .catch(error => {
                    return res.status(400).send({
                        message: `An error has occured while deleting: ${error.message}`
                    })
                })
        })
        .catch(error => {
            return res.status(400).send({
                message: `An error has occured while deleting: ${error.message}`
            })
        })
}