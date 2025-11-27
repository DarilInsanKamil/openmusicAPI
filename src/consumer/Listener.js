class Listener {
    constructor(exportPlaylistService, mailsender) {
        this._exportPlaylistService = exportPlaylistService
        this._mailsender = mailsender;

        this.listen = this.listen.bind(this);
    }

    async listen(message) {
        try {
            const { playlistId, targetEmail } = JSON.parse(message.content.toString());

            const songs = await this._exportPlaylistService.getSongByPlaylistId(playlistId);
            const result = await this._mailsender.sendEmail(targetEmail, JSON.stringify(songs));

            console.log(`[Consumer] Email terkirim ke ${targetEmail}`);
            console.log(result);
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = Listener;