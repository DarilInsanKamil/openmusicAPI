const InvariantError = require("../../execption/InvariantError");
const NotFounderror = require("../../execption/NotFoundError");

class PlaylistHandler {
    constructor(service, validator, songsService) {
        this._service = service;
        this._validator = validator;
        this._songsService = songsService

        this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
        this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
        this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
        this.postSongToPlaylistById = this.postSongToPlaylistById.bind(this);
        this.getSongToPlaylistById = this.getSongToPlaylistById.bind(this);
        this.deleteSongByPlaylistIdHandler = this.deleteSongByPlaylistIdHandler.bind(this);

    }

    async postPlaylistHandler(request, h) {
        this._validator.validatePlaylistPayload(request.payload);
        const { name } = request.payload
        const { id: credentialId } = request.auth.credentials;
        const playlist = await this._service.addPlaylist({ name, owner: credentialId })
        const response = h.response({
            status: 'success',
            message: 'playlist berhasil ditambahkan',
            data: {
                playlistId: playlist
            }
        })
        response.code(201)
        return response
    }

    async getPlaylistHandler(request, h) {
        const { id: credentialId } = request.auth.credentials;
        const playlist = await this._service.getAllPlaylist(credentialId)
        const response = h.response({
            status: 'success',
            data: {
                playlists: playlist
            }
        })
        response.code(200)
        return response
    }

    async getSongToPlaylistById(request, h) {
        try {
            const { id: credentialId } = request.auth.credentials;
            const { id: playlistId } = request.params;

            const playlistDetails = await this._service.getPlaylistDetailById(playlistId, credentialId);
            const songs = await this._service.getSongByPlaylistId(playlistId);

            const playlist = {
                ...playlistDetails,
                songs
            }

            const response = h.response({
                status: 'success',
                data: {
                    playlist
                }
            })
            response.code(200)
            return response;
        } catch (err) {
            console.log('error cuy', err)
            throw err;
        }
    }

    async deletePlaylistByIdHandler(request, h) {
        try {
            const { id: credentialId } = request.auth.credentials;
            const { id: playlistId } = request.params;

            await this._service.verifyPlaylistOwner(playlistId, credentialId);
            await this._service.deletePlaylstById({playlistId, owner: credentialId});

            return {
                status: 'success',
                message: 'Menghapus playlist berdasarkan id.',
            }
        } catch (err) {
            console.log(err)
            throw err;
        }
    }
    async postSongToPlaylistById(request, h) {
        try {
            this._validator.validateAddSongPlaylistPayload(request.payload);

            const { songId } = request.payload;
            const { id: playlistId } = request.params;
            const { id: credentialId } = request.auth.credentials;

            await this._songsService.getSongById(songId);
            await this._service.verifyPlaylistOwner(playlistId, credentialId);
            const playlistSongId = await this._service.addSongByPlaylistId({ playlistId, songId });
            const response = h.response({
                status: 'success',
                message: 'Lagu berhasil ditambahkan ke playlist',
                data: {
                    playlistSongId,
                },
            });
            response.code(201);
            return response;
        } catch (err) {
            console.log(err)
            throw err;
        }
    }
    async deleteSongByPlaylistIdHandler(request, h) {
        try {
            this._validator.validateDeleteSongFromPlaylistPayload(request.payload);
            const { songId } = request.payload;
            const { id: playlistId } = request.params;
            const { id: credentialId } = request.auth.credentials;


            await this._service.verifyPlaylistOwner(playlistId, credentialId);
            await this._service.deleteSongFromPlaylist(playlistId, songId);

            return {
                status: 'success',
                message: 'Lagu berhasil dihapus dari playlist'
            }
        } catch (err) {
            console.log(err)
            throw err;
        }

    }
}

module.exports = PlaylistHandler;