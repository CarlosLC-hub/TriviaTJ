// ==== CONTADORES DE POWER-UPS ====
let powerUps = {
  extraTime: 2,
  removeOption: 1
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

  extraBtn.innerText = `⏱️ +5s (${powerUps.extraTime})`;
  removeBtn.innerText = `❌ -1 opción (${powerUps.removeOption})`;

  extraBtn.disabled = powerUps.extraTime <= 0;
  removeBtn.disabled = powerUps.removeOption <= 0;

  extraBtn.style.opacity = powerUps.extraTime > 0 ? "1" : "0.4";
  removeBtn.style.opacity = powerUps.removeOption > 0 ? "1" : "0.4";
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
      removeRandomWrongOptionWithAnimation();
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

// Función para eliminar solo opciones incorrectas con animación
function removeRandomWrongOptionWithAnimation() {
  const answers = document.getElementById("answers").children;
  const wrongBtns = [];

  for(let btn of answers){
    if(btn.dataset.correct !== "true" && !btn.disabled){
      wrongBtns.push(btn);
    }
  }

  if(wrongBtns.length === 0) return;

  const toRemove = wrongBtns[Math.floor(Math.random() * wrongBtns.length)];
  toRemove.disabled = true;
  toRemove.style.opacity = "0.3";

  // Animación flotante
  const msg = document.createElement("div");
  msg.className = "floating-message power-up";
  msg.innerText = "Opción eliminada ❌";
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
  showPowerUps();
}
