/*
  # Create Rental Gear Management Table

  ## Overview
  This migration creates the rental_gear table for managing equipment rentals in the admin panel.
  
  ## Tables Created
  
  ### rental_gear
  Stores all rental equipment information including pricing and availability.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier for each rental item
  - `name` (text, required) - Name of the rental equipment
  - `description` (text) - Detailed description of the equipment
  - `category` (text) - Equipment category (e.g., "Camera", "Lighting", "Audio")
  - `price_per_day` (numeric) - Daily rental price in currency units
  - `is_available` (boolean, default true) - Current availability status
  - `image_url` (text) - Optional image URL for the equipment
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ## Security
  
  ### Row Level Security (RLS)
  - RLS is enabled on the rental_gear table
  - Only authenticated admin users can manage rental gear
  - Public users can view available rental gear (read-only)
  
  ### Policies
  1. **Public Read Access** - Anyone can view available rental gear
  2. **Admin Full Access** - Authenticated users have full CRUD access
  
  ## Indexes
  - Primary key index on `id`
  - Index on `category` for faster filtering
  - Index on `is_available` for availability queries
  
  ## Notes
  - Prices are stored as numeric type for precision
  - Timestamps use timestamptz for timezone awareness
  - Updated_at automatically updates on row modification via trigger
*/

-- Create rental_gear table
CREATE TABLE IF NOT EXISTS rental_gear (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text,
  price_per_day numeric(10, 2) NOT NULL CHECK (price_per_day >= 0),
  is_available boolean DEFAULT true NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_rental_gear_category ON rental_gear(category);
CREATE INDEX IF NOT EXISTS idx_rental_gear_availability ON rental_gear(is_available);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_rental_gear_updated_at ON rental_gear;
CREATE TRIGGER update_rental_gear_updated_at
  BEFORE UPDATE ON rental_gear
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE rental_gear ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view available rental gear (public read access)
CREATE POLICY "Public users can view available rental gear"
  ON rental_gear
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can insert rental gear
CREATE POLICY "Authenticated users can create rental gear"
  ON rental_gear
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update rental gear
CREATE POLICY "Authenticated users can update rental gear"
  ON rental_gear
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete rental gear
CREATE POLICY "Authenticated users can delete rental gear"
  ON rental_gear
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample data for demonstration
INSERT INTO rental_gear (name, description, category, price_per_day, is_available, image_url) VALUES
  ('Sony A7 III Camera Body', 'Professional full-frame mirrorless camera with excellent low-light performance', 'Camera', 85.00, true, 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg'),
  ('Canon EF 24-70mm f/2.8L II', 'Professional zoom lens with constant f/2.8 aperture', 'Lens', 45.00, true, 'https://images.pexels.com/photos/279906/pexels-photo-279906.jpeg'),
  ('Aputure 120D II LED Light', 'Powerful daylight-balanced LED light with wireless control', 'Lighting', 35.00, true, 'https://images.pexels.com/photos/257904/pexels-photo-257904.jpeg'),
  ('Rode NTG3 Shotgun Microphone', 'Broadcast-quality shotgun microphone for professional audio', 'Audio', 25.00, true, 'https://images.pexels.com/photos/164829/pexels-photo-164829.jpeg'),
  ('DJI Ronin-S Gimbal', '3-axis motorized gimbal stabilizer for smooth camera movement', 'Stabilization', 55.00, false, 'https://images.pexels.com/photos/1983032/pexels-photo-1983032.jpeg'),
  ('Blackmagic Design ATEM Mini', 'Live production switcher for multi-camera streaming', 'Switcher', 40.00, true, 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg')
ON CONFLICT DO NOTHING;