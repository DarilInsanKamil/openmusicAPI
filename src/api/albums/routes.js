const routes = (handle) => [
    {
        method: 'POST',
        path: '/albums',
        handler: handle.postAlbumHandler
    },
    {
        method: 'GET',
        path: '/albums',
        handler: handle.getAllAlbumHandler
    },
    {
        method: 'GET',
        path: '/albums/{id}',
        handler: handle.getAlbumByIdHandler
    },
    {
        method: 'PUT',
        path: '/albums/{id}',
        handler: handle.putAlbumByIdHandler
    },
    {
        method: 'DELETE',
        path: '/albums/{id}',
        handler: handle.deleteAlbumByIdHandler
    },
]

module.exports = routes;