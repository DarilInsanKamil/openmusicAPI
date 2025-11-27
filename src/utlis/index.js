/* eslint-disable indent */
/* eslint-disable camelcase */
const mapAlbumDBToModel = ({
    id,
    name,
    year,
    cover: coverUrl
}) => ({
    id,
    name,
    year,
    coverUrl,
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