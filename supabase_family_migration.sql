-- 1. Create family_links table
CREATE TABLE IF NOT EXISTS public.family_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    head_user_id UUID REFERENCES auth.users(id) NOT NULL,
    member_user_id UUID REFERENCES auth.users(id), -- Nullable initially until user signs up, but for MVP we assume they are already signed up if they have an ID, or we invite by email
    member_email TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(head_user_id, member_email)
);

-- 2. Enable RLS on family_links
ALTER TABLE public.family_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own links" ON public.family_links 
  FOR SELECT USING (auth.uid() = head_user_id OR auth.uid() = member_user_id OR auth.jwt()->>'email' = member_email);

CREATE POLICY "Head users can insert links" ON public.family_links 
  FOR INSERT WITH CHECK (auth.uid() = head_user_id);

CREATE POLICY "Head or members can update their links" ON public.family_links 
  FOR UPDATE USING (auth.uid() = member_user_id OR auth.uid() = head_user_id OR auth.jwt()->>'email' = member_email);

CREATE POLICY "Head or members can delete links" ON public.family_links 
  FOR DELETE USING (auth.uid() = head_user_id OR auth.uid() = member_user_id);

-- 3. Add Family Read Policies to Expenses
CREATE POLICY "Users can read linked family expenses" ON public.expenses 
  FOR SELECT USING (
    user_id IN (
        SELECT head_user_id FROM public.family_links WHERE member_user_id = auth.uid() AND status = 'accepted'
        UNION
        SELECT member_user_id FROM public.family_links WHERE head_user_id = auth.uid() AND status = 'accepted'
    )
);

-- 4. Add Family Read Policies to Incomes
CREATE POLICY "Users can read linked family incomes" ON public.income_sources 
  FOR SELECT USING (
    user_id IN (
        SELECT head_user_id FROM public.family_links WHERE member_user_id = auth.uid() AND status = 'accepted'
        UNION
        SELECT member_user_id FROM public.family_links WHERE head_user_id = auth.uid() AND status = 'accepted'
    )
);

-- 5. Add Family Read Policies to Investments
CREATE POLICY "Users can read linked family investments" ON public.investments 
  FOR SELECT USING (
    user_id IN (
        SELECT head_user_id FROM public.family_links WHERE member_user_id = auth.uid() AND status = 'accepted'
        UNION
        SELECT member_user_id FROM public.family_links WHERE head_user_id = auth.uid() AND status = 'accepted'
    )
);

-- 6. Add Family Read Policies to Financial Goals
CREATE POLICY "Users can read linked family goals" ON public.financial_goals 
  FOR SELECT USING (
    user_id IN (
        SELECT head_user_id FROM public.family_links WHERE member_user_id = auth.uid() AND status = 'accepted'
        UNION
        SELECT member_user_id FROM public.family_links WHERE head_user_id = auth.uid() AND status = 'accepted'
    )
);
