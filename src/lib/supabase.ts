import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error(
    "Перевір VITE_SUPABASE_URL і VITE_SUPABASE_ANON_KEY у .env.local",
  );
}

export const supabase = createClient(url, key);
