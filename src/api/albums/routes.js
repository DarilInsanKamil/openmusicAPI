const path = require('path');


const routes = (handle) => [
    {
        method: 'POST',
        path: '/albums',
        handler: handle.postAlbumHandler
    },
    {
        method: 'POST',
        path: '/albums/{id}/covers',
        handler: handle.postCoverAlbumHandler,
        options: {
            payload: {
                // allow: 'multipart/form-data',
                multipart: true,
                output: 'stream',
                maxBytes: 512000
            },
        },
    },
    {
        method: 'GET',
        path: '/upload/images/{param*}',
        handler: {
            directory: {
                path: path.resolve(__dirname, './file/images/'),
                redirectToSlash: true,
            },
        },
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
    {
        method: 'DELETE',
        path: '/albums/{id}/likes',
        handler: handle.deleteLikeAlbumHandler,
        options: {
            auth: 'openmusicapp_jwt',
        },
    },
    {
        method: 'POST',
        path: '/albums/{id}/likes',
        handler: handle.postLikeAlbumHandler,
        options: {
            auth: 'openmusicapp_jwt',
        },
    },
    {
        method: 'GET',
        path: '/albums/{id}/likes',
        handler: handle.getLikeAlbumHandler,
    },
]

module.exports = routes;


