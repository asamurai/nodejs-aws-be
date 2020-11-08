create extension if not exists "uuid-ossp";

CREATE TABLE if not exists public.products (
	id uuid DEFAULT uuid_generate_v4(),
	title text NOT NULL,
    studio text NULL,
    genre text NULL,
	description text NOT NULL,
    release_date text NULL,
    poster varchar(200) DEFAULT 'image.jpeg',
    price numeric NOT NULL,
	CONSTRAINT products_private_key PRIMARY KEY (id)
);

CREATE TABLE if not exists public.stocks (
	count int4 NOT NULL,
	product_id uuid NOT NULL,
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	CONSTRAINT stocks_private_key PRIMARY KEY (id),
	CONSTRAINT stocks_unique_key UNIQUE (product_id)
);

ALTER TABLE public.stocks ADD CONSTRAINT stocks_fk FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

insert into products (title, studio, genre, description, release_date, poster, price) values
('Witcher 1', 'CD PROJEKT RED', 'RPG', 'Witcher 1 description', '2007-01-01', 'https://m.media-amazon.com/images/M/MV5BMTBlMDk3MDktZTFkZC00YjkzLTkwMWUtYmRlNjYwMzJmNzRmXkEyXkFqcGdeQXVyOTQxNzM2MjY@._V1_UY1200_CR108,0,630,1200_AL_.jpg', 300),
('Witcher 2', 'CD PROJEKT RED', 'RPG', 'Witcher 2 description', '2011-01-01', 'https://upload.wikimedia.org/wikipedia/en/thumb/4/40/Witcher_2_cover.jpg/220px-Witcher_2_cover.jpg', 500),
('Witcher 3', 'CD PROJEKT RED', 'RPG', 'Witcher 3 description', '2015-01-01', 'https://upload.wikimedia.org/wikipedia/en/0/0c/Witcher_3_cover_art.jpg', 1200);

insert into stocks (product_id, count) select id, trunc(random()*25) from products;
commit;
