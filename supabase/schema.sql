-- ============================================================
-- DHSUD ePermits Portal — Supabase Schema
-- Run this entire script in your Supabase SQL Editor
-- ============================================================

-- Sequence for reference numbers
CREATE SEQUENCE IF NOT EXISTS application_seq START 1;

-- ============================================================
-- TABLE: profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'applicant' CHECK (role IN ('applicant', 'admin', 'evaluator')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: applications
-- ============================================================
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_no TEXT UNIQUE,
  applicant_id UUID REFERENCES profiles(id) NOT NULL,
  application_type TEXT NOT NULL CHECK (application_type IN (
    'Development Permit',
    'Certificate of Registration and License to Sell',
    'Temporary License to Sell',
    'Alteration of Plan'
  )),
  applicant_type TEXT,
  company_name TEXT,
  authorized_representative TEXT,
  contact_number TEXT,
  email_address TEXT,
  project_name TEXT,
  project_location TEXT,
  status TEXT DEFAULT 'Draft' CHECK (status IN (
    'Draft',
    'For Payment',
    'Received',
    'Ongoing Evaluation',
    'Ongoing Inspection',
    'Ongoing Approval',
    'Released',
    'Disapproved'
  )),
  date_submitted TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: requirements
-- ============================================================
CREATE TABLE IF NOT EXISTS requirements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  requirement_name TEXT NOT NULL,
  file_name TEXT,
  file_path TEXT,
  file_size INTEGER,
  status TEXT DEFAULT 'Missing' CHECK (status IN ('Compliant', 'Incorrect File', 'Missing')),
  uploaded_at TIMESTAMPTZ
);

-- ============================================================
-- TABLE: payments
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  reference_no TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date_issued TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Paid', 'Expired')),
  payment_method TEXT
);

-- ============================================================
-- TABLE: application_timeline
-- ============================================================
CREATE TABLE IF NOT EXISTS application_timeline (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  event_date TIMESTAMPTZ DEFAULT NOW(),
  description TEXT NOT NULL,
  stage TEXT
);

-- ============================================================
-- TABLE: notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('Application Update', 'Payment Reminder', 'New Message')),
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TRIGGER: Auto-generate reference numbers
-- ============================================================
CREATE OR REPLACE FUNCTION generate_reference_no()
RETURNS TRIGGER AS $$
DECLARE
  prefix TEXT;
  year TEXT := TO_CHAR(NOW(), 'YYYY');
  seq TEXT;
BEGIN
  CASE NEW.application_type
    WHEN 'Development Permit' THEN prefix := 'DP';
    WHEN 'Certificate of Registration and License to Sell' THEN prefix := 'CRLS';
    WHEN 'Temporary License to Sell' THEN prefix := 'TLTS';
    WHEN 'Alteration of Plan' THEN prefix := 'AOP';
    ELSE prefix := 'EP';
  END CASE;
  seq := LPAD(NEXTVAL('application_seq')::TEXT, 4, '0');
  NEW.reference_no := prefix || '-' || year || '-' || seq;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_reference_no
  BEFORE INSERT ON applications
  FOR EACH ROW
  WHEN (NEW.reference_no IS NULL)
  EXECUTE FUNCTION generate_reference_no();

-- ============================================================
-- TRIGGER: Auto-update updated_at on applications
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TRIGGER: Auto-create profile on user registration
-- ============================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Applications
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Applicants can view own applications" ON applications
  FOR SELECT USING (auth.uid() = applicant_id);
CREATE POLICY "Applicants can insert own applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = applicant_id);
CREATE POLICY "Applicants can update own applications" ON applications
  FOR UPDATE USING (auth.uid() = applicant_id);

-- Requirements
ALTER TABLE requirements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage requirements of own applications" ON requirements
  USING (application_id IN (SELECT id FROM applications WHERE applicant_id = auth.uid()));
CREATE POLICY "Users can insert requirements" ON requirements
  FOR INSERT WITH CHECK (application_id IN (SELECT id FROM applications WHERE applicant_id = auth.uid()));
CREATE POLICY "Users can update requirements" ON requirements
  FOR UPDATE USING (application_id IN (SELECT id FROM applications WHERE applicant_id = auth.uid()));

-- Payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view payments of own applications" ON payments
  FOR SELECT USING (application_id IN (SELECT id FROM applications WHERE applicant_id = auth.uid()));
CREATE POLICY "Users can update payments of own applications" ON payments
  FOR UPDATE USING (application_id IN (SELECT id FROM applications WHERE applicant_id = auth.uid()));
CREATE POLICY "Users can insert payments of own applications" ON payments
  FOR INSERT WITH CHECK (application_id IN (SELECT id FROM applications WHERE applicant_id = auth.uid()));

-- Timeline
ALTER TABLE application_timeline ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own application timeline" ON application_timeline
  FOR SELECT USING (application_id IN (SELECT id FROM applications WHERE applicant_id = auth.uid()));
CREATE POLICY "Users can insert own application timeline" ON application_timeline
  FOR INSERT WITH CHECK (application_id IN (SELECT id FROM applications WHERE applicant_id = auth.uid()));

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own notifications" ON notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKET (run in Supabase Dashboard > Storage)
-- Or use the SQL below if using service role key:
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('permit-documents', 'permit-documents', false)
-- ON CONFLICT DO NOTHING;

-- Storage policy (after creating bucket in dashboard):
-- CREATE POLICY "Users can upload their own documents"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'permit-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
--
-- CREATE POLICY "Users can read their own documents"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'permit-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
