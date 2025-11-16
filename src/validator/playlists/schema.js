const Joi = require("joi");

const PlaylistPayloadSchema = Joi.object({
    name: Joi.string().required(),
})

const AddSongPlaylistPayloadSchema = Joi.object({
    songId: Joi.string().required()
})

const DeleteSongFromPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { PlaylistPayloadSchema, AddSongPlaylistPayloadSchema, DeleteSongFromPlaylistPayloadSchema };
