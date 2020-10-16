CREATE TABLE selfcare_posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
    user_id INTEGER
        REFERENCES selfcare_users(id) ON DELETE CASCADE NOT NULL
);
