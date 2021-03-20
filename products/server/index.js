const express = require('express');
const bodyParser = require('body-parser');

const db = require('../database/server.js');

const app  = express();

const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (request, response) => {
  db.getOneUser((error, result) => {
      response.send(result);
  })

})

app.get('/api/products', (request, response) => {
  const page = request.query.page || 0;
  const count = request.query.count || 5;

  db.getProducts(page, count, (error, result) => {
    response.send(result);
  })
});

app.get('/api/products/:id', (request, response) => {
  db.getSelectedProduct(request.params.id, (error, result) => {
    response.send(result);
  })
})

app.get('/api/products/:id/features', (request, response) => {
  db.getFeatures((error, result) => {
    response.send(result);
  })
})

app.listen(port, () => {
  console.log(`Listening on port: ${port}`)
})