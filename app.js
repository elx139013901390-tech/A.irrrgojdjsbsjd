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
