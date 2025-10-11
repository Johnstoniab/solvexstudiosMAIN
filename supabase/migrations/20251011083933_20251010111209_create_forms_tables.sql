/*
  # Create Application Forms Tables

  1. New Tables
    - `career_applications`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `email` (text)
      - `phone` (text)
      - `position` (text)
      - `experience_years` (integer)
      - `portfolio_url` (text)
      - `cover_letter` (text)
      - `resume_url` (text)
      - `status` (text: 'submitted', 'reviewing', 'interview', 'accepted', 'rejected')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `contact_submissions`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `subject` (text)
      - `message` (text)
      - `status` (text: 'new', 'read', 'responded', 'archived')
      - `created_at` (timestamptz)
    
    - `access_requests`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `email` (text)
      - `phone` (text)
      - `company` (text)
      - `reason` (text)
      - `status` (text: 'pending', 'approved', 'rejected')
      - `approved_by` (uuid, references profiles, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Anyone can submit forms (insert)
    - Only authenticated admin users can view submissions
*/

CREATE TABLE IF NOT EXISTS career_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  position text NOT NULL,
  experience_years integer DEFAULT 0,
  portfolio_url text,
  cover_letter text,
  resume_url text,
  status text DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewing', 'interview', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'archived')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  reason text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit career applications"
  ON career_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can submit contact forms"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can submit access requests"
  ON access_requests FOR INSERT
  WITH CHECK (true);