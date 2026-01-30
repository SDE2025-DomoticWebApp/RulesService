-- =========================
-- USERS
-- =========================
CREATE TABLE IF NOT EXISTS rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT ,
  email TEXT NOT NULL ,
  sensor_id TEXT NOT NULL ,
  operator TEXT NOT NULL ,
  threshold REAL NOT NULL ,
  field TEXT NOT NULL ,
  active BOOLEAN NOT NULL
);
