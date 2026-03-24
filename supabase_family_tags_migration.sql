-- Oilaviy a'zolarga "Otam", "Onam", "Opam" kabi teg (tag) berish uchun ustun qo'shish

ALTER TABLE public.family_links ADD COLUMN IF NOT EXISTS member_tag TEXT;

-- RLS (Xavfsizlik) o'zgarishsiz qoladi, chunki Head User va Member User uchun Update huquqi allaqachon berilgan.
