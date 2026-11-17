-- Post author. author_name = '' means the default author (Asfequl Alam Fahim, profile photo). A named author may have a photo.
ALTER TABLE posts ADD COLUMN author_name TEXT NOT NULL DEFAULT '';
ALTER TABLE posts ADD COLUMN author_photo TEXT;
