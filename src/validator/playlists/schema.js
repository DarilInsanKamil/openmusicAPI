const Joi = require("joi");

const PlaylistPayloadSchema = Joi.object({
    name: Joi.string().required(),
    owner: Joi.string().required(),
    created_at: Joi.string().optional(),
    updated_at: Joi.string().optional()
})

module.exports = { PlaylistPayloadSchema };
