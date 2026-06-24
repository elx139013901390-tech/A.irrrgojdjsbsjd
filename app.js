const SUPABASE_URL = "https://jmjhfqkqcjzhuuojvkyu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptamhmcWtxY2p6aHV1b2p2a3l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMDgzMDcsImV4cCI6MjA5Nzg4NDMwN30.opuxBE74VTBcvbyJ-7wQ7ybqZoAzRs5VqmLAlmCQeGg";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

async function loadMatches() {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .order("match_time");

  if (error) {
    console.log(error);
    return;
  }

  const container = document.getElementById("matches");

  container.innerHTML = "";

  data.forEach(match => {
    container.innerHTML += `
      <div class="match-card">
        <h3>${match.team1} VS ${match.team2}</h3>
        <p>امتیاز مسابقه: ${match.points}</p>

        <input id="score1-${match.id}" type="number" placeholder="${match.team1}">
        <input id="score2-${match.id}" type="number" placeholder="${match.team2}">

        <button onclick="savePrediction(${match.id})">
          ثبت پیش بینی
        </button>
      </div>
    `;
  });
}

async function savePrediction(matchId) {
  const score1 =
    document.getElementById(`score1-${matchId}`).value;

  const score2 =
    document.getElementById(`score2-${matchId}`).value;

  alert(
    `پیش بینی ثبت شد: ${score1} - ${score2}`
  );
}

loadMatches();
function showDashboard(user){

document.body.innerHTML = `

<div class="dashboard"><div class="top-card">
<h2>🏆 COP2026 GOLD</h2>
<p>${user.username}</p>
</div><div class="stats-grid"><div class="stat-card">
<h3>امتیاز کل</h3>
<p>${user.points || 0}</p>
</div><div class="stat-card">
<h3>رتبه جهانی</h3>
<p>#1</p>
</div><div class="stat-card">
<h3>COP2026 BANK</h3>
<p>${user.balance || 0} Coin</p>
</div><div class="stat-card">
<h3>پیش‌بینی صحیح</h3>
<p>${user.correct_predictions || 0}</p>
</div></div><div id="todayMatches"></div><div id="leaderboard"></div><button onclick="logout()">خروج</button>

</div>`;

loadMatches();
loadLeaderboard();

}

async function loadMatches(){

const { data } = await supabase
.from("matches")
.select("*");

const container =
document.getElementById("todayMatches");

container.innerHTML = data.map(match => `

<div class="match-card"><h3>${match.team1} VS ${match.team2}</h3><input type="number" id="h${match.id}" placeholder="گل میزبان"><input type="number" id="a${match.id}" placeholder="گل مهمان"><button onclick="predict(${match.id})">
ثبت پیش‌بینی
</button></div>`).join("");

}

async function loadLeaderboard(){

const { data } = await supabase
.from("users")
.select("*")
.order("points",{ascending:false})
.limit(20);

const board =
document.getElementById("leaderboard");

board.innerHTML =
"<h2>🏅 لیدربورد جهانی</h2>" +
data.map((u,i)=>
"<p>${i+1}. ${u.username} - ${u.points}</p>"
).join("");

}
async function predict(matchId){

const home =
document.getElementById("h${matchId}").value;

const away =
document.getElementById("a${matchId}").value;

const currentUser =
JSON.parse(localStorage.getItem("user"));

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

alert("✅ پیش‌بینی ثبت شد");

}
async function transferCoins(receiverUsername, amount){

const currentUser =
JSON.parse(localStorage.getItem("user"));

const { data: receiver } =
await supabase
.from("users")
.select("*")
.eq("username", receiverUsername)
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
description: "COP2026 BANK Transfer"
}
]);

await supabase
.from("users")
.update({
balance: currentUser.balance - amount
})
.eq("id", currentUser.id);

await supabase
.from("users")
.update({
balance: receiver.balance + amount
})
.eq("id", receiver.id);

alert("✅ انتقال موفق");
}
