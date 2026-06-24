alert("APP START");
const SUPABASE_URL = "https://jmjhfqkqcjzhuuojvkyu.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptamhmcWtxY2p6aHV1b2p2a3l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMDgzMDcsImV4cCI6MjA5Nzg4NDMwN30.opuxBE74VTBcvbyJ-7wQ7ybqZoAzRs5VqmLAlmCQeGg";

const supabase =
window.supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);

async function registerUser(){

const username =
document.getElementById("username").value;

const password =
document.getElementById("password").value;

if(!username || !password){
alert("تمام فیلدها را پر کنید");
return;
}

const { error } =
await supabase
.from("users")
.insert([
{
username,
password,
points:0,
balance:100,
correct_predictions:0
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
await supabase
.from("users")
.select("*")
.eq("username",username)
.eq("password",password)
.single();

if(error || !data){
alert("نام کاربری یا رمز اشتباه است");
return;
}

localStorage.setItem(
"user",
JSON.stringify(data)
);

showDashboard(data);

}

function logout(){

localStorage.removeItem("user");

location.reload();

}
function showDashboard(user){

document.body.innerHTML = `

<div class="dashboard"><div class="top-card">
<h2>🏆 COP2026 GOLD</h2>
<p>خوش آمدی ${user.username}</p>
</div><div class="stats-grid"><div class="stat-card">
<h3>امتیاز کل</h3>
<p>${user.points || 0}</p>
</div><div class="stat-card">
<h3>رتبه جهانی</h3>
<p id="rank">...</p>
</div><div class="stat-card">
<h3>COP2026 BANK</h3>
<p>${user.balance || 0} Coin</p>
</div><div class="stat-card">
<h3>پیش بینی صحیح</h3>
<p>${user.correct_predictions || 0}</p>
</div></div><h2>⚽ مسابقات</h2><div id="todayMatches"></div><h2>🏅 لیدربورد</h2><div id="leaderboard"></div><button onclick="logout()">
خروج
</button></div>`;

loadMatches();
loadLeaderboard();

}

async function loadMatches(){

const { data,error } =
await supabase
.from("matches")
.select("*")
.order("match_time");

if(error){
console.log(error);
return;
}

const container =
document.getElementById("todayMatches");

container.innerHTML = "";

data.forEach(match=>{

container.innerHTML += `

<div class="match-card"><h3>
${match.team1}
VS
${match.team2}
</h3><p>
امتیاز مسابقه:
${match.points}
</p><input
id="h${match.id}"
type="number"
placeholder="گل میزبان">

<input
id="a${match.id}"
type="number"
placeholder="گل مهمان">

<button
onclick="predict(${match.id})">

ثبت پیش بینی

</button></div>`;

});

}

async function loadLeaderboard(){

const { data } =
await supabase
.from("users")
.select("*")
.order("points",{ascending:false})
.limit(20);

const board =
document.getElementById("leaderboard");

board.innerHTML = "";

data.forEach((u,index)=>{

board.innerHTML += `

<p>
${index+1}
-
${u.username}
(
${u.points}
امتیاز
)
</p>
`;});

}
async function predict(matchId){

const home =
document.getElementById("h${matchId}").value;

const away =
document.getElementById("a${matchId}").value;

const currentUser =
JSON.parse(
localStorage.getItem("user")
);

if(!home || !away){
alert("نتیجه را وارد کنید");
return;
}

const { error } =
await supabase
.from("predictions")
.insert([
{
user_id: currentUser.id,
match_id: matchId,
predicted_home: parseInt(home),
predicted_away: parseInt(away)
}
]);

if(error){
alert(error.message);
return;
}

alert("✅ پیش بینی ثبت شد");

}

async function transferCoins(){

const receiverUsername =
document.getElementById("receiver").value;

const amount =
parseInt(
document.getElementById("amount").value
);

const currentUser =
JSON.parse(
localStorage.getItem("user")
);

const { data: receiver } =
await supabase
.from("users")
.select("*")
.eq("username",receiverUsername)
.single();

if(!receiver){
alert("کاربر پیدا نشد");
return;
}

if(currentUser.balance < amount){
alert("موجودی کافی نیست");
return;
}

await supabase
.from("transactions")
.insert([
{
sender_id: currentUser.id,
receiver_id: receiver.id,
amount: amount,
description: "COP2026 BANK"
}
]);

await supabase
.from("users")
.update({
balance:
currentUser.balance - amount
})
.eq("id",currentUser.id);

await supabase
.from("users")
.update({
balance:
receiver.balance + amount
})
.eq("id",receiver.id);

alert("✅ انتقال موفق");

}

async function loadTransactions(){

const currentUser =
JSON.parse(
localStorage.getItem("user")
);

const { data } =
await supabase
.from("transactions")
.select("*")
.or(
"sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}"
)
.order("id",{ascending:false});

console.log(data);

}

window.onload = ()=>{

const savedUser =
localStorage.getItem("user");

if(savedUser){

showDashboard(
JSON.parse(savedUser)
);

}

};
