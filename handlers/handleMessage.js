// handlers/handleMessage.js
const fs = require('fs');
const path = require('path');

const COMMANDS_PATH = path.join(__dirname, '../commands');

function handleMessage(event, PAGE_ACCESS_TOKEN) {
    const messageText = event.message?.text?.toLowerCase();
    if (!messageText) return;

    const [commandName, ...args] = messageText.split(" ");
    const commands = fs.readdirSync(COMMANDS_PATH)
        .map(file => require(path.join(COMMANDS_PATH, file)))
        .filter(command => command.config.name === commandName || command.config.aliases.includes(commandName));

    if (commands.length > 0) {
        const command = commands[0];
        command.onCall({ message: event.message, args });
    } else {
        console.log(`Command ${commandName} not found.`);
    }
}

module.exports = handleMessage;
