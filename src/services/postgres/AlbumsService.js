const { nanoid } = require('nanoid');
const Pool = require('../../config/db');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this._pool = Pool;
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const { rows } = await this._pool.query(query);

    if (!rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return rows[0].id;
  }

  async getAlbums() {
    const { rows } = await this._pool.query(
      'SELECT * FROM albums',
    );
    return rows;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const querySongs = {
      text: `SELECT 
        title, year, performer, genre, duration
        FROM songs WHERE "albumId" = $1`,
      values: [id],
    };

    const { rows: albumsRows, rowCount: albumsRowCount } = await this._pool.query(query);

    const { rows: songsRows } = await this._pool.query(querySongs);

    if (!albumsRowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    const response = {
      ...albumsRows[0],
      songs: songsRows,
    };

    return response;
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;
