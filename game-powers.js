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

// Uso de power-ups
function usePowerUp(type) {
  if (powerUps[type] <= 0) return;

  powerUps[type]--;
  updatePowerUpsDisplay();

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
}

// Animación visual de +5 segundos
function animateExtraTime() {
  const msg = document.createElement("div");
  msg.className = "floating-message power-up";
  msg.innerText = "+5 segundos ⏱️";
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 1200);
}

// Función para eliminar opciones dejando solo 2: la correcta y una incorrecta al azar
function removeToTwoOptionsWithAnimation() {
  const answers = Array.from(document.getElementById("answers").children);
  const correctBtn = answers.find(btn => btn.dataset.correct === "true");
  const wrongBtns = answers.filter(btn => btn.dataset.correct !== "true" && !btn.disabled);

  if (wrongBtns.length === 0) return;

  // Elegir solo un botón incorrecto al azar para dejarlo
  const keepBtn = wrongBtns[Math.floor(Math.random() * wrongBtns.length)];

  // Deshabilitar los demás botones incorrectos
  wrongBtns.forEach(btn => {
    if (btn !== keepBtn) {
      btn.disabled = true;
      btn.style.opacity = "0.3";
    }
  });

  // Animación flotante
  const msg = document.createElement("div");
  msg.className = "floating-message power-up";
  msg.innerText = "Opciones reducidas ❌";
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 1200);
}

// Ocultar power-ups al finalizar el juego
function hidePowerUps() {
  const container = document.getElementById("power-ups");
  container.style.display = "none";
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
  if (powerUps.swapQuestion <= 0) return;

  powerUps.swapQuestion--;
  updatePowerUpsDisplay(); 

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
}

// Función para identificar la categoría de la pregunta
function getQuestionCategory(q){
  if(questionsFacil.includes(q)) return questionsFacil;
  if(questionsMedia.includes(q)) return questionsMedia;
  if(questionsDificil.includes(q)) return questionsDificil;
  if(prueba.includes(q)) return prueba;
  return [];
}
