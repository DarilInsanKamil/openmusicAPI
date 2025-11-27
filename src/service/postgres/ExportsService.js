const { Pool } = require("pg")

class ExportsService {
    constructor() {
        this._pool = new Pool()
    }


    async exportPlaylist(playlistId, targetEmail) {
        const query = {
            text: '',
            values: [playlistId, targetEmail]
        }

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('')
        }
    }
}

module.exports = ExportsService