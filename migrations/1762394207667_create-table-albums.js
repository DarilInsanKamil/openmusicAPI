exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("albums", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    name: {
      type: "VARCHAR(50)",
      unique: true,
      notNull: true,
    },
    year: {
      type: "INT",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("albums");
};
