/* eslint-disable indent */
/* eslint-disable camelcase */
const mapAlbumDBToModel = ({
    id,
    name,
    year,
}) => ({
    id,
    name,
    year,
});

const mapSongsDBToModel = ({
    id,
    title,
    performer
}) => ({
    id,
    title,
    performer
});

module.exports = { mapAlbumDBToModel, mapSongsDBToModel };