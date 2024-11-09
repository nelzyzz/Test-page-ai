const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { handleMessage } = require('./handlers/handleMessage');
const { handlePostback } = require('./handlers/handlePostback');
const loadCommands = require('./loadCommands');

const app = express();
app.use(express.json());

const VERIFY_TOKEN = 'pagebot';

// Read and validate PAGE_ACCESS_TOKEN
let PAGE_ACCESS_TOKEN;
try {
    PAGE_ACCESS_TOKEN = fs.readFileSync('token.txt', 'utf8').trim();
    if (!PAGE_ACCESS_TOKEN) {
        throw new Error("Token is empty. Please provide a valid token in 'token.txt'.");
    }
} catch (error) {
    console.error(`Error reading token.txt: ${error.message}`);
    process.exit(1); // Exit if token is missing or empty
}

// Webhook verification
app.get('/webhook', (req, res) => {
    const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query;
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        return res.status(200).send(challenge);
    }
    res.sendStatus(403);
});

// Send typing indicator
const sendTypingIndicator = async (recipientId) => {
    try {
        await axios.post(
            `https://graph.facebook.com/v11.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
            {
                recipient: { id: recipientId },
                sender_action: "typing_on",
            },
            { headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error sending typing indicator:", error.message);
    }
};

// Webhook event handling
app.post('/webhook', (req, res) => {
    const { body } = req;

    if (body.object === 'page') {
        body.entry?.forEach(entry => {
            entry.messaging?.forEach(async event => {
                if (event.message) {
                    await sendTypingIndicator(event.sender.id); // Send typing indicator
                    handleMessage(event, PAGE_ACCESS_TOKEN);
                } else if (event.postback) {
                    handlePostback(event, PAGE_ACCESS_TOKEN);
                }
            });
        });

        return res.status(200).send('EVENT_RECEIVED');
    }

    res.sendStatus(404);
});

// Server initialization
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await loadCommands();
});
