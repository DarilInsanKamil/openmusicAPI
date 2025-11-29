const routes = (handle) => [
    {
        method: 'POST',
        path: '/playlists',
        handler: handle.postPlaylistHandler,
        options: {
            auth: 'openmusicapp_jwt'
        }
    },
    {
        method: 'GET',
        path: '/playlists',
        handler: handle.getPlaylistHandler,
        options: {
            auth: 'openmusicapp_jwt'
        }
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}',
        handler: handle.deletePlaylistByIdHandler,
        options: {
            auth: 'openmusicapp_jwt'
        }
    },
    {
        method: 'GET',
        path: '/playlists/{id}/songs',
        handler: handle.getSongToPlaylistById,
        options: {
            auth: 'openmusicapp_jwt'
        }
    },
    {
        method: 'POST',
        path: '/playlists/{id}/songs',
        handler: handle.postSongToPlaylistById,
        options: {
            auth: 'openmusicapp_jwt'
        }
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}/songs',
        handler: handle.deleteSongByPlaylistIdHandler,
        options: {
            auth: 'openmusicapp_jwt'
        }
    },
]

module.exports = routes;