-- FinanceAI Supabase Initialization Script
-- Run this in your Supabase SQL Editor to create tables and RLS policies

-- 1. Create income_sources table
CREATE TABLE IF NOT EXISTS public.income_sources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    type TEXT,
    frequency TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    is_recurring BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Create investments table
CREATE TABLE IF NOT EXISTS public.investments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    initial_amount NUMERIC DEFAULT 0,
    monthly_contribution NUMERIC DEFAULT 0,
    annual_rate NUMERIC DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.income_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies for income_sources (Users can only see/edit their own data)
CREATE POLICY "Users can view their own income_sources" 
    ON public.income_sources FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own income_sources" 
    ON public.income_sources FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own income_sources" 
    ON public.income_sources FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own income_sources" 
    ON public.income_sources FOR DELETE 
    USING (auth.uid() = user_id);

-- 6. Create Policies for expenses
CREATE POLICY "Users can view their own expenses" 
    ON public.expenses FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own expenses" 
    ON public.expenses FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses" 
    ON public.expenses FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses" 
    ON public.expenses FOR DELETE 
    USING (auth.uid() = user_id);

-- 7. Create Policies for investments
CREATE POLICY "Users can view their own investments" 
    ON public.investments FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own investments" 
    ON public.investments FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own investments" 
    ON public.investments FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own investments" 
    ON public.investments FOR DELETE 
    USING (auth.uid() = user_id);
