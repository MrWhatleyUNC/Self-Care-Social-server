CREATE TABLE selfcare_comments (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
    user_id INTEGER
        REFERENCES selfcare_users(id) ON DELETE CASCADE NOT NULL,
    post_id INTEGER
        REFERENCES selfcare_posts(id) ON DELETE CASCADE NOT NULL
);