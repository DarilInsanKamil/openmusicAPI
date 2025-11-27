const { Pool } = require("pg");

class ExportPlaylistService {
    constructor() {
        this._pool = new Pool();
    }

    async getSongByPlaylistId(playlistId) {
        const query = {
            text: `SELECT s.id, s.title, s.performer FROM songs s
      LEFT JOIN playlist_songs ps ON s.id = ps.song_id
      WHERE ps.playlist_id = $1`,
            values: [playlistId],
        };
        const result = await this._pool.query(query)
        return result.rows;
    }
}

module.exports = ExportPlaylistService;