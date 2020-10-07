CREATE TABLE selfcare_comments (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
    user_id INTEGER
        REFERENCES selfcare_users(id) ON DELETE CASCADE NOT NULL,
);

ALTER TABLE selfcare_users
  ADD COLUMN
    comments INTEGER REFERENCES selfcare_comments(id)
    ON DELETE SET NULL;

ALTER TABLE selfcare_posts
  ADD COLUMN
    comments INTEGER REFERENCES selfcare_comments(id)
    ON DELETE SET NULL;