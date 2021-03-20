const { pool } = require('./server');
const fs = require('fs');

const dataPath = './products_data/';

fs.readdir(dataPath, (err, files) => {
  files.forEach(file => {
    console.log(file);
  });
});

// const testImport = (request, response) => {
//   const csvPath = `${dataPath}persons`
//   const query = `/COPY persons (first_name, last_name, dob, email) FROM ${csvPath} DELIMITER ',' CSV HEADER;`

//   pool.query(query, (error, results) => {
//     if (error) {
//       console.log(error)
//     }
//   })
// }

// pool.connect((err, client, done) => {
//   if (err) throw err
//   client.query('COPY persons FROM ', [1], (err, res) => {
//     done()
//     if (err) {
//       console.log(err.stack)
//     } else {
//       console.log(res.rows[0])
//     }
//   })
// })

// let query = 'COPY persons(first_name, last_name, dob, email)
// FROM '..\products_data\persons.csv'
// DELIMITER ','
// CSV HEADER;'
// console.log(typeof `${dataPath}persons`);
// testImport();

// COPY zip_codes FROM '/path/to/csv/ZIP_CODES.txt' WITH (FORMAT csv);