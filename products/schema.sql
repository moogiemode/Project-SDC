-- psql -h localhost -d products -U me < schema.sql

-- DROP DATABASE IF EXISTS products;

-- CREATE DATABASE products;

-- \c products;

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(125),
  slogan VARCHAR,
  description VARCHAR,
  category VARCHAR(50),
  default_price INTEGER
);

CREATE TABLE features (
  id SERIAL PRIMARY KEY,
  product_id INTEGER,
  feature VARCHAR(50),
  value VARCHAR(50)
);

CREATE TABLE styles (
  id SERIAL PRIMARY KEY,
  product_id INTEGER,
  name VARCHAR(50),
  sale_price INTEGER,
  original_price INTEGER,
  default_style BOOLEAN
);

CREATE TABLE related (
  id SERIAL PRIMARY KEY,
  product_id INTEGER,
  related_product_id INTEGER
);

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  temp_id INTEGER,
  styleId INTEGER,
  photo_url VARCHAR,
  thumbnail_url VARCHAR
);

CREATE TABLE skus (
  id SERIAL PRIMARY KEY,
  styleId INTEGER,
  size VARCHAR(10),
  quantity INTEGER
);


-- \COPY productsTest FROM '/Users/moogie/Documents/HackReactor/Project-SDC/products/products_data/products.csv' DELIMITER ',' CSV HEADER;
-- \COPY characteristics FROM '/Users/moogie/Documents/HackReactor/Project-SDC/products/products_data/characteristics.csv' DELIMITER ',' CSV HEADER;
-- \COPY styles FROM '/Users/moogie/Documents/HackReactor/Project-SDC/products/products_data/styles.csv' DELIMITER ',' NULL AS 'null' CSV HEADER;
-- \COPY photos (temp_id, styleId, photo_url, thumbnail_url) FROM '/Users/moogie/Documents/HackReactor/Project-SDC/products/products_data/photos.csv' DELIMITER ',' CSV HEADER;
-- \COPY features FROM '/Users/moogie/Documents/HackReactor/Project-SDC/products/products_data/features.csv' DELIMITER ',' CSV;
-- \COPY related FROM '/Users/moogie/Documents/HackReactor/Project-SDC/products/products_data/related.csv' DELIMITER ',' CSV HEADER;
-- \COPY skus FROM '/Users/moogie/Documents/HackReactor/Project-SDC/products/products_data/skus.csv' DELIMITER ',' CSV HEADER;

\COPY products FROM './products_data/products.csv' DELIMITER ',' CSV HEADER;
\COPY styles FROM './products_data/styles.csv' DELIMITER ',' NULL AS 'null' CSV HEADER;
\COPY photos (temp_id, styleId, photo_url, thumbnail_url) FROM './products_data/photos.csv' DELIMITER ',' CSV HEADER;
\COPY features FROM './products_data/features.csv' DELIMITER ',' CSV;
\COPY related FROM './products_data/related.csv' DELIMITER ',' CSV HEADER;
\COPY skus FROM './products_data/skus.csv' DELIMITER ',' CSV HEADER;


UPDATE products
SET features = feature
FROM (
    SELECT product_id, JSON_AGG(json_build_object('feature', feature, 'value', value) ORDER BY product_id) AS feature
    FROM features
    GROUP BY product_id
) AS a
WHERE products.id = product_id;


-- ALTER TABLE products ADD COLUMN features record [];
-- ALTER TABLE products DROP COLUMN features;

UPDATE products
SET features = feature
FROM (
    SELECT product_id, JSON_AGG(json_build_object('feature', feature, 'value', value) ORDER BY product_id) AS feature
    FROM features
    GROUP BY product_id
) AS a
WHERE products.id = product_id;

json_agg(json_build_object('id', id, 'name', name, 'body', body))