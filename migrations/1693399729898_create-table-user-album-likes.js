/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('user_album_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      // unique: true,
      notNull: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      // unique: true,
      notNull: true,
    },
  });

  pgm.addConstraint('user_album_likes', 'fk_userId_user_album_likes', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });
  pgm.addConstraint('user_album_likes', 'fk_albumId_user_album_likes', {
    foreignKeys: {
      columns: 'album_id',
      references: 'albums(id)',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('user_album_likes', 'fk_userId_user_album_likes');
  pgm.dropConstraint('user_album_likes', 'fk_albumId_user_album_likes');

  pgm.dropTable('user_album_likes');
};
