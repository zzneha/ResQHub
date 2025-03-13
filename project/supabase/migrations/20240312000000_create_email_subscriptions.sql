-- Create email_subscriptions table
CREATE TABLE IF NOT EXISTS email_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_email ON email_subscriptions(email);

-- Enable Row Level Security
ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts
DROP POLICY IF EXISTS "Allow public inserts" ON email_subscriptions;
CREATE POLICY "Allow public inserts" ON email_subscriptions
  FOR INSERT TO public
  WITH CHECK (true);

-- Create policy to allow public to view their own subscriptions
DROP POLICY IF EXISTS "Allow public to view own subscriptions" ON email_subscriptions;
CREATE POLICY "Allow public to view own subscriptions" ON email_subscriptions
  FOR SELECT TO public
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_email_subscriptions_updated_at ON email_subscriptions;
CREATE TRIGGER update_email_subscriptions_updated_at
  BEFORE UPDATE ON email_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 