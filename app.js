const express = require('express');
const app = express();

// let router = express.Router();

// let initWebRoutes = (app)=> {
//     router.get("/webhook", Response.getWebhook);
//     router.post("/webhook", Response.postWebhook);

//     return app.use("/", router);
// };

// module.exports = initWebRoutes;

// app.get('/webhook', (req, res) => {
//     let body = req.body;
//     console.log('webhook body',req.body)
//     if (body.object === 'page') {

//        body.entry.forEach(function(entry) {

//             let webhook_event = entry.messaging[0];
//             console.log(webhook_event);

//             let sender_psid = webhook_event.sender.id;
//             console.log('Sender PSID: ' + sender_psid);

//             if (webhook_event.message) {
//                 // handleMessage(sender_psid, webhook_event.message);
//             } else if (webhook_event.postback) {
//                 // handlePostback(sender_psid, webhook_event.postback);
//             }

//         });

//         res.status(200).send('EVENT_RECEIVED');

//     } else {
//        res.sendStatus(404);
//     }
// })

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/sendMessengerRequest', (req, res) => {
    let body = req.body;
    if (req.method === 'GET') {
        // let VERIFY_TOKEN = "EAAFjduB5tXUBOZCHsCJe3gCuiZCzMqI2Mx4CvuvZALCkfPhY1OyzZAoC2yChCEVHIEEKu4R0TmFBvRGVDkQ6IZBTAOxhxP9pHgeVnHpwTJ7HpEZBTBxg6dZBtZB0NSqsx8ZAhjsMFZC59rZC9eyZA0eqmpJo9iQdq7ZAaYAZBEuJJ1dkDdvE3359KNGutHXJpA11nd0e6ZB";

        // let mode = req.query['hub.mode'];
        // let token = req.query['hub.verify_token'];
        // let challenge = req.query['hub.challenge'];

        // console.log("toke List", mode, token, challenge)
        // if (mode && token === VERIFY_TOKEN) {
        //     res.status(200).send(challenge);
        // } else {
        //     res.sendStatus(403);
        // }
        res.status(200).send("CHALLENGE_ACCEPTED");
    } else {
        res.sendStatus(405); // Method Not Allowed
    }
});

app.post('/sendMessengerRequest', function(req, res) {
    //checking for page subscription.
    if (req.body.object === 'page'){
       
       /* Iterate over each entry, there can be multiple entries 
       if callbacks are batched. */
       req.body.entry.forEach(function(entry) {
       // Iterate over each messaging event
          entry.messaging.forEach(function(event) {
          console.log(event);
          if (event.postback){
             processPostback(event);
          } else if (event.message){
             processMessage(event);
          }
      });
    });
    res.sendStatus(200);
   }
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});