-- Obunalar (Subscriptions) tizimi uchun baza tuzilmasi
-- Foydalanuvchi ma'lumotlari (profil) jadvalini yaratamiz

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    subscription_plan TEXT DEFAULT 'free' NOT NULL, -- 'free', 'pro', 'family'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Xavfsizlik qoidalari
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Foydalanuvchi faqat o'z profilini ko'rishi mumkin
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- Foydalanuvchi o'z profilini tahrirlashi mumkin (obunani yangilash simulyatsiyasi uchun)
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Foydalanuvchi o'ziga profil yaratishi mumkin (yoki auth.users triggeri ham bo'lishi mumkin)
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Eslatma: Haqiqiy production muhitida subscription_plan ustunini UPDATE qilishni
-- faqat Server/Admin (masalan Stripe Webhook orqali) tomondan himoyalash kerak.
-- Hozircha Local test uchun UPDATE qoidasi ochib qo'yildi.
