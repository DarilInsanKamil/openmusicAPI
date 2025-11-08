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
        handler: handle.getPlaylistHandler
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}',
        handler: handle.deletePlaylistByIdHandler,
        options: {
            auth: 'openmusicapp_jwt'
        }
    },
    // {
    //     method: 'GET',
    //     path: '/playlists/{id}/songs',
    //     handler: handle.getPlaylistByIdHandler
    // },

    // {
    //     method: 'POST',
    //     path: '/playlists/{id}/songs',
    //     handler: handle.postSongInPlaylistByIdHandler
    // },
    // {
    //     method: 'GET',
    //     path: '/playlists/{id}/songs',
    //     handler: handle.getSongInPlaylistByIdHandler
    // },
    // {
    //     method: 'DELETE',
    //     path: '/playlists/{id}/songs',
    //     handler: handle.SongInPlaylistByIdHandler
    // },

]

module.exports = routes;