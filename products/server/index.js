// require('newrelic');
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
    response.send(result[0]);
  })
})

app.get('/api/products/:id/styles', (request, response) => {
  db.getStyles(request.params.id, (error, result) => {
    const queryResult = result[0].results;
    queryResult.forEach((value) => {
      const { skus } = value;
      const newSku = {};
      for (key in skus) {
        newSku[skus[key].id] = {};
        newSku[skus[key].id].quantity = skus[key].quantity;
        newSku[skus[key].id].size = skus[key].size;
      }
      value.skus = newSku;
    })
    response.send(result[0]);
  })
})

app.get('/api/products/:id/related', (request, response) => {
  db.getRelated(request.params.id, (error, result) => {
    result = result.map((relatedObj) => relatedObj.related_product_id)
    response.send(result)
  })
})

// app.get('/api/test', (request,response) => {
//   db.testQuery((error, result) => {
//     console.log(result)
//     response.send(result);
//   })
// })

app.listen(port, () => {
  console.log(`Listening on port: ${port}`)
})