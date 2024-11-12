const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, Browsers } = require('@whiskeysockets/baileys');
const fs = require('fs');
const { File } = require('megajs');
const qrcode = require('qrcode-terminal');
const P = require('pino');
const config = require('../config');
const { getBuffer } = require('./functions');
const { handleMessage } = require('./msgs');

(!fs.existsSync(__dirname + '/auth_info_bailieys/creds.json')) {
    if (!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!')
    const sessdata = config.SESSION_ID
    const filer = File.fromURL(`https://mega.nz/file/${sessdata}`)
    filer.download((err, data) => {
        if (err) throw err
        fs.writeFile(__dirname + '/auth_info_baileys/creds.json', data, () => {
            console.log("Session downloaded 🇱🇰✅")
        })
    })
} function downloadSession() 
async function connectToWA() {
    await downloadSession();

    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/../auth_info/');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,  // QR code එක print කිරීම අවශ්‍ය නැති නම්
        browser: Browsers.macOS("Firefox"),
        syncFullHistory: true,
        auth: state,
        version
    });

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) connectToWA();
        } else if (connection === 'open') {
            console.log('Bot connected to WhatsApp successfully! 🎉');

            // Successfully connected message with image
            const message = 'Successfully connected WhatsApp bot!';
            const imageUrl = 'https://telegra.ph/file/900435c6d3157c98c3c88.jpg'; // මෙහි ඔබට අවශ්‍ය Image URL එක ලබා දෙන්න
            const buffer = await getBuffer(imageUrl);

            await sock.sendMessage(config.ownerNumber[0] + '@s.whatsapp.net', {
                image: buffer,
                caption: message
            });
        }
    });

    sock.ev.on('messages.upsert', async (msg) => handleMessage(sock, msg));
}

connectToWA();