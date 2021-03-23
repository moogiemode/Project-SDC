-- psql -h localhost -d products -U me < schema.sql

-- DROP DATABASE IF EXISTS products;

-- CREATE DATABASE products;

-- \c products;

/*******CREATE TABLES********/

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
  value VARCHAR(50),
  CONSTRAINT features_fk
    FOREIGN KEY(product_id)
    REFERENCES products(id)
);

CREATE TABLE styles (
  id SERIAL PRIMARY KEY,
  product_id INTEGER,
  name VARCHAR(50),
  sale_price INTEGER,
  original_price INTEGER,
  default_style BOOLEAN,
  CONSTRAINT styles_fk
    FOREIGN KEY(product_id)
    REFERENCES products(id)
);

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  temp_id INTEGER,
  style_id INTEGER,
  photo_url VARCHAR,
  thumbnail_url VARCHAR
);

CREATE TABLE skus (
  id SERIAL PRIMARY KEY,
  style_id INTEGER,
  size VARCHAR(10),
  quantity INTEGER
);

CREATE TABLE related (
  id SERIAL PRIMARY KEY,
  product_id INTEGER,
  related_product_id INTEGER,
  CONSTRAINT related_fk
    FOREIGN KEY(product_id)
    REFERENCES products(id)
);

/*******COPY CSV INTO TABLES********/

\COPY products FROM './products_data/products.csv' DELIMITER ',' CSV HEADER;
\COPY styles FROM './products_data/styles.csv' DELIMITER ',' NULL AS 'null' CSV HEADER;
\COPY photos (temp_id, style_id, photo_url, thumbnail_url) FROM './products_data/photos.csv' DELIMITER ',' CSV HEADER;
\COPY features FROM './products_data/features.csv' DELIMITER ',' CSV;
\COPY related FROM './products_data/related.csv' DELIMITER ',' CSV HEADER;
\COPY skus FROM './products_data/skus.csv' DELIMITER ',' CSV HEADER;

/*******EDIT TABLES, CHANGE SHAPE OF DATA********/

ALTER TABLE products ADD COLUMN features json;

UPDATE products
SET features = aggregated_features
FROM (
    SELECT product_id, JSON_AGG(json_build_object('feature', feature, 'value', value) ORDER BY product_id) AS aggregated_features
    FROM features
    GROUP BY product_id
) AS a
WHERE products.id = product_id;

/*****add photos to styles******/
ALTER TABLE photos DROP COLUMN temp_id;
ALTER TABLE styles ADD COLUMN photos json;

UPDATE styles
SET photos = aggregated_photos
FROM (
  SELECT style_id, JSON_AGG(json_build_object('thumbnail_url', thumbnail_url, 'url', photo_url) ORDER BY style_id) AS aggregated_photos
  FROM photos
  GROUP BY style_id
) AS a
WHERE styles.id = style_id;

/****add skus to style*****/
ALTER TABLE styles ADD COLUMN skus json;

UPDATE styles
SET skus = aggregated_skus
FROM (
  SELECT style_id, JSON_AGG(json_build_object('id', id, 'size', size, 'quantity', quantity) ORDER BY style_id) AS aggregated_skus
  FROM skus
  GROUP BY style_id
) AS a
WHERE styles.id = style_id;


/*********add indexes*********/
CREATE INDEX CONCURRENTLY "index_id_on_products" ON products USING BTREE (id);
CREATE INDEX CONCURRENTLY "index_product_id_on_styles" ON styles USING BTREE (product_id);
CREATE INDEX CONCURRENTLY "index_product_id_on_related" ON related USING BTREE (product_id);