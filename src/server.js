require('dotenv').config();
const SongService = require("./service/postgres/SongService");
const Hapi = require('@hapi/hapi');
const songs = require('./api/songs')
const albums = require('./api/albums')
const SongValidator = require("./validator/song");
const AlbumService = require("./service/postgres/AlbumService");
const AlbumValidator = require("./validator/album");
const ClientError = require("./execption/ClientError");

const users = require('./api/users');
const UsersService = require('./service/postgres/UserService');
const UsersValidator = require('./validator/users');

const authentications = require('./api/authentications')
const AuthenticationsService = require('./service/postgres/AuthenticationService');
const AuthenticationsValidator = require('./validator/authentications')

const init = async () => {
    const songService = new SongService();
    const albumService = new AlbumService();
    const userService = new UsersService();
    const authenticationsService = new AuthenticationsService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*']
            }
        }
    })

    await server.register([
        {
            plugin: songs,
            options: {
                service: songService,
                validator: SongValidator
            }
        },
        {
            plugin: albums,
            options: {
                service: albumService,
                validator: AlbumValidator
            }
        },
        {
            plugin: users,
            options: {
                service: userService,
                validator: UsersValidator
            }
        },
        {
            plugin: authentications,
            options: {
                service: authenticationsService,
                validator: AuthenticationsValidator
            }
        },
    ])

    server.ext('onPreResponse', (request, h) => {
        const { response } = request;

        if (response instanceof Error) {

            if (response instanceof ClientError) {
                const newResponse = h.response({
                    status: 'fail',
                    message: response.message,
                });
                newResponse.code(response.statusCode);
                return newResponse;
            }

            if (!response.isServer) {
                return h.continue;
            }

            const newResponse = h.response({
                status: 'error',
                message: 'terjadi kegagalan pada server kami',
            });
            newResponse.code(500);
            return newResponse;
        }

        return h.continue;
    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`)
}

init();