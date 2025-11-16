const { Pool } = require("pg");
const NotFounderror = require("../../execption/NotFoundError");
const InvariantError = require("../../execption/InvariantError");
const { nanoid } = require("nanoid");
const { mapSongsDBToModel } = require("../../utlis");

class SongService {
    constructor() {
        this._pool = new Pool()
    }

    async getAllSongs(title, performer) {
        const result = await this._pool.query('SELECT * FROM songs');
        if (title && performer) {
            const query = {
                text: 'SELECT * FROM songs WHERE title ILIKE $1 AND performer ILIKE $2',
                values: [`%${title}%`, `%${performer}%`],
            };
            const result = await this._pool.query(query);
            return result.rows.map(mapSongsDBToModel)
        } else if (performer) {
            const filteredSongByPerformer = result.rows.filter(song => song.performer.toLowerCase().includes(performer.toLowerCase()))
            return filteredSongByPerformer.map(mapSongsDBToModel)
            console.log(performer.map(mapSongsDBToModel))
        } else if (title) {
            const filteredSongByTitle = result.rows.filter(song => song.title.toLowerCase().includes(title.toLowerCase()))
            return filteredSongByTitle.map(mapSongsDBToModel)
        }

        return result.rows.map(mapSongsDBToModel);
    }

    async getSongById(id) {
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id]
        }

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFounderror('Id song tidak ditemukan');
        }

        return result.rows[0];
    }
    async editSongById(id, { title, year, genre, performer, duration }) {
        const updated_at = new Date().toISOString()
        const query = {
            text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
            values: [title, year, genre, performer, duration, updated_at, id]
        }
        const result = await this._pool.query(query)
        if (!result.rows.length) {
            throw new NotFounderror('Gagal memperbarui song. Id tidak ditemukan');
        }
    }
    async deleteSongById(id) {
        const query = {
            text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
            values: [id]
        }
        const result = await this._pool.query(query)
        if (!result.rows.length) {
            throw new NotFounderror('Gagal menghapus song. Id tidak ditemukan');
        }

    }
    async addSongs({ title, year, genre, performer, duration, albumId = null }) {
        const id = 'song' + '-' + nanoid(16)
        const created_at = new Date().toISOString()
        const updated_at = created_at;
        const query = {
            text: `INSERT INTO songs 
         (id, title, year, genre, performer, duration, album_id, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         RETURNING id`,
            values: [id, title, year, genre, performer, duration, albumId, created_at, updated_at]
        }
        const result = await this._pool.query(query);
        if (!result.rows[0].id) {
            throw new InvariantError('Catatan gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async searchSongByTitle(title) {
        console.log(title)
    }


}

module.exports = SongService;