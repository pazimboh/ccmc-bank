
-- Add account_status column to accounts table for freezing functionality
ALTER TABLE public.accounts 
ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'active';

-- Add check constraint for account_status if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'accounts_account_status_check'
    ) THEN
        ALTER TABLE public.accounts 
        ADD CONSTRAINT accounts_account_status_check 
        CHECK (account_status IN ('active', 'frozen', 'closed'));
    END IF;
END $$;

-- Update deposits table to ensure it has proper validation fields
ALTER TABLE public.deposits 
ADD COLUMN IF NOT EXISTS deposit_method TEXT DEFAULT 'bank_transfer',
ADD COLUMN IF NOT EXISTS receipt_url TEXT,
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Enable RLS on accounts table
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own accounts" ON public.accounts;
DROP POLICY IF EXISTS "Users can create their own accounts" ON public.accounts;
DROP POLICY IF EXISTS "Admins can view all accounts" ON public.accounts;

-- Create RLS policies for accounts
CREATE POLICY "Users can view their own accounts" ON public.accounts
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own accounts" ON public.accounts
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all accounts" ON public.accounts
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Enable RLS on deposits table
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own deposits" ON public.deposits;
DROP POLICY IF EXISTS "Users can create their own deposits" ON public.deposits;
DROP POLICY IF EXISTS "Admins can view all deposits" ON public.deposits;

-- Create RLS policies for deposits
CREATE POLICY "Users can view their own deposits" ON public.deposits
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own deposits" ON public.deposits
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all deposits" ON public.deposits
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Enable RLS on user_settings table
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can manage their own settings" ON public.user_settings;

-- Create RLS policies for user_settings
CREATE POLICY "Users can manage their own settings" ON public.user_settings
FOR ALL USING (user_id = auth.uid());

-- Create function to update account balance after deposit validation
CREATE OR REPLACE FUNCTION public.process_deposit_validation()
RETURNS TRIGGER AS $$
BEGIN
  -- If deposit status changed to 'approved', update account balance
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    UPDATE public.accounts 
    SET balance = balance + NEW.amount,
        updated_at = NOW()
    WHERE id = NEW.account_id;
  END IF;
  
  -- If deposit status changed from 'approved' to something else, reverse the balance
  IF OLD.status = 'approved' AND NEW.status != 'approved' THEN
    UPDATE public.accounts 
    SET balance = balance - NEW.amount,
        updated_at = NOW()
    WHERE id = NEW.account_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for deposit validation
DROP TRIGGER IF EXISTS deposit_validation_trigger ON public.deposits;
CREATE TRIGGER deposit_validation_trigger
  AFTER UPDATE ON public.deposits
  FOR EACH ROW
  EXECUTE FUNCTION public.process_deposit_validation();

-- Create function to generate account numbers
CREATE OR REPLACE FUNCTION public.generate_account_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'ACC' || LPAD(FLOOR(RANDOM() * 10000000)::TEXT, 7, '0');
END;
$$ LANGUAGE plpgsql;
