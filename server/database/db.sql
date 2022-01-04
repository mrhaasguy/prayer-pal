CREATE TABLE IF NOT EXISTS prayer_requests (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  email_date DATE NOT NULL,
  from_email VARCHAR NOT NULL,
  subject VARCHAR NOT NULL,
  category VARCHAR,
  message VARCHAR NOT NULL,
  UNIQUE (user_id, category, message)
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  fullname VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS user_emails (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  email VARCHAR NOT NULL,
  is_primary BOOLEAN NOT NULL
);