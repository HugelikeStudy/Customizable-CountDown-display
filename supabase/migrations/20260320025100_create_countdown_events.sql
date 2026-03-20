/*
  # Create countdown events table

  1. New Tables
    - `countdown_events`
      - `id` (uuid, primary key) - Unique identifier for each event
      - `title` (text) - Name of the event (e.g., "College Entrance Exam", "Birthday")
      - `target_date` (timestamptz) - The target date and time for the countdown
      - `description` (text, optional) - Additional details about the event
      - `color` (text) - Color theme for the event card
      - `created_at` (timestamptz) - When the event was created
      - `user_id` (uuid, optional) - For future auth support

  2. Security
    - Enable RLS on `countdown_events` table
    - Add policy for public read access (for demo purposes)
    - Add policy for public insert access
    - Add policy for public update access
    - Add policy for public delete access

  Note: Using public access for simplicity. Can be restricted with auth later.
*/

CREATE TABLE IF NOT EXISTS countdown_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  target_date timestamptz NOT NULL,
  description text DEFAULT '',
  color text DEFAULT 'blue',
  created_at timestamptz DEFAULT now(),
  user_id uuid
);

ALTER TABLE countdown_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view countdown events"
  ON countdown_events FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert countdown events"
  ON countdown_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update countdown events"
  ON countdown_events FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete countdown events"
  ON countdown_events FOR DELETE
  USING (true);