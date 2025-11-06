const { nanoid } = require('nanoid')
const { Pool } = require('pg')

class PlaylistsService {
    constructor() {
        this._pool = new Pool()
    }


    async addPlaylist({ name }) {
        const id = 'playlist' + '-' + nanoid(16);
        
        const query = {
            text: 'INSERT INTO playlists VALUES ($1, $2)',
            values: [id, name]
        }

        const result = await this._pool.query(query)
    }
    async getPlaylistById(playlistId) {

    }
    async deletePlaylstById(playlistId) {

    }
    async getSongByPlaylistId(playlistId) {

    }
    async addSongByPlaylistId(playlistId) {

    }
    async deleteSongByPlaylistId(playlistId) {

    }
}