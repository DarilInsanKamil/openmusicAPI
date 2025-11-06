const routes = (handle) => [
    {
        method: 'POST',
        path: '/songs',
        handler: handle.postSongHandler
    },
    {
        method: 'GET',
        path: '/songs',
        handler: handle.getAllSongHandler
    },
    {
        method: 'GET',
        path: '/songs/{id}',
        handler: handle.getSongByIdHandler
    },
    {
        method: 'PUT',
        path: '/songs/{id}',
        handler: handle.putSongByIdHandler
    },
    {
        method: 'DELETE',
        path: '/songs/{id}',
        handler: handle.deleteSongByIdHandler
    },
]

module.exports = routes;