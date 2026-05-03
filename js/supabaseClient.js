// Replace these with your Supabase values.
// SUPABASE_URL should look like: https://xxxxx.supabase.co
// Do NOT add /rest/v1 at the end.
// Use the publishable key. Do NOT use the secret key in front-end code.
const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_PUBLISHABLE_KEY";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
