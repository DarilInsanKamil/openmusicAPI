require('dotenv').config();
const ExportPlaylistService = require("./ExportPlaylistService");
const MailSender = require("./MailSender");
const Listener = require('./Listener')
const amqp = require('amqplib');

const init = async () => {
    const exportPlaylist = new ExportPlaylistService();
    const mailsender = new MailSender();
    const listener = new Listener(exportPlaylist, mailsender)

    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();

    await channel.assertQueue('export:playlist', {
        durable: true
    })

    channel.consume('export:playlist', listener.listen, {noAck: true})
    console.log('Consumer berjalan dan siap menerima pesan')
}

init();