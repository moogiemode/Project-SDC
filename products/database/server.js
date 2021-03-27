const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: '172.31.25.199',
  database: 'products',
  password: 'password',
  port: 5432,
})

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client :', err);
  process.exit(-1);
});

const basicQuery = (queryString, callback) => {
  console.log(queryString)
  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack);
    }
    client.query(queryString, (err, result) => {
      release();
      if (err) {
        return console.error('Error executing query', err.stack);
      }
      callback(null, result.rows);
    });
  });
}

const getSelectedProduct = (productID, callback) => {
  const queryString = `SELECT * FROM products WHERE id = ${productID}`;
  basicQuery(queryString, callback);
}

const getProducts = (page, count, callback) => {
  const queryOffset = page > 1 ? (page - 1) * count : 0;
  const parameters = 'id, name, slogan, description, category, default_price'

  let queryString = `SELECT ${parameters} FROM products ORDER BY id OFFSET ${queryOffset} LIMIT ${count}`;
  if (count === '*') {queryString = 'SELECT * FROM products ORDER BY id'};
  basicQuery(queryString, callback);
}

const getStyles = (productID, callback) => {
  const styleString = `SELECT product_id::VARCHAR(5), JSON_AGG(json_build_object('style_id', id, 'name', name, 'original_price', original_price, 'sale_price', sale_price, 'default?', default_style, 'photos', photos, 'skus', skus) ORDER BY product_id) AS results FROM styles WHERE product_id = ${productID} GROUP BY product_id`
  basicQuery(styleString, callback);
}

const getRelated = (productID, callback) => {
  const queryString = `SELECT related_product_id FROM related where product_id = ${productID}`;
  basicQuery(queryString, callback);
}

module.exports = {
  pool,
  getSelectedProduct,
  getProducts,
  getStyles,
  getRelated,
}