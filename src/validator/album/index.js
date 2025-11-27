const InvariantError = require("../../execption/InvariantError");
const { AlbumPayloadSchema, AlbumCoverPayloadSchema } = require("./schema")

const AlbumValidator = {
    validateAlbumPayload: (payload) => {
        const validationResult = AlbumPayloadSchema.validate(payload)
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    },
    validateAlbumCoverPayload: (headers) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        if (!allowedMimeTypes.includes(contentType)) {
            throw new InvariantError(`Tipe file tidak didukung. Gunakan format: ${allowedMimeTypes.join(', ')}`);
        }
    }
}

module.exports = AlbumValidator;