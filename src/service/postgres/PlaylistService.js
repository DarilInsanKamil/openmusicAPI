const { nanoid } = require('nanoid')
const { Pool } = require('pg');
const InvariantError = require('../../execption/InvariantError');
const NotFounderror = require('../../execption/NotFoundError');
const AuthorizationError = require('../../execption/AuthorizationsError');

class PlaylistsService {
    constructor() {
        this._pool = new Pool()
    }

    async addPlaylist({ name, owner }) {
        const id = `playlist-${nanoid(16)}`;
        console.log(id)
        const query = {
            text: 'INSERT INTO playlists VALUES ($1, $2, $3)',
            values: [id, name, owner]
        }
        const result = await this._pool.query(query)

        if(!result.rows[0].id) {
            throw new InvariantError('Playlist gagal ditambahkan')
        }
        console.log(result.rows)
        return result.rows[0].id;
    }

    async getAllPlaylist() {
        const result = await this._pool.query('SELECT * FROM playlists');
        return result.rows;
    }

    async deletePlaylstById(playlistId) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [playlistId]
        }
        const result = await this._pool.query(query)
        if(!result.rows.length) {
            throw new NotFounderror('id playlist tidak ditemukan')
        }
        return result.rows[0];
    }
    async verifyPlaylistOwener(id, owner) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [id]
        }

        const result = await this._pool.query(query)
        if(!result.rows.length) {
            throw new NotFounderror('playlist tidak ditemukan')
        }
        const playlist = result.rows[0];

        if(playlist.owner !== owner) {
            throw new AuthorizationError('Anda tidak dapat berhak mengakses resource ini')
        }
    }
    // async getSongByPlaylistId(playlistId) {

    // }
    // async addSongByPlaylistId(playlistId) {

    // }
    // async deleteSongByPlaylistId(playlistId) {

    // }
}

module.exports = PlaylistsService;