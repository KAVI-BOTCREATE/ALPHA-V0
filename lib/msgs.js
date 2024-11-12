const config = require('../config');
const { getContentType } = require('@whiskeysockets/baileys');
const pingCommand = require('./commands/ping');

const commands = {
    ping: pingCommand
};

async function handleMessage(sock, msg) {
    const message = msg.messages[0];
    if (!message.message) return;
    
    const type = getContentType(message.message);
    const from = message.key.remoteJid;
    const isCmd = message.message.conversation?.startsWith(config.prefix);
    const command = isCmd ? message.message.conversation.slice(config.prefix.length).trim().split(' ')[0] : null;

    if (isCmd && command && commands[command]) {
        commands[command](sock, from);
    }
}

module.exports = { handleMessage };