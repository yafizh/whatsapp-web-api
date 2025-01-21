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

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected');

    client.on('qr', async (qr) => {
        io.emit('qr-code', await QRCode.toDataURL(qr));
    });
});

client.initialize();

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});