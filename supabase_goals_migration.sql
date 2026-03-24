-- Migration script for Financial Goals feature
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.financial_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    target_amount NUMERIC NOT NULL,
    current_amount NUMERIC DEFAULT 0,
    deadline TIMESTAMP WITH TIME ZONE,
    color TEXT DEFAULT '#3b82f6', -- Default blue color
    icon TEXT DEFAULT 'Target', -- Default lucide icon name
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.financial_goals ENABLE ROW LEVEL SECURITY;

-- Create Policies for financial_goals
CREATE POLICY "Users can view their own financial goals" 
    ON public.financial_goals FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own financial goals" 
    ON public.financial_goals FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own financial goals" 
    ON public.financial_goals FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own financial goals" 
    ON public.financial_goals FOR DELETE 
    USING (auth.uid() = user_id);
