// ==== VARIABLES ====
let index = 0;
let score = 0;
let lives = 3;
let time = 0;
let timer;
let correctAnswers = 0;
let timePerQuestion = 15;
let maxQuestions = 15;
let selectedQuestions = [];
let lastSecondPlayed = null;

const pointsPerQuestion = 10;
let maxScore = 0;

// ==== WEB AUDIO API para beep de 0.3s ====
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let audioUnlocked = false;
function unlockAudio() {
  if (!audioUnlocked) {
    audioCtx.resume().then(() => { audioUnlocked = true; });
  }
}
function playTick(frequency = 1000, duration = 0.3, volume = 0.3) {
  unlockAudio();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gainNode.gain.value = volume;

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
}

// ==== SONIDOS ====
const soundCorrect = new Audio("sounds/correct.mp3");
const soundWrong = new Audio("sounds/wrong.mp3");
const soundVictory = new Audio("sounds/victory.mp3");
const soundGameOver = new Audio("sounds/gameover.mp3");
const soundContinue = new Audio("sounds/continue.mp3");

soundCorrect.volume = 0.6;
soundWrong.volume = 0.6;
soundVictory.volume = 0.7;
soundGameOver.volume = 0.7;
soundContinue.volume = 0.7;

// ==== SELECCIONAR DIFICULTAD ====
function chooseDifficulty(level){
  if(level === "facil"){ timePerQuestion = 20; maxQuestions = 15; }
  if(level === "media"){ timePerQuestion = 15; maxQuestions = 15; }
  if(level === "dificil"){ timePerQuestion = 15; maxQuestions = 20; }

  selectedQuestions = questions
    .filter(q => q.difficulty === level)
    .sort(() => Math.random() - 0.5)
    .slice(0, maxQuestions);

  document.getElementById("menu").classList.remove("activa");
  startGame();
}

// ==== INICIAR JUEGO ====
function startGame() {
  index = 0;
  score = 0;
  lives = 3;
  correctAnswers = 0;

  maxScore = selectedQuestions.length * pointsPerQuestion;

  document.getElementById("game").classList.add("activa");
  updateLives();
  document.getElementById("score").innerText = score;

  loadQuestion();
}

// ==== CARGAR PREGUNTA ====
function loadQuestion() {
  if(index >= selectedQuestions.length || lives <= 0){
    endGame();
    return;
  }

  time = timePerQuestion;
  lastSecondPlayed = null;

  const q = selectedQuestions[index];
  let options = q.a.map((text, i) => ({ text, originalIndex: i }));
  options.sort(() => Math.random() - 0.5);
  const correctIndex = options.findIndex(o => o.originalIndex === q.c);

  document.getElementById("question").innerHTML = q.q;

  const answers = document.getElementById("answers");
  answers.innerHTML = "";

  options.forEach((o, i) => {
    const btn = document.createElement("button");
    btn.innerText = o.text;
    btn.onclick = () => checkAnswer(i, btn, correctIndex);
    answers.appendChild(btn);
  });

  startTimer();
}

// ==== TEMPORIZADOR ====
function startTimer(){
  clearInterval(timer);
  const tick = 50;
  let gradientPos = 0;

  timer = setInterval(()=>{
    time -= tick / 1000;
    const currentSecond = Math.ceil(time);

    if(currentSecond <= 5 && currentSecond > 0 && currentSecond !== lastSecondPlayed){
      playTick();
      lastSecondPlayed = currentSecond;
    }

    if(time <= 0){
      clearInterval(timer);
      lives--;
      updateLives();
      // Sonido de error por tiempo
      soundWrong.currentTime = 0;
      soundWrong.play();
      index++;
      loadQuestion();
      return;
    }

    gradientPos += 2;
    updateTimeBar(gradientPos);
  }, tick);
}

// ==== BARRA DE TIEMPO ====
function updateTimeBar(gradientPos = 0){
  const bar = document.getElementById("tiempo-barra");
  const widthPercent = (time / timePerQuestion) * 100;
  bar.style.width = widthPercent + "%";

  let colorStart, colorEnd;
  if(widthPercent > 60){ colorStart = "lime"; colorEnd = "#00ffcc"; }
  else if(widthPercent > 30){ colorStart = "yellow"; colorEnd = "#ffcc00"; }
  else{ colorStart = "red"; colorEnd = "#ff4444"; }

  bar.style.background = `linear-gradient(90deg, ${colorStart} ${gradientPos}%, ${colorEnd} ${gradientPos + 40}%)`;
  bar.innerText = Math.ceil(time) + "s";
  bar.style.fontWeight = "bold";
}

// ==== VERIFICAR RESPUESTA ====
function checkAnswer(i, btn, correctIndex){
  clearInterval(timer);

  if(i === correctIndex){
    score += pointsPerQuestion;
    correctAnswers++;
    btn.classList.add("correct");
    soundCorrect.currentTime = 0;
    soundCorrect.play();
  } else {
    lives--;
    btn.classList.add("wrong");
    soundWrong.currentTime = 0;
    soundWrong.play();
  }

  score = Math.max(0, score);
  updateLives();
  document.getElementById("score").innerText = score;

  setTimeout(()=>{
    index++;
    loadQuestion();
  }, 800);
}

// ==== VIDAS ====
function updateLives(){
  document.getElementById("vidas").innerText = "❤️".repeat(lives);
}

// ==== FINAL DEL JUEGO ====
function endGame(){
  clearInterval(timer);
  document.getElementById("game").classList.remove("activa");
  document.getElementById("end").classList.add("activa");

  let endMessage = "";

  if(lives <= 0){
    endMessage = "💀 GAME OVER";
    soundGameOver.currentTime = 0;
    soundGameOver.play();
  } else if(correctAnswers === selectedQuestions.length){
    endMessage = "🏆 VICTORIA";
    soundVictory.currentTime = 0;
    soundVictory.play();
  } else {
    endMessage = "✏️ SIGUE PARTICIPANDO";
    soundContinue.currentTime = 0;
    soundContinue.play();
  }

  document.getElementById("endTitle").innerText = endMessage;

  // Puntuación
  document.getElementById("finalScore").innerText = `Puntuación: ${score} de ${maxScore}`;

  // Porcentaje
  const percentage = Math.round((score / maxScore) * 100);
  document.getElementById("percentage").innerText = `Resultado: ${percentage}%`;

  // ⭐ Estrellas (máx 10)
  const starsCount = Math.round((percentage / 100) * 10);
  document.getElementById("stars").innerText = "⭐".repeat(starsCount) + "☆".repeat(10 - starsCount);
}

// ==== SERVICE WORKER ====
if("serviceWorker" in navigator){
  navigator.serviceWorker.register("service-worker.js")
    .then(()=>console.log("Service Worker registrado"))
    .catch(err=>console.log("Error SW:", err));
}

// Desbloquear Web Audio API al primer click
document.addEventListener("click", unlockAudio, { once: true });
