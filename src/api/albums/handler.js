const InvariantError = require('../../execption/InvariantError');

class AlbumHandler {
    constructor(service, validator, storageService) {
        this._service = service;
        this._validator = validator;
        this._storageService = storageService;

        this.getAllAlbumHandler = this.getAllAlbumHandler.bind(this);
        this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
        this.postAlbumHandler = this.postAlbumHandler.bind(this);
        this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
        this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
        this.postCoverAlbumHandler = this.postCoverAlbumHandler.bind(this);
        this.deleteLikeAlbumHandler = this.deleteLikeAlbumHandler.bind(this);
        this.postLikeAlbumHandler = this.postLikeAlbumHandler.bind(this);
        this.getLikeAlbumHandler = this.getLikeAlbumHandler.bind(this);
    }

    async getAllAlbumHandler(request, h) {
        try {
            const albums = await this._service.getAlbums()

            const response = h.response({
                status: 'succes',
                data: {
                    albums
                }
            })
            response.code(200);
            return response;
        } catch (err) {
            console.log(err)
            throw err;
        }
    }

    async getAlbumByIdHandler(request, h) {
        try {
            const { id: albumId } = request.params;
            const album = await this._service.getAlbumById(albumId);
            const songs = await this._service.getSongsByAlbumId(albumId);
            const response = h.response({
                status: 'success',
                data: {
                    album: {
                        ...album,
                        songs,
                    }
                }
            })
            response.code(200);
            return response;
        } catch (err) {
            console.log(err)
            throw err;
        }

    }
    async deleteAlbumByIdHandler(request, h) {
        try {
            const albumId = request.params;

            await this._service.deleteAlbumById(albumId.id);
            return {
                status: 'success',
                message: 'Menghapus album berdasarkan id.',
            }
        } catch (err) {
            console.log(err)
            throw err
        }
    }
    async putAlbumByIdHandler(request, h) {
        try {
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
        } catch (err) {
            console.log(err)
            throw err;
        }
    }
    async postAlbumHandler(request, h) {
        try {
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
        } catch (err) {
            console.log(err)
            throw err
        }
    }
    async postCoverAlbumHandler(request, h) {
        try {
            const { cover } = request.payload;

            if (!cover) {
                throw new InvariantError('Cover file is required');
            }

            this._validator.validateAlbumCoverPayload(cover.hapi.headers);
            const filename = await this._storageService.writeFile(cover, cover.hapi);
            const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
            const { id: albumId } = request.params;
            await this._service.addCoverAlbumById(albumId, fileLocation);
            const response = h.response({
                status: 'success',
                message: 'Cover berhasil di upload'
            })
            response.code(201);
            return response;
        } catch (err) {
            console.log('error cuy: ', err)
            throw err;
        }
    }

    async getLikeAlbumHandler(request, h) {
        try {
            const { id } = request.params;
            const { likes } = await this._service.getLikeAlbum(id);
            const response = h.response({
                status: 'success',
                message: 'Berhasil mengambil jumlah like',
                data: {
                    likes
                }
            })
            response.code(200)
            return response
        } catch (err) {
            console.log(err)
            throw err;
        }
    }
    async postLikeAlbumHandler(request, h) {
        try {
            const { id: userId } = request.auth.credentials;
            const { id: albumId } = request.params;

            await this._service.addLikeAlbum(userId, albumId);
            const response = h.response({
                status: 'success',
                message: 'Berhasil memberikan like'
            })
            response.code(201)
            return response
        } catch (err) {
            console.log('error: ', err);
            throw err
        }
    }
    async deleteLikeAlbumHandler(request, h) {
        const { id: userId } = request.auth.credentials
        const { id: albumId } = request.params;

        await this._service.deleteLikeAlbum(userId, albumId);

        const response = h.response({
            status: 'success',
            message: 'Berhasil hapus like'
        })
        response.code(200)
        return response
    }
}

module.exports = AlbumHandler