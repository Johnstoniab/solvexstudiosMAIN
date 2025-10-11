/*
  # Create Services Table

  1. New Tables
    - `services`
      - `id` (uuid, primary key)
      - `title` (text)
      - `summary` (text)
      - `image_url` (text)
      - `title_color` (text)
      - `description` (text)
      - `sub_services` (text array)
      - `outcome` (text)
      - `status` (text: 'draft', 'published')
      - `is_deleted` (boolean, default false)
      - `deleted_at` (text)
      - `image_fit` (text, default 'cover')
      - `image_position` (text, default 'center')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on services table
    - Public can view published services
    - Authenticated users can manage services
*/

CREATE TABLE IF NOT EXISTS services (
  id text PRIMARY KEY,
  title text NOT NULL,
  summary text,
  image_url text,
  title_color text,
  description text,
  sub_services text[],
  outcome text,
  status text DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  is_deleted boolean DEFAULT false,
  deleted_at text,
  image_fit text DEFAULT 'cover',
  image_position text DEFAULT 'center',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published services"
  ON services FOR SELECT
  USING (status = 'published' AND is_deleted = false);

CREATE POLICY "Admins can manage services"
  ON services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);