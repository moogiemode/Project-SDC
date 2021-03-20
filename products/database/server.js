const { Pool } = require('pg');
const pool = new Pool({
  user: 'me',
  host: 'localhost',
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
  pool.connect()
    .then(client => {
      return client
        .query(queryString)
        .then(res => {
          client.release()
          console.log(res.rows)
          return res.rows
        })
        .catch(err => {
          client.release()
          console.log(err.stack);
        })
    })
    .then(result => callback(null, result))
}

const getSelectedProduct = (productID, callback) => {

  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(`SELECT * FROM products WHERE id = ${productID}`, (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      } else {

        client.query(`SELECT feature, value FROM features WHERE product_id = ${productID}`, (err2, result2) => {
          release()
          if (err2) {
            return console.error('Error executing query', err2.stack)
          } else {
            const endResult = { ...result.rows[0] }
            endResult.features = result2.rows;
            callback(null, endResult)
          }
        })
      }
    })
  })
}

const getProducts = (page, count, callback) => {

  const queryOffset = page > 1 ? (page - 1) * count : 0;
  let queryString = `SELECT * FROM products ORDER BY id OFFSET ${queryOffset} LIMIT ${count}`;

  if (count === '*') {
    queryString = 'SELECT * FROM products ORDER BY id';
  }
  basicQuery(queryString, callback);
}

const getFeatures = (callback) => {
  console.log('getFeatures')
  const queryString = 'SELECT array_agg(features) FROM features WHERE product_id = 1'

  basicQuery(queryString, callback);
}




// pool
//   .connect()
//   .then(client => {
//     return client
//       .query('SELECT * FROM users WHERE id = $1', [1])
//       .then(res => {
//         client.release()
//         console.log(res.rows[0])
//       })
//       .catch(err => {
//         client.release()
//         console.log(err.stack)
//       })
//   })

module.exports ={
  pool,
  getSelectedProduct,
  getProducts,
  getFeatures,
}