 import { createClient } from
"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://zxebieoyfsdnekhueaqu.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_oXjklWbGATKWHVNVkqCMsg__SIcxXEL";

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);