class ExportsHandler {
    constructor({ service, validator, playlistsService }) {
        this._service = service;
        this._validator = validator;
        this._playlistService = playlistsService;
        this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
    }

    async postExportPlaylistHandler(request, h) {
        try {
            const { id: playlistId } = request.params;
            const { id: credentialId } = request.auth.credentials;

            this._validator.validateExportPlaylistPayload(request.payload);
            await this._playlistService.getPlaylistDetailById(playlistId, credentialId);

            const message = {
                userId: request.auth.credentials.id,
                targetEmail: request.payload.targetEmail,
            }

            await this._service.sendMessage('export:playlist', JSON.stringify(message));

            const response = h.response({
                status: 'success',
                message: 'Permintaan anda dalam antrian',
            })

            response.code(201)
            return response;
        }
        catch (err) {
            console.log('error cuy', err);
            throw err;
        }
    }
}
module.exports = ExportsHandler;