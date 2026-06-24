const SUPABASE_URL =
"https://aorhzgfyntfybfovocle.supabase.co";

const SUPABASE_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvcmh6Z2Z5bnRmeWJmb3ZvY2xlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMTc4NjgsImV4cCI6MjA5Nzg5Mzg2OH0.5SAW3uwc8rJFz-mzvbLzf5TFFr2cQU82yJN_t_LotOg";

const supabase =
window.supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);

async function registerUser(){

alert("دکمه ثبت نام کار میکند");

}

async function login(){

alert("دکمه ورود کار میکند");

}
