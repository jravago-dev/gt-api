const mongoose = require('mongoose')
const Schema = mongoose.Schema

const JournalEntry = Schema({
        emailAddress: {
            type: String,
        },
        journalDate: Date,
        journalBody: {
            type: String,
            required: [true]
        },
        journalStatus: String,
        isDeleted: Boolean
    }, {
        timestamps: true
    }

)

module.exports = mongoose.model('JournalEntries', JournalEntry)