ALTER TABLE prayer_requests ADD COLUMN created TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE users ADD COLUMN created TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE user_emails ADD COLUMN created TIMESTAMPTZ NOT NULL DEFAULT now();