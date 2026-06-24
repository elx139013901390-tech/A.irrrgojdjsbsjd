const SUPABASE_URL =
"https://mohqgbqgzuffbaazqyfg.supabase.co";

const SUPABASE_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vaHFnYnFnenVmZmJhYXpxeWZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMTM4MjEsImV4cCI6MjA5Nzg4OTgyMX0.jwvtramJ8ObtFLmqWRmd9m2jx__16395znhvBFFMlrs";

const supabase =
window.supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);

async function registerUser(){

const username =
document.getElementById("username").value.trim();

const password =
document.getElementById("password").value.trim();

if(!username || !password){
alert("نام کاربری و رمز عبور را وارد کنید");
return;
}

const { error } =
await supabase
.from("users")
.insert([
{
username: username,
password: password
}
]);

if(error){
alert(error.message);
return;
}

alert("✅ ثبت نام موفق");
}

async function login(){

const username =
document.getElementById("username").value.trim();

const password =
document.getElementById("password").value.trim();

const { data,error } =
await supabase
.from("users")
.select("*")
.eq("username",username)
.eq("password",password)
.single();

if(error || !data){
alert("نام کاربری یا رمز عبور اشتباه است");
return;
}

localStorage.setItem(
"user",
JSON.stringify(data)
);

alert("✅ ورود موفق");
}
