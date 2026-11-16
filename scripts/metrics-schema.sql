CREATE TABLE IF NOT EXISTS metric_daily (
  day TEXT NOT NULL,
  page TEXT NOT NULL,
  event TEXT NOT NULL,
  source TEXT NOT NULL,
  device TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1 CHECK (count > 0),
  PRIMARY KEY (day, page, event, source, device)
) WITHOUT ROWID;
