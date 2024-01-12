const facebook = require('fb-messenger-bot-api');
const messagingClient = new facebook.FacebookMessagingAPIClient("EAAWBW0YnBP0BO2NZCnytVVTOQypZBt7dqmNwlWwSdPWiEb3ZAw5tH0Ku0k9nHippHqLO0EPQyJGogZCl4EjNMosZBNfxui7Dy3Ql77Ud3lhd4pXaBt3BxxL3uZBdVrZC4l07iDp7E5Ld2TNpbiSeV6wsmDHs1SLOtfNwF4L0rGxuacZAivXJsFWu3dDWG7tnDtDx");
const messageParser = facebook.FacebookMessageParser;
const express = require('express');
const app = express();

const validationOptions = {
    verifyToken: 'notifytesting123success', // Replace with your actual verify token
};
app.get('/', (req, res) => {
    console.log(process.env.VERIFY_FB_TOKEN)
      res.send('Hello, World!');
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
app.post('/webhook', (req, res) => {
    // Log the incoming payload for debugging
    console.log('Incoming payload:', JSON.stringify(req.body, null, 2));

    // Ensure that the request body is not empty
    if (!req.body || !req.body.entry || !Array.isArray(req.body.entry)) {
        res.status(400).send('Invalid payload');
        return;
    }

    // Process each entry in the payload
    req.body.entry.forEach(entry => {
        // Check if the entry has a messaging property
        if (entry.messaging) {
            // Iterate over each messaging event
            entry.messaging.forEach(event => {
                // Extract sender ID
                const senderId = event.sender.id;

                // Log sender ID for debugging
                console.log('Sender ID:', senderId);

                // Mark the message as seen and toggle typing indicator
                messagingClient.markSeen(senderId)
                    .then(() => messagingClient.toggleTyping(senderId, true))
                    .catch(err => console.log(err));

                // Send a message
                messagingClient.sendTextMessage(senderId, 'Hello')
                    .then(result => console.log(`Result sent with: ${result}`))
                    .catch(err => console.log(err));
            });
        }
    });

    res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});