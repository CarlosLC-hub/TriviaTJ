/* ================= VARIABLES GLOBALES ================= */
let pendingQuestions = [];
let reservePool = [];

let currentQuestion = null;
let questionNumber = 0;
let totalQuestions = 0;

let correct = 0;
let wrong = 0;

let combo = 0;
let comboActive = false;
let powerUpGranted = false;

let swapUses = 2;
let eliminateUses = 1;

/* ================= SONIDOS ================= */
const correctSound = new Audio("../sounds/correct.mp3");
const wrongSound = new Audio("../sounds/wrong.mp3");
const swapSound = new Audio("../sounds/swap-q.mp3");
const eliminateSound = new Audio("../sounds/eliminate-op.mp3");
const endZenSound = new Audio("../sounds/end-zen.mp3"); // sonido suave al final


/* ================= UTILIDADES ================= */
const $ = id => document.getElementById(id);

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function playSound(audio) {
  const sound = audio.cloneNode();
  sound.currentTime = 0;
  sound.play();
}

function floatingMsg(text) {
  const msg = document.createElement("div");
  msg.className = "floating-msg";
  msg.textContent = text;
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 1200);
}

/* ================= NAVEGACIÓN ================= */
function show(id) {
  document.querySelectorAll(".pantalla")
    .forEach(p => p.classList.remove("activa"));
  $(id).classList.add("activa");
}

function goToAmount() {
  show("amountMenu");
}

function backToMain() {
  show("mainMenu");
}

/* ================= INICIO DEL JUEGO ================= */
function startGame(amount) {
  totalQuestions = amount;
  questionNumber = 0;
  correct = 0;
  wrong = 0;

  combo = 0;
  comboActive = false;
  powerUpGranted = false;

  swapUses = 2;
  eliminateUses = 1;

  buildQuestionBank(amount);
  updatePowerUps();

  show("game");
  nextQuestion();
}

/* ================= BANCO DE PREGUNTAS ================= */
function buildQuestionBank(amount) {
  const f = Math.round(amount * 0.4);
  const m = Math.round(amount * 0.35);
  const d = amount - f - m;

  const selected = shuffle([
    ...shuffle([...questionsFacil]).slice(0, f),
    ...shuffle([...questionsMedia]).slice(0, m),
    ...shuffle([...questionsDificil]).slice(0, d)
  ]);

  pendingQuestions = [...selected];

  /* pool de respaldo para swap */
  reservePool = shuffle([
    ...questionsFacil,
    ...questionsMedia,
    ...questionsDificil
  ]);
}

/* ================= SIGUIENTE PREGUNTA ================= */
function nextQuestion(fromSwap = false) {
  if (!fromSwap && questionNumber >= totalQuestions) {
    endGame();
    return;
  }

  if (!fromSwap) questionNumber++;

  // Obtener siguiente pregunta
  if (!fromSwap) {
    currentQuestion = pendingQuestions.shift();
  }

  if (!currentQuestion) {
    // fallback seguro
    currentQuestion = reservePool.find(q => !pendingQuestions.includes(q)) || reservePool[0];
  }

  $("counter").textContent = `Pregunta ${questionNumber}`;
  renderCombo();
  renderQuestion();
  updatePowerUps();
}

/* ================= RENDER DE PREGUNTA ================= */
function renderQuestion() {
  if (!currentQuestion) return;

  $("question").innerHTML = currentQuestion.q;

  const answers = $("answers");
  answers.innerHTML = "";

  shuffle(
    currentQuestion.a.map((text, index) => ({ text, index }))
  ).forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt.text;
    btn.onclick = () => checkAnswer(opt.index, btn);
    answers.appendChild(btn);
  });
}

/* ================= COMPROBAR RESPUESTA ================= */
function checkAnswer(index, btn) {
  const buttons = document.querySelectorAll("#answers button");
  buttons.forEach(b => b.disabled = true);

  if (index === currentQuestion.c) {
    btn.classList.add("correct");
    playSound(correctSound);
    floatingMsg("🥳 ¡Correcto!");
    correct++;

    if (!powerUpGranted) {
      combo = comboActive ? combo + 1 : 1;
      comboActive = true;

      if (combo === 5) {
        eliminateUses++;
        powerUpGranted = true;
        comboActive = false;

        $("powerMsg").textContent = "Has obtenido un power-up de reducir opciones";
        setTimeout(() => $("powerMsg").textContent = "", 2000);

        updatePowerUps();
      }
    }

  } else {
    btn.classList.add("wrong");
    playSound(wrongSound);
    floatingMsg("😢 Incorrecto");
    wrong++;

    combo = 0;
    comboActive = false;
  }

  renderCombo();
  setTimeout(() => nextQuestion(), 900);
}

/* ================= RENDER COMBO ================= */
function renderCombo() {
  const comboEl = $("combo");

  if (!comboActive || powerUpGranted || combo === 0) {
    comboEl.style.display = "none";
    comboEl.classList.remove("activo");
    return;
  }

  comboEl.style.display = "inline";
  comboEl.textContent = `🔥x${combo}`;
  comboEl.classList.add("activo");
}

/* ================= POWER-UPS ================= */
function updatePowerUps() {
  $("swapBtn").textContent = `🔄 Cambiar pregunta (${swapUses})`;
  $("eliminateBtn").textContent = `❌ Reducir opciones (${eliminateUses})`;

  $("swapBtn").disabled = swapUses <= 0;
  $("eliminateBtn").disabled = eliminateUses <= 0;
}

function swapQuestion() {
  if (swapUses <= 0) return;

  swapUses--;
  playSound(swapSound);
  floatingMsg("🔄 Pregunta cambiada");

  let replacement = null;

  if (pendingQuestions.length > 0) {
    replacement = pendingQuestions.shift();
  } else {
    replacement = reservePool.find(q => q.q !== currentQuestion.q) || currentQuestion;
  }

  currentQuestion = replacement;
  renderQuestion();
  updatePowerUps();
}

function eliminateOptions() {
  if (eliminateUses <= 0) return;

  eliminateUses--;
  playSound(eliminateSound);
  floatingMsg("❌ Opciones reducidas");

  const buttons = Array.from(document.querySelectorAll("#answers button"));

  const correctText = currentQuestion.a[currentQuestion.c];
  const correctBtn = buttons.find(b => b.textContent === correctText);
  const wrongBtns = buttons.filter(b => b !== correctBtn);

  shuffle(wrongBtns);

  // Dejar UNA incorrecta activa, desactivar el resto
  wrongBtns.slice(1).forEach(b => {
    b.disabled = true;
    b.classList.add("disabled-option");
  });

  updatePowerUps();
}

/* ================= FIN DEL JUEGO ================= */
function endGame() {
  const percent = Math.round((correct / totalQuestions) * 100);
  let emoji = "😢";

  if (percent === 100) {
    emoji = "🏆🥇🏆";

  } else if (percent >= 80) {
    emoji = "🎉🥈🎉";

  } else if (percent >= 60) {
    emoji = "😕🥉😕";
  }

  $("resultEmoji").textContent = emoji;
  $("resultText").textContent = `Resultado: ${percent}%`;
  $("resultStats").textContent = `Aciertos: ${correct} | Errores: ${wrong}`;

  show("result");

  // 🎵 sonido final zen
  playSound(endZenSound);
}

