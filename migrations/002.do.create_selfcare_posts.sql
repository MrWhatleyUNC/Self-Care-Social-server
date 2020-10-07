CREATE TABLE selfcare_posts (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
    user_id INTEGER
        REFERENCES selfcare_users(id) ON DELETE CASCADE NOT NULL,
);

ALTER TABLE selfcare_users
  ADD COLUMN
    posts INTEGER REFERENCES selfcare_posts(id)
    ON DELETE SET NULL;