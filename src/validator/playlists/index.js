const InvariantError = require("../../execption/InvariantError")
const { PlaylistPayloadSchema, AddSongPlaylistPayloadSchema } = require("./schema")

const PlaylistValidator = {
    validatePlaylistPayload: (payload) => {
        const validationResult = PlaylistPayloadSchema.validate(payload)
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    },
    validateAddSongPlaylistPayload: (payload) => {
        const validationResult = AddSongPlaylistPayloadSchema.validate(payload)
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    }
}

module.exports = PlaylistValidator