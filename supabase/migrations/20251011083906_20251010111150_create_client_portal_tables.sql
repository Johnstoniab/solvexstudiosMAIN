/*
  # Create Client Portal Tables

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `client_id` (uuid, references profiles)
      - `title` (text)
      - `description` (text)
      - `status` (text: 'pending', 'in_progress', 'review', 'completed', 'cancelled')
      - `priority` (text: 'low', 'medium', 'high', 'urgent')
      - `budget` (numeric)
      - `start_date` (date)
      - `end_date` (date)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `requests`
      - `id` (uuid, primary key)
      - `client_id` (uuid, references profiles)
      - `project_id` (uuid, references projects, nullable)
      - `type` (text: 'service', 'support', 'feature', 'bug', 'other')
      - `title` (text)
      - `description` (text)
      - `status` (text: 'open', 'in_progress', 'resolved', 'closed')
      - `priority` (text: 'low', 'medium', 'high', 'urgent')
      - `attachments` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `messages`
      - `id` (uuid, primary key)
      - `request_id` (uuid, references requests)
      - `sender_id` (uuid, references profiles)
      - `content` (text)
      - `attachments` (jsonb)
      - `is_read` (boolean, default false)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Clients can view and create their own projects
    - Clients can view and create their own requests
    - Clients can view messages for their requests and send messages
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'review', 'completed', 'cancelled')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  budget numeric,
  start_date date,
  end_date date,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('service', 'support', 'feature', 'bug', 'other')),
  title text NOT NULL,
  description text,
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  attachments jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES requests(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  attachments jsonb DEFAULT '[]'::jsonb,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Clients can create own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = client_id)
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can view own requests"
  ON requests FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Clients can create own requests"
  ON requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can update own requests"
  ON requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = client_id)
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can view messages for their requests"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM requests
      WHERE requests.id = messages.request_id
      AND requests.client_id = auth.uid()
    )
    OR auth.uid() = sender_id
  );

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);