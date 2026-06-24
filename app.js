const SUPABASE_URL = "https://jmjhfqkqcjzhuuojvkyu.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptamhmcWtxY2p6aHV1b2p2a3l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMDgzMDcsImV4cCI6MjA5Nzg4NDMwN30.opuxBE74VTBcvbyJ-7wQ7ybqZoAzRs5VqmLAlmCQeGg";

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
