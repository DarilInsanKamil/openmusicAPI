const routes = (handle) => [
    {
        method: 'POST',
        path: '/export/playlists/{playlistsId}',
        handler: handle.postExportPlaylistHandler,
        options: {
            auth: 'openmusicapp_jwt'
        }
    },
]

module.exports = routes;