// loadCommands.js
const fs = require('fs');
const path = require('path');

const COMMANDS_PATH = path.join(__dirname, 'commands');

function loadCommands() {
    const commands = [];
    fs.readdirSync(COMMANDS_PATH)
        .filter(file => file.endsWith('.js'))
        .forEach(file => {
            const command = require(path.join(COMMANDS_PATH, file));
            if (command?.config?.name) {
                commands.push(command.config);
            }
        });
    return commands;
}

module.exports = loadCommands;
