/*
  # Add Missing Admin Tables

  1. New Tables
    - `clients`
      - `id` (uuid, primary key, references profiles)
      - `company` (text)
      - `industry` (text)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `teams`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `members`
      - `id` (uuid, primary key)
      - `team_id` (uuid, references teams)
      - `profile_id` (uuid, references profiles)
      - `role` (text)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Authenticated users can view their own client record
    - Team members can view their team information
*/

CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  company text,
  industry text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role text DEFAULT 'member',
  created_at timestamptz DEFAULT now(),
  UNIQUE(team_id, profile_id)
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own client record"
  ON clients FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view their teams"
  ON teams FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.team_id = teams.id
      AND members.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can view team members"
  ON members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM members AS m
      WHERE m.team_id = members.team_id
      AND m.profile_id = auth.uid()
    )
  );