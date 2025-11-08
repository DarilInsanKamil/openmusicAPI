const InvariantError = require("../../execption/InvariantError");

class PlaylistHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
        this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
        this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    }

    async postPlaylistHandler(request, h) {
        try {
            const { name } = request.payload
            console.log("ini nama :", name);
            this._validator.validatePlaylistPayload(request.payload);
            const playlist = await this._service.addPlaylist(name, 'agil')
            const response = h.response({
                status: 'success',
                message: 'playlist berhasil ditambahkan',   
                data: {
                    playlist
                }
            })
            response.code(201)
            return response
        } catch (err) {
            console.log(err)
            throw new InvariantError('error coy: ', err)
        }
    }

    async getPlaylistHandler(request, h) {
        const playlist = await this._service.getAllPlaylist()
        const response = h.response({
            status: 'success',
            data: {
                playlist
            }
        })
        response.code(200)
        return response
    }

    async deletePlaylistByIdHandler(request, h) {
        const { id: playlistId } = request.params;

        await this._service.deletePlaylstById(playlistId)
        const response = h.response({
            status: 'success',
            message: 'Menghapus album berdasarkan id.',
        })
        response.code(200)
        return response;
    }
}

module.exports = PlaylistHandler;