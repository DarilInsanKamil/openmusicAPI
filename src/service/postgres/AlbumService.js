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

        const result = await this._pool.query(query)

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
        console.log(albumId)
        const query = {
            text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
            values: [albumId],
        };
        const result = await this._pool.query(query);
        console.log(result.rows)
        return result.rows;
    }
}

module.exports = AlbumService;