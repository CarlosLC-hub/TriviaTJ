let currentMode = "classic";

/* ===== UTILIDAD CENTRAL ===== */
function hideAllScreens(){
  document.querySelectorAll(".pantalla").forEach(p => {
    p.classList.remove("activa");
  });
}

/* ===== MENÚS ===== */
function showModeMenu(){
  hideAllScreens();
  document.getElementById("modeMenu").classList.add("activa");
}

function backToMain(){
  hideAllScreens();
  document.getElementById("mainMenu").classList.add("activa");
}

function backToModes(){
  hideAllScreens();
  document.getElementById("modeMenu").classList.add("activa");
}

/* ===== SELECCIÓN DE MODO ===== */
function selectMode(mode){
  currentMode = mode;
  hideAllScreens();
  document.getElementById("menu").classList.add("activa");
}

/* ===== ENGANCHE CON TU JUEGO ===== */
/* Se llama desde chooseDifficulty */
function startGameScreen(){
  hideAllScreens();
  document.getElementById("game").classList.add("activa");
}

/* ===== FINAL ===== */
function showEndScreen(){
  hideAllScreens();
  document.getElementById("end").classList.add("activa");
}
