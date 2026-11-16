-- Topic tab on /blog, and the "show at the top" spot: 0 = no, 1 = big card, 2 = small card 1, 3 = small card 2.
ALTER TABLE posts ADD COLUMN topic TEXT NOT NULL DEFAULT '';
ALTER TABLE posts ADD COLUMN featured INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0, 1, 2, 3));
