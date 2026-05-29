-- CRT import metadata
ALTER TABLE producers ADD COLUMN IF NOT EXISTS noma TEXT;
ALTER TABLE producers ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE producers ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';

ALTER TABLE tequilas ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';
ALTER TABLE tequilas ADD COLUMN IF NOT EXISTS crt_dot TEXT;

CREATE INDEX IF NOT EXISTS producers_noma_idx ON producers(noma);
CREATE INDEX IF NOT EXISTS tequilas_source_idx ON tequilas(source);
