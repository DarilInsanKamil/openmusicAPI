class AlbumHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.getAllAlbumHandler = this.getAllAlbumHandler.bind(this);
        this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
        this.postAlbumHandler = this.postAlbumHandler.bind(this);
        this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
        this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    }

    async getAllAlbumHandler(request, h) {
        const albums = await this._service.getAlbums()

        const response = h.response({
            status: 'succes',
            data: {
                albums
            }
        })
        response.code(200);
        return response;
    }

    async getAlbumByIdHandler(request, h) {


        const { id: albumId } = request.params;
        const album = await this._service.getAlbumById(albumId);
        const songs = await this._service.getSongsByAlbumId(albumId);
        const response = h.response({
            status: 'success',
            // message: 'Mendapatkan album berdasarkan id.',
            data: {
                album: {
                    ...album,
                    songs,
                }
            }
        })
        response.code(200);
        return response;

    }
    async deleteAlbumByIdHandler(request, h) {
        const albumId = request.params;

        await this._service.deleteAlbumById(albumId.id);
        return {
            status: 'success',
            message: 'Menghapus album berdasarkan id.',
        }
    }
    async putAlbumByIdHandler(request, h) {
        this._validator.validateAlbumPayload(request.payload);
        const { name, year } = request.payload;
        const { id: albumId } = request.params;
        await this._service.editAlbumById(albumId, { name, year });
        const response = h.response({
            status: 'success',
            message: 'Mengubah album berdasarkan id album.'
        })
        response.code(200);
        return response;
    }
    async postAlbumHandler(request, h) {
        this._validator.validateAlbumPayload(request.payload);
        const { name, year } = request.payload
        const albumId = await this._service.addAlbums({ name, year });
        const response = h.response({
            status: 'success',
            message: 'Menambahkan album',
            data: {
                albumId
            }
        })
        response.code(201);
        return response;
    }
}

module.exports = AlbumHandler