const SUPABASE_URL =
"https://mohqgbqgzuffbaazqyfg.supabase.co";

const SUPABASE_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vaHFnYnFnenVmZmJhYXpxeWZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMTM4MjEsImV4cCI6MjA5Nzg4OTgyMX0.jwvtramJ8ObtFLmqWRmd9m2jx__16395znhvBFFMlrs";

alert("APP LOADED");

const supabase =
window.supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);

async function registerUser() {

alert("ثبت نام کلیک شد");

try {

const username =
document.getElementById("username").value;

const password =
document.getElementById("password").value;

if (!username || !password) {
alert("نام کاربری و رمز عبور را وارد کنید");
return;
}

const { data, error } =
await supabase
.from("users")
.insert([
{
username,
password
}
])
.select();

if (error) {
alert("ERROR: " + error.message);
return;
}

alert("✅ ثبت نام موفق");

} catch(e) {

alert("JS ERROR: " + e.message);

}

}

async function login() {

alert("ورود کلیک شد");

}
