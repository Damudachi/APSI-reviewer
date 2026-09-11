// db.js - In-memory PostgreSQL database using pg-mem for practice.
import { newDb } from 'pg-mem'

const db = newDb()

// Create Pool wrapper
export const pool = {
  query: (text, params) => db.public.query(text, params)
}

// Seed Schema & Data
db.public.none(`
  CREATE TABLE IF NOT EXISTS investigators (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS sightings (
    id SERIAL PRIMARY KEY,
    investigator_id INTEGER NOT NULL REFERENCES investigators(id) ON DELETE CASCADE,
    place TEXT NOT NULL,
    description TEXT,
    spookiness INTEGER NOT NULL,
    reported_at TIMESTAMPTZ DEFAULT now()
  );

  INSERT INTO investigators (name, email) VALUES
    ('Ed Warren', 'ed@warren.org'),
    ('Lorraine Warren', 'lorraine@warren.org'),
    ('John Zaffis', 'john@zaffis.org'),
    ('Hans Holzer', 'hans@holzer.org'),
    ('Zak Bagans', 'zak@ghostadventures.org');

  INSERT INTO sightings (investigator_id, place, description, spookiness, reported_at) VALUES
    (1, 'Library 3rd floor', 'Cold spot near stacks', 4, '2026-07-01T20:00:00Z'),
    (1, 'Old Gym', 'Disembodied footsteps', 5, '2026-07-02T21:00:00Z'),
    (2, 'Science Lab', 'Self-opening cabinet', 3, '2026-07-03T18:30:00Z'),
    (2, 'Library 3rd floor', 'Whispering shadows', 5, '2026-07-04T22:00:00Z'),
    (3, 'Basement Auditorium', 'Flickering lights and temperature drop', 4, '2026-07-05T23:15:00Z'),
    (3, 'Old Gym', 'Screaming echo', 5, '2026-07-06T01:00:00Z'),
    (4, 'Clock Tower', 'Moving phantom clock hands', 2, '2026-07-07T12:00:00Z'),
    (4, 'Library 3rd floor', 'Floating books', 5, '2026-07-08T19:45:00Z'),
    (5, 'Cafeteria Kitchen', 'Flying utensils', 4, '2026-07-09T20:30:00Z'),
    (5, 'Basement Auditorium', 'Heavy footsteps overhead', 3, '2026-07-10T23:50:00Z');
`)
