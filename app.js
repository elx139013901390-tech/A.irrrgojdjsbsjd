const SUPABASE_URL = "https://jmjhfqkqcjzhuuojvkyu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptamhmcWtxY2p6aHV1b2p2a3l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMDgzMDcsImV4cCI6MjA5Nzg4NDMwN30.opuxBE74VTBcvbyJ-7wQ7ybqZoAzRs5VqmLAlmCQeGg";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

async function registerUser() {

  const username =
    document.getElementById("username").value;

  const password =
    document.getElementById("password").value;

  if (!username || !password) {
    alert("نام کاربری و رمز عبور را وارد کنید");
    return;
  }

  const { error } = await supabase
    .from("users")
    .insert([
      {
        username: username,
        password: password,
        points: 0,
        balance: 1000,
        correct_predictions: 0
      }
    ]);

  if (error) {
    alert(error.message);
    return;
  }

  alert("✅ ثبت نام موفق");
}

async function login() {

  const username =
    document.getElementById("username").value;

  const password =
    document.getElementById("password").value;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (error || !data) {
    alert("نام کاربری یا رمز اشتباه است");
    return;
  }

  localStorage.setItem(
    "user",
    JSON.stringify(data)
  );

  alert("✅ ورود موفق");
}
