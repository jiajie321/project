// Replace these with your Supabase values.
// SUPABASE_URL should look like: https://xxxxx.supabase.co
// Do NOT add /rest/v1 at the end.
// Use the publishable key. Do NOT use the secret key in front-end code.
const SUPABASE_URL = "https://actformcdgxdcmzpvqxg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_fTFNFB3Aq4_bIIAVGOJA3g_L6p0f2HU";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
