const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const { Client } = require('whatsapp-web.js');
const QRCode = require('qrcode');

const app = express();
const server = createServer(app);
const io = new Server(server);
const client = new Client();

app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected');
});

client.on('qr', async (qr) => {
    io.emit('qr-code', await QRCode.toDataURL(qr));
});

client.on('authenticated', (session) => {
    io.emit('authenticated', true);
});

client.initialize();

app.post('/send-message', (req, res) => {
    const { to, message } = req.body;

    let chatId = '';
    if (to[0] == 0)
        chatId = to.substring(1);

    if (to[0] == '+' || to.substring(0, 2) == '62')
        chatId = to.substring(3);

    chatId = `${chatId}@c.us`;


    client.sendMessage(to, message);

    return res.status(200).send({
        'success': true,
        'message': 'Success'
    });
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});