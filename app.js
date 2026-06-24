const SUPABASE_URL = "https://jmjhfqkqcjzhuuojvkyu.supabase.co";
const SUPABASE_KEY = "ANON_KEY_HERE";

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
