require('dotenv').config();
const SongService = require("./service/postgres/SongService");
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const path = require('path');
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
const TokenManager = require('./tokenize/TokenManager');

const playlists = require('./api/playlist');
const PlaylistsService = require('./service/postgres/PlaylistService')
const PlaylistsValidator = require('./validator/playlists')

const _exports = require('./api/exports');
const ProducerService = require('./service/rabbitmq/ProducerService');
const ExportPlaylistValidator = require('./validator/export');
const StorageService = require('./service/storage/StorageService');


const init = async () => {
    const songService = new SongService();
    const albumService = new AlbumService();
    const userService = new UsersService();
    const authenticationsService = new AuthenticationsService();
    const playlistService = new PlaylistsService();
    const storageService = new StorageService(path.resolve(__dirname, 'api/albums/file/images'));

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
            plugin: Jwt,
        },
    ]);

    server.auth.strategy('openmusicapp_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
    });

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
                validator: AlbumValidator,
                storageService: storageService
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
            plugin: playlists,
            options: {
                service: playlistService,
                validator: PlaylistsValidator,
                songsService: songService
            }
        },
        {
            plugin: authentications,
            options: {
                authenticationsService: authenticationsService,
                usersService: userService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator,
            }
        },
        {
            plugin: _exports,
            options: {
                service: ProducerService,
                validator: ExportPlaylistValidator,
                playlistsService: playlistService,
            }
        }
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