module.exports = (app) => {
    const journalsController = require('../controllers/journal.controller')

    app.post('/journals', journalsController.getJournalEntries)
    app.get('/journal/:journalId', journalsController.getJournalEntry)
    app.post('/journal/save', journalsController.saveJournal)
    app.put('/journal/update', journalsController.updateJournal)
    app.put('/journal/delete', journalsController.deleteJournal)

}