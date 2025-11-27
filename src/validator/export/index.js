const InvariantError = require('../../execption/InvariantError');
const { ExportPlaylistSchema } = require('./schema');

const ExportPlaylistValidator = {
    validateExportPlaylistPayload: (payload) => {
        const validationResult = ExportPlaylistSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = ExportPlaylistValidator;



