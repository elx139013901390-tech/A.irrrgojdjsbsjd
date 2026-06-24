const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://uvtvybpmpuiedjhmxkes.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2dHZ5YnBtcHVpZWRqaG14a2VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMDE0NTYsImV4cCI6MjA5Nzg3NzQ1Nn0.bME9cKnKtjE2lcRScEzQjSuWI02IZpv374cH24EJtm8"
);

module.exports = supabase;
