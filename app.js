const { createClient } = supabase;

const db = createClient(
"https://jmjhfqkqcjzhuuojvkyu.supabase.co",
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptamhmcWtxY2p6aHV1b2p2a3l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMDgzMDcsImV4cCI6MjA5Nzg4NDMwN30.opuxBE74VTBcvbyJ-7wQ7ybqZoAzRs5VqmLAlmCQeGg"
);

async function registerUser(){

const username =
document.getElementById("username").value;

const password =
document.getElementById("password").value;

const { error } = await db
.from("users")
.insert([
{
username,
password
}
]);

if(error){
alert(error.message);
return;
}

alert("ثبت نام موفق");

}

async function login(){

const username =
document.getElementById("username").value;

const password =
document.getElementById("password").value;

const { data,error } =
await db
.from("users")
.select("*")
.eq("username",username)
.eq("password",password);

if(error){
alert(error.message);
return;
}

if(!data.length){
alert("نام کاربری یا رمز اشتباه است");
return;
}

localStorage.setItem(
"userId",
data[0].id
);

localStorage.setItem(
"username",
data[0].username
);

alert("ورود موفق");

}
