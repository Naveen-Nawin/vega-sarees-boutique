// src/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// 👉 FILL THESE FROM YOUR SUPABASE PROJECT SETTINGS
const SUPABASE_URL = "https://nvzigogxtjogoypwkmah.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_dRwsgTnU9zvNO91bfLqdUQ_v3ugYWdw"; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
