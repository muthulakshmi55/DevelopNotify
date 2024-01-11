const dotenv = require('dotenv');
dotenv.config({path:'./.env'})
const express = require('express');
const axios = require('axios');
const app = express();

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

// app.post('/sendMessengerRequest', async function(req, res) {
  
//   try {
//       let senderId = req.query['senderId'];
      
//       await axios.get(`https://graph.facebook.com/v12.0/${senderId}`, {
//           headers: {
//               'Accept': 'application/json',
//               'Accept-Charset': 'utf-8',
//               'User-Agent': 'test-bot',
//               'Authorization': `Bearer ${process.env.FB_PAGE_TOKEN}`, // Include the access token in the headers
//           },
//           timeout: 5000, // Adjust the timeout as needed
//       })
//       .then(response => {
//           console.log('faceUserInfo', response.data);
//           res.sendStatus(200);
//       })
//       .catch(error => {
//           console.error('Error fetching user information:', error.message);
//           res.sendStatus(403);
//       });
//   } catch (error) {
//       console.error('Error sending message:', error.config);
//       res.sendStatus(404);
//   }
// });

  app.post('/webhook', (req, res) => {
    let body = req.body;

    if (body.object === 'page') {

        body.entry.forEach(function(entry) {

            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }

        });

        res.status(200).send('EVENT_RECEIVED');

    } else {

        res.sendStatus(404);
    }
  });

  function handleMessage(senderPsid, message) {
    const recipientId = senderPsid;
    const messageText = message.text;
  
    console.log('Received message from:', recipientId);
    console.log('Message text:', messageText);
  
  }

  function handlePostback(sender_psid, received_postback) {
    let recipientId = sender_psid;
    let payload = received_postback.payload;
   
    console.log('sender_psid:', recipientId);
    console.log('payload:', payload);
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});