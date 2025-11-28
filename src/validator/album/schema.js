const Joi = require("joi");

const AlbumPayloadSchema = Joi.object({
    name: Joi.string().required(),
    year: Joi.number().required()
})

const AlbumCoverPayloadSchema = Joi.object({
    'content-type': Joi.string().valid(
        'image/apng',
        'image/avif',
        'image/gif',
        'image/jpeg',
        'image/png',
        'image/webp'
    ).required(),
}).unknown();

const AlbumLikePayloadSchema = Joi.object({
    user_id: Joi.string().required(),
    album_id: Joi.string().required(),
})

module.exports = { AlbumPayloadSchema, AlbumCoverPayloadSchema, AlbumLikePayloadSchema };