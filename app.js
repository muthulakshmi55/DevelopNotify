const dotenv = require('dotenv');
dotenv.config({path:'./.env'})
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
  console.log(process.env.VERIFY_FB_TOKEN)
    res.send('Hello, World!');
});

app.get('/sendMessengerRequest', (req, res) => {
    let body = req.body;
    if (req.method === 'GET') {
        let VERIFY_TOKEN = process.env.VERIFY_FB_TOKEN

        let mode = req.query['hub.mode'];
        let token = req.query['hub.verify_token'];
        let challenge = req.query['hub.challenge'];

        console.log("Token:", token);
        console.log("Expected Token:", VERIFY_TOKEN);
        if (mode && token.trim() === VERIFY_TOKEN.trim()) {
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }

    } else {
        res.sendStatus(405); // Method Not Allowed
    }
});

app.get('/webhook', (req, res) => {
  let body = req.body;
    if (req.method === 'GET') {
        let VERIFY_TOKEN = process.env.VERIFY_FB_TOKEN

        let mode = req.query['hub.mode'];
        let token = req.query['hub.verify_token'];
        let challenge = req.query['hub.challenge'];

        if (mode && token === VERIFY_TOKEN) {
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
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

  app.post('/webhook', (req, res) => {
    let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);


            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }

        });

        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
  });

  function handleMessage(senderPsid, message) {
    const recipientId = senderPsid;
    const messageText = message.text;
  
    console.log('Received message from:', recipientId);
    console.log('Message text:', messageText);
  
    // You can use the recipientId to send a response or store it for later use
  }

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});