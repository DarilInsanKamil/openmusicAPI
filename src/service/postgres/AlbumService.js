const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const NotFounderror = require("../../execption/NotFoundError");
const InvariantError = require("../../execption/InvariantError");
const { mapAlbumDBToModel } = require("../../utlis");

class AlbumService {
    constructor() {
        this._pool = new Pool();
    }

    async getAlbums() {
        const result = await this._pool.query('select * from albums');
        return result.rows.map(mapAlbumDBToModel);
    }

    async getAlbumById(id) {
        const query = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id]
        }
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFounderror('Album tidak ditemukan');
        }
        return result.rows.map(mapAlbumDBToModel)[0];
    }

    async addAlbums({ name, year }) {
        const id = 'album' + '-' + nanoid(16);
        const created_at = new Date().toISOString();
        const updated_at = created_at;

        const query = {
            text: 'INSERT INTO albums VALUES ($1, $2, $3, $4, $5) RETURNING id',
            values: [id, name, year, created_at, updated_at]
        }

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Album gagal ditambahkan');
        }

        return result.rows[0].id;
    }
    async deleteAlbumById(id) {
        const query = {
            text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
            values: [id]
        }
        const result = await this._pool.query(query)
        if (!result.rows.length) {
            throw new NotFounderror('Album gagal dihapus. Id tidak ditemukan');
        }
    }
    async editAlbumById(id, { name, year }) {
        const updated_at = new Date().toISOString()
        const query = {
            text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
            values: [name, year, updated_at, id]
        }

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFounderror('Gagal memperbarui album. Id tidak ditemukan');
        }
        return result.rows[0].id;
    }
    async getSongsByAlbumId(albumId) {
        const query = {
            text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
            values: [albumId],
        };
        const result = await this._pool.query(query);
        return result.rows;
    }

    async addCoverAlbumById(albumId, cover_url) {
        await this.getAlbumById(albumId)
        const query = {
            text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
            values: [cover_url, albumId]
        }

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFounderror('Gagal memperbarui cover album. Id tidak ditemukan');
        }
    }
    async checLikeExist(album_id, user_id) {
        const query = {
            text: 'SELECT user_id, album_id FROM user_album_like WHERE user_id = $1 AND album_id = $2',
            values: [user_id, album_id]
        }
        const result = await this._pool.query(query)
        if (result.rows.length) {
            throw new InvariantError('Anda sudah menyukai album ini');
        }
    }
    async addLikeAlbum(userId, albumId) {
        await this.getAlbumById(albumId);
        await this.checLikeExist(albumId, userId);

        const id = `like-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO user_album_like (id, user_id, album_id) VALUES ($1, $2, $3) RETURNING id',
            values: [id, userId, albumId],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Gagal Memberi Like')
        }
    }

    async getLikeAlbum(albumId) {
        const query = {
            text: 'SELECT COUNT(*) FROM user_album_like WHERE album_id = $1',
            values: [albumId],
        };
        const result = await this._pool.query(query);
        const likes = Number(result.rows[0].count);
        return {
            likes,
        };
    }

    async deleteLikeAlbum(userId, albumId) {
        const query = {
            text: 'DELETE FROM user_album_like WHERE user_id = $1 AND album_id = $2 RETURNING id',
            values: [userId, albumId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFounderror('Gagal membatalkan like. Like tidak ditemukan');
        }
    }
}

module.exports = AlbumService;