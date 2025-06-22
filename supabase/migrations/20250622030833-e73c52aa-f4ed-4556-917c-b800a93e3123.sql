
-- Create deposits table for user deposit requests
CREATE TABLE IF NOT EXISTS public.deposits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'FCFA',
  description TEXT,
  reference_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  validated_by UUID REFERENCES auth.users(id),
  validated_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_settings table for 2FA and other user preferences
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  two_factor_enabled BOOLEAN NOT NULL DEFAULT false,
  two_factor_secret TEXT,
  two_factor_backup_codes JSONB,
  show_2fa_notification BOOLEAN NOT NULL DEFAULT true,
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  sms_notifications BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update accounts table to add frozen status
ALTER TABLE public.accounts 
  DROP CONSTRAINT IF EXISTS accounts_status_check,
  ADD CONSTRAINT accounts_status_check CHECK (status IN ('active', 'inactive', 'frozen'));

-- Enable RLS on new tables
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for deposits
CREATE POLICY "Users can view their own deposits" ON public.deposits 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own deposits" ON public.deposits 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all deposits" ON public.deposits 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can update deposits" ON public.deposits 
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Create RLS policies for user_settings
CREATE POLICY "Users can view their own settings" ON public.user_settings 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON public.user_settings 
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON public.user_settings 
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update accounts RLS to allow admins to update account status
CREATE POLICY "Admins can update account status" ON public.accounts 
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Insert default settings for existing users
INSERT INTO public.user_settings (user_id)
SELECT p.id 
FROM public.profiles p
WHERE NOT EXISTS (SELECT 1 FROM public.user_settings WHERE user_id = p.id);

-- Create function to generate reference numbers
CREATE OR REPLACE FUNCTION generate_deposit_reference()
RETURNS TEXT AS $$
BEGIN
  RETURN 'DEP' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Add some sample deposit requests
INSERT INTO public.deposits (user_id, account_id, amount, description, reference_number)
SELECT 
  a.user_id,
  a.id,
  (RANDOM() * 100000 + 10000)::DECIMAL(15,2),
  'Mobile money deposit',
  generate_deposit_reference()
FROM public.accounts a
LIMIT 5;
