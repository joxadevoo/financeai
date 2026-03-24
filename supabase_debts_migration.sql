-- Qarzlar (Debts) jadvallari va xavfsizlik (RLS) qoidalari

CREATE TABLE IF NOT EXISTS public.debts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('lent', 'borrowed')), -- lent = Men berdim, borrowed = Menga berishdi (qarz oldim)
    amount NUMERIC NOT NULL CHECK (amount > 0),
    person_name TEXT NOT NULL,
    due_date DATE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Xavfsizlik qoidalari
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;

-- Foydalanuvchi faqat o'ziga tegishli qarzlarni ko'rishi mumkin
CREATE POLICY "Users can view own debts"
    ON public.debts FOR SELECT
    USING (auth.uid() = user_id);

-- Foydalanuvchi o'ziga tegishli qarz qo'shishi mumkin
CREATE POLICY "Users can insert own debts"
    ON public.debts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Foydalanuvchi o'z qarzinigina yangilashi mumkin (masalan, statusini paid qilish)
CREATE POLICY "Users can update own debts"
    ON public.debts FOR UPDATE
    USING (auth.uid() = user_id);

-- Foydalanuvchi o'z qarzinigina o'chirishi mumkin
CREATE POLICY "Users can delete own debts"
    ON public.debts FOR DELETE
    USING (auth.uid() = user_id);
