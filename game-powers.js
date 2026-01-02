// ==== CONTADORES DE POWER-UPS ====
let powerUps = {
  extraTime: 2,
  removeOption: 1,
  swapQuestion: 1
};

// Mostrar power-ups solo en la pantalla de juego
function showPowerUps() {
  const container = document.getElementById("power-ups");
  container.style.display = "flex";
  updatePowerUpsDisplay();
}

// Actualizar contador visual y textos de botones
function updatePowerUpsDisplay() {
  const extraBtn = document.getElementById("powerExtraTime");
  const removeBtn = document.getElementById("powerRemove");
  const swapBtn = document.getElementById("powerSwap");

  extraBtn.innerText = `⏱️ +5s (${powerUps.extraTime})`;
  removeBtn.innerText = `❌ Reducir opciones (${powerUps.removeOption})`;
  swapBtn.innerText = `🔄 Cambiar pregunta (${powerUps.swapQuestion})`;

  extraBtn.disabled = powerUps.extraTime <= 0;
  removeBtn.disabled = powerUps.removeOption <= 0;
  swapBtn.disabled = powerUps.swapQuestion <= 0;

  extraBtn.style.opacity = powerUps.extraTime > 0 ? "1" : "0.4";
  removeBtn.style.opacity = powerUps.removeOption > 0 ? "1" : "0.4";
  swapBtn.style.opacity = powerUps.swapQuestion > 0 ? "1" : "0.4";
}

// ==== USO DE POWER-UPS ====
function usePowerUp(type) {
  const btn = {
    extraTime: document.getElementById("powerExtraTime"),
    removeOption: document.getElementById("powerRemove"),
    swapQuestion: document.getElementById("powerSwap")
  }[type];

  if (powerUps[type] <= 0) return;

  powerUps[type]--;
  updatePowerUpsDisplay();
  playPowerSound(type);

  // Desactivar temporalmente hover pegado en móviles
  btn.classList.add("no-hover");
  setTimeout(() => btn.classList.remove("no-hover"), 50);

  switch(type) {
    case "extraTime":
      time = Math.min(time + 5, timePerQuestion);
      animateExtraTime();
      updateTimeBar();
      break;
    case "removeOption":
      removeToTwoOptionsWithAnimation();
      break;
  }

  document.activeElement.blur();
}

// Animación visual de +5 segundos
function animateExtraTime() {
  const msg = document.createElement("div");
  msg.className = "floating-message power-up";
  msg.innerText = "+5 segundos ⏱️";
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 1200);
}

// Función para eliminar opciones dejando solo 2
function removeToTwoOptionsWithAnimation() {
  const answers = Array.from(document.getElementById("answers").children);
  const wrongBtns = answers.filter(
    btn => btn.dataset.correct !== "true" && !btn.disabled
  );

  if (wrongBtns.length === 0) return;

  const keepBtn = wrongBtns[Math.floor(Math.random() * wrongBtns.length)];

  wrongBtns.forEach(btn => {
    if (btn !== keepBtn) {
      btn.disabled = true;
      btn.style.opacity = "0.3";
    }
  });

  const msg = document.createElement("div");
  msg.className = "floating-message power-up";
  msg.innerText = "Opciones reducidas ❌";
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 1200);
}

// Ocultar power-ups al finalizar el juego
function hidePowerUps() {
  document.getElementById("power-ups").style.display = "none";
}

// Inicializar contadores
function initPowerUps() {
  powerUps.extraTime = 2;
  powerUps.removeOption = 1;
  powerUps.swapQuestion = 1;
  showPowerUps();
}

// ==== POWER-UP: INTERCAMBIO DE PREGUNTA ====
function useSwapQuestionPowerUp() {
  const btn = document.getElementById("powerSwap");
  if (powerUps.swapQuestion <= 0) return;

  powerUps.swapQuestion--;
  updatePowerUpsDisplay();
  playPowerSound("swapQuestion");

  // Desactivar temporalmente hover pegado
  btn.classList.add("no-hover");
  setTimeout(() => btn.classList.remove("no-hover"), 50);

  const msg = document.createElement("div");
  msg.className = "floating-message power-up swap";
  msg.innerText = "¡Pregunta cambiada! 🔄";
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 1200);

  if(index < selectedQuestions.length - 1){
    const currentQuestion = selectedQuestions[index];
    const category = getQuestionCategory(currentQuestion);

    selectedQuestions.splice(index, 1);

    const availableQuestions = category.filter(q => !selectedQuestions.includes(q));
    if(availableQuestions.length > 0){
      const newQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
      selectedQuestions.splice(index, 0, newQuestion);
    }

    loadQuestion();
  }

  document.activeElement.blur();
}

// Identificar categoría
function getQuestionCategory(q) {
  if (questionsFacil.includes(q)) return questionsFacil;
  if (questionsMedia.includes(q)) return questionsMedia;
  if (questionsDificil.includes(q)) return questionsDificil;
  if (prueba.includes(q)) return prueba;
  return [];
}

// ==== SONIDOS DE POWER-UPS ====
let powerAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
let powerAudioUnlocked = false;
function unlockPowerAudio() {
  if (!powerAudioUnlocked) {
    powerAudioCtx.resume();
    powerAudioUnlocked = true;
  }
}

const powerSounds = {
  extraTime: new Audio("sounds/bonus-t.mp3"),
  removeOption: new Audio("sounds/eliminate-op.mp3"),
  swapQuestion: new Audio("sounds/swap-q.mp3")
};

function playPowerSound(type) {
  if (powerSounds[type]) {
    powerSounds[type].currentTime = 0;
    powerSounds[type].play();
  }
}
