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
        const created_at = new Date().toISOString();
        const updated_at = created_at;
        const query = {
            text: 'INSERT INTO playlists (id, name, owner, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            values: [id, name, owner, created_at, updated_at]
        }
        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new InvariantError('Playlist gagal ditambahkan')
        }

        return result.rows[0].id;
    }

    async getAllPlaylist(owner) {
        const query = {
            text: `SELECT p.id, p.name, u.username 
                   FROM playlists p
                   LEFT JOIN users u ON u.id = p.owner
                   WHERE p.owner = $1`,
            values: [owner],
        };
        const result = await this._pool.query(query);
        return result.rows;
    }

    async deletePlaylstById({ playlistId, owner }) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 AND owner = $2 RETURNING id',
            values: [playlistId, owner]
        }
        const result = await this._pool.query(query)
        if (!result.rows.length) {
            throw new NotFounderror('id playlist tidak ditemukan')
        }
    }

    async verifyPlaylistOwner(playlistId, credentialId) {
        console.log('Cek Owner -> Playlist:', playlistId, 'User:', credentialId);
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [playlistId],
        };
        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new NotFounderror('Playlist tidak ditemukan');
        }

        const playlist = result.rows[0];
        if (playlist.owner !== credentialId) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }


    }
    async getSongByPlaylistId(playlistId) {
        const query = {
            text: `SELECT s.id, s.title,s.performer
            FROM songs s LEFT JOIN playlist_songs ps ON s.id = ps.song_id
            WHERE ps.playlist_id = $1`,
            values: [playlistId]
        }
        const result = await this._pool.query(query)
        return result.rows;
    }

    async getPlaylistDetailById(playlistId, owner) {
        
        await this.verifyPlaylistOwner(playlistId, owner);

        const query = {
            text: `SELECT p.id, p.name, p.owner, u.username
                 FROM playlists p
                 LEFT JOIN users u ON p.owner = u.id
                 WHERE p.id = $1`,
            values: [playlistId],
        };

        const result = await this._pool.query(query);


        if (!result.rows.length) {
            throw new NotFounderror('Playlist tidak ditemukan');
        }

        const playlist = result.rows[0];

        return {
            id: playlist.id,
            name: playlist.name,
            username: playlist.username,
        };
    }
    async addSongByPlaylistId({ playlistId, songId }) {
        const id = `playlist-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId]
        }
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Lagu gagal ditambahkan ke playlist');
        }
        return result.rows[0].id;
    }

    async deleteSongFromPlaylist(playlistId, songId) {
        const query = {
            text: `DELETE FROM playlist_songs 
             WHERE playlist_id = $1 AND song_id = $2 
             RETURNING id`,
            values: [playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Lagu gagal dihapus dari playlist. Lagu tidak ditemukan');
        }
    }
}

module.exports = PlaylistsService;