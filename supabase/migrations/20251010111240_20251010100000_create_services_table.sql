/*
  # Create Services Table (Alternative Schema)

  1. New Tables
    - `services_v2` (to avoid conflict with existing services table)
      - `id` (uuid, primary key)
      - `title` (text)
      - `summary` (text)
      - `image_url` (text)
      - `title_color` (text)
      - `description` (text)
      - `sub_services` (text array)
      - `outcome` (text)
      - `status` (text: 'draft', 'published')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on services_v2 table
    - Public can view published services
    - Authenticated users can manage services
*/

CREATE TABLE IF NOT EXISTS services_v2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text,
  image_url text,
  title_color text,
  description text,
  sub_services text[],
  outcome text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published services"
  ON services_v2 FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins can manage services"
  ON services_v2 FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);