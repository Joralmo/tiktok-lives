function updateClock () {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);
updateClock();

let countdown;
let remainingTime = 0;
let isPaused = false;

const input = document.getElementById('secondsInput');
const countdownDisplay = document.getElementById('countdown');
const alarm = document.getElementById('alarmSound');

document.getElementById('startBtn').addEventListener('click', () => {
  if (countdown) clearInterval(countdown);

  let seconds = parseInt(input.value);

  if (!seconds || seconds <= 0) {
    alert('Por favor, ingresa un número válido de segundos');
    return;
  }

  remainingTime = seconds;
  isPaused = false;

  countdown = setInterval(() => {
    if (!isPaused && remainingTime > 0) {
      remainingTime--;
      countdownDisplay.textContent = remainingTime + "s";
    } else if (remainingTime === 0) {
      clearInterval(countdown);
      countdownDisplay.textContent = 'Tiempo terminado';
      alarm.play();
    }
  }, 1000);
});

document.getElementById('pauseBtn').addEventListener('click', () => {
  isPaused = !isPaused;
  document.getElementById('pauseBtn').textContent = isPaused ? 'Reanudar' : 'Pausar';
});

document.getElementById('resetBtn').addEventListener('click', () => {
  clearInterval(countdown);
  countdownDisplay.textContent = '--';
  input.value = '';
  isPaused = false;
  alarm.pause();
  alarm.currentTime = 0;
});
