class SongHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.getAllSongHandler = this.getAllSongHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
        this.postSongHandler = this.postSongHandler.bind(this);
    }

    async getAllSongHandler(request, h) {

        const {title, performer} = request.query;

        const songs = await this._service.getAllSongs(title, performer);
        const response = h.response({
            status: 'success',
            data: {
                songs
            }
        })
        response.code(200);
        return response;
    }

    async getSongByIdHandler(request, h) {
        const { id: songId } = request.params;
        const song = await this._service.getSongById(songId);

        const response = h.response({
            status: 'success',
            data: {
                song
            }
        })
        response.code(200);
        return response;
    }

    async putSongByIdHandler(request, h) {
        this._validator.validateSongPayload(request.payload);
        const { id: songId } = request.params;
        await this._service.editSongById(songId, request.payload);
        const response = h.response({
            status: 'success',
            message: 'Mengubah lagu berdasarkan id lagu'
        })
        response.code(200);
        return response;
    }

    async deleteSongByIdHandler(request, h) {
        const { id: songId } = request.params;
        await this._service.deleteSongById(songId)

        const response = h.response({
            status: 'success',
            message: 'Menghapus lagu berdasarkan id'
        })
        response.code(200);
        return response;
    }

    async postSongHandler(request, h) {
        this._validator.validateSongPayload(request.payload);
        const { title, year, genre, performer, duration, albumId } = request.payload;
        const songId = await this._service.addSongs({ title, year, genre, performer, duration, albumId });
        const response = h.response({
            status: 'success',
            message: 'Menambahkan lagu',
            data: {
                songId
            }
        })
        response.code(201);
        return response;
    }
    // async getSongByTitle(request, h) {
    //     const { title } = request.query;

    //     const songTitle = await this._service.searchSongByTitle(title)
    //     const response = h.response({
    //         status: 'success',
    //         message: 'Menampilkan lagu',
    //         data: {
    //             songTitle
    //         }
    //     })
    //     response.code(200);
    //     return response;
    // }
}

module.exports = SongHandler;