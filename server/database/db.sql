CREATE TABLE IF NOT EXISTS monitor (
      id UUID PRIMARY KEY, 
      keyword VARCHAR NOT NULL,
      user_email VARCHAR NOT NULL
    );