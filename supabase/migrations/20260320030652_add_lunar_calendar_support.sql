/*
  # Add lunar calendar support

  1. Modifications
    - `countdown_events` table
      - `calendar_type` (text) - Add field to store calendar type ('gregorian' or 'lunar')
      - `lunar_date_display` (text, optional) - Store the lunar date as a string for reference

  2. Notes
    - Lunar dates are converted to gregorian for countdown calculations
    - calendar_type defaults to 'gregorian' for existing and new events
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'countdown_events' AND column_name = 'calendar_type'
  ) THEN
    ALTER TABLE countdown_events 
    ADD COLUMN calendar_type text DEFAULT 'gregorian';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'countdown_events' AND column_name = 'lunar_date_display'
  ) THEN
    ALTER TABLE countdown_events 
    ADD COLUMN lunar_date_display text DEFAULT '';
  END IF;
END $$;