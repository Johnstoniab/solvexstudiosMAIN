/*
  # Create Services Table

  1. New Tables
    - `services`
      - `id` (uuid, primary key, auto-generated)
      - `title` (text)
      - `summary` (text)
      - `image_url` (text)
      - `title_color` (text)
      - `description` (text)
      - `sub_services` (text array)
      - `outcome` (text)
      - `status` (text: 'draft', 'published')
      - `is_deleted` (boolean, default false)
      - `deleted_at` (timestamptz)
      - `image_fit` (text, default 'cover')
      - `image_position` (text, default 'center')
      - `image_rotation` (integer, default 0)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on services table
    - Public can view published, non-deleted services
    - Authenticated users can manage services (for admin panel)
*/

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text,
  image_url text,
  title_color text, 
  description text,
  sub_services text[],
  outcome text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  is_deleted boolean DEFAULT false,
  deleted_at timestamptz,
  image_fit text DEFAULT 'cover',
  image_position text DEFAULT 'center',
  image_rotation integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published services"
  ON services FOR SELECT
  USING (status = 'published' AND is_deleted = false);

-- This policy allows any authenticated user to manage services.
-- For production, you should replace this with a more secure policy
-- that checks for a specific 'admin' role.
CREATE POLICY "Admins can manage services"
  ON services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true); 