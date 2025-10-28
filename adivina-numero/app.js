const els = {
  difficulty: document.getElementById('difficulty'),
  playerName: document.getElementById('playerName'),
  guessInput: document.getElementById('guessInput'),
  tryBtn: document.getElementById('tryBtn'),
  resetBtn: document.getElementById('resetBtn'),
  message: document.getElementById('message'),
  status: document.getElementById('status'),
  stats: document.getElementById('stats'),
  rankingList: document.getElementById('rankingList'),
}

const RANKING_KEY = 'gn_ranking_v1';
let target = null;
let min = 1;
let max = 100;
let attempts = 0;
let startTime = 0;
let finished = false;

const randInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const nowMs = () => performance.now();

function getRanking() {
  try {
    return JSON.parse(localStorage.getItem(RANKING_KEY)) || [];
  } catch {
    return [];
  }
}

function saveRanking(ranking) {
  localStorage.setItem(RANKING_KEY, JSON.stringify(ranking));
}

function formatTime(ms) {
  return (ms / 1000).toFixed(1) + 's';
}


function renderRanking() {
  const ranking = getRanking();
  els.rankingList.innerHTML = '';
  if (ranking.length === 0) {
    els.rankingList.innerHTML = '<li class="muted">No hay registros aún.</li>';
    return;
  }
  ranking.forEach((entry, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<b>${i + 1}.</b> ${entry.name || 'Anónimo'} - ${entry.attempts} intentos - ${formatTime(entry.ms)} - ${entry.rangeLabel}`;
    els.rankingList.appendChild(li);
  });
}

function pushRanking({name, attempts, ms, rangeLabel }) {
  const ranking = getRanking();
  ranking.push({ name, attempts, ms, rangeLabel });
  ranking.sort((a, b) => {
    if (a.attempts !== b.attempts) {
      return a.attempts - b.attempts;
    }
    return a.ms - b.ms;
  });
  saveRanking(ranking.slice(0, 5));
}

function heatClass(diff) {
  if (diff <= Math.ceil((max - min) * 0.02)) return 'hot';
  if (diff <= Math.ceil((max - min) * 0.08)) return 'warm';
  return 'cold';
}

function updateStats(extraMs = 0) {
  const t = finished ? extraMs : nowMs() - startTime;
  els.stats.textContent = `Intentos: ${attempts} • Rango: ${min}-${max} • Tiempo: ${formatTime(t)}`;
}

function paintStatusByDiff(diff) {
  const cls = heatClass(diff);
  els.status.classList.remove('hot', 'warm', 'cold');
  els.status.classList.add(cls);
}

function resetGame(updateRageFromSelect = false) {
  if (updateRageFromSelect) {
    max = parseInt(els.difficulty.value, 10);
  }
  min = 1;
  target = randInt(min, max);
  attempts = 0;
  startTime = nowMs();
  finished = false;
  els.guessInput.value = '';
  els.guessInput.disabled = false;
  els.tryBtn.disabled = false;
  els.message.textContent = `Estoy pensando un número entre ${min} y ${max}… ¡intenta adivinarlo!`;
  els.status.classList.remove('hot', 'warm', 'cold');
  updateStats();
  els.guessInput.focus();
}

function handleGuess() {
  if (finished) return;
  const val = parseInt(els.guessInput.value, 10);
  if (Number.isNaN(val)) {
    els.message.textContent = 'Por favor, ingresa un número válido.';
    return;
  }

  if(val < min || val > max) {
    els.message.textContent = `Fuera de rango. Por favor, ingresa un número entre ${min} y ${max}.`;
    return;
  }

  attempts += 1;
  const diff = Math.abs(target - val);
  paintStatusByDiff(diff);

  if (val === target) {
    finished = true;
    const total = nowMs() - startTime;
    els.message.textContent = `¡Felicidades${els.playerName.value ? ', ' + els.playerName.value : ''}! ¡Adivinaste el número ${target} en ${attempts} intentos y ${formatTime(total)}!`;
    els.guessInput.disabled = true;
    els.tryBtn.disabled = true;
    updateStats(total);
    
    const name = els.playerName.value.trim() || 'Anónimo';
    const rangeLabel = `${min}-${max}`;
    pushRanking({ name, attempts, ms: total, rangeLabel });
  } else if (val < target) {
    els.message.textContent = '🔼 Más alto';
  } else {
    els.message.textContent = '🔽 Más bajo';
  }

  els.guessInput.select();
  updateStats();
}

els.tryBtn.addEventListener('click', handleGuess);
els.guessInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleGuess();
});
els.resetBtn.addEventListener('click', resetGame(false));
els.difficulty.addEventListener('change', () => resetGame(true));

renderRanking();
resetGame(true);