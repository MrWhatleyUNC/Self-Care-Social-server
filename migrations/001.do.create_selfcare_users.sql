CREATE TABLE selfcare_users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
--   admin BOOLEAN NOT NULL,
  date_created TIMESTAMPTZ DEFAULT now() NOT NULL
);
