const express = require('express')
const webpush = require('web-push')
const cors = require('cors')
const bodyParser = require('body-parser')

const PUBLIC_VAPID = ""
const PRIVATE_VAPID = ""

const fakeDatabase = []

const app = express()

app.use(cors())
app.use(bodyParser.json())

webpush.setVapidDetails('mailto:you@domain.com', PUBLIC_VAPID, PRIVATE_VAPID)

app.post('/subscribe', (req, res) => {
    let sub = req.body;
    fakeDatabase.push(sub)
    res.set('Content-type', 'application/json');
    webpush.setVapidDetails(
        'mailto:justinshobby@zoho.com',
        PUBLIC_VAPID,
        PRIVATE_VAPID
    );

    let payload = JSON.stringify({
        "notification": {
            "title": "Grace:Today Notification",
            "body": "This is a test notification. Thanks for using the app!",
            "icon": "assets/icons/icon-512x512.png",
        }
    });


    Promise.all(fakeDatabase.map(s => triggerPushMsg(s, payload)))
        .then(() => res.status(200).send({ message: `Sub notif request received.` }))
        .catch(error => { res.status(500).send({ message: error }) })



})

const triggerPushMsg = function(subscription, dataToSend) {
    return webpush.sendNotification(subscription, dataToSend)
        .catch((err) => {
            if (err.statusCode === 404 || err.statusCode === 410) {
                console.log('Subscription has expired or is no longer valid: ', err);
                //return deleteSubscriptionFromDatabase(subscription._id);
                fakeDatabase = [];
            } else {
                throw err;
            }
        });
};

app.post('/sendmessage', (req, res) => {

    const postmanPayload = JSON.stringify({
        "notification": {
            "title": "Grace:Today",
            "body": "Test VOTD notif is here!",
            "icon": "assets/icons/icon-512x512.png",
            "vibrate": [100, 50, 100],
            "data": {
                "dateOfArrival": Date.now(),
                "primaryKey": 1
            },
            "actions": [{
                "action": "Great",
                "title": "What?"
            }]
        }
    });

    Promise.all(fakeDatabase.map(s => triggerPushMsg(s, postmanPayload)))
        .then(() => res.status(200).send({ message: `Postman message sent.` }))
        .catch(error => { res.status(500).send({ message: error }) })

});


app.listen(3000, () => {
    console.log('Server started on port 3000')
});