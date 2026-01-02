// ==== VARIABLES ====  
let index = 0;
let score = 0;
let lives = 3;
let correctAnswers = 0;
let maxQuestions = 15;
let selectedQuestions = [];
const pointsPerQuestion = 10;
let maxScore = 0;

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

// ==== COMBO ====  
let comboCount = 0;
let comboActive = false;
let comboAwarded = false;
let comboIndicator;
let powerUpMessage;

// ==== SELECCIONAR DIFICULTAD ====  
function chooseDifficulty(level){
  let allQuestions = [];
  switch(level){
    case "facil":
      timePerQuestion = 20;
      maxQuestions = 15; 
      allQuestions = questionsFacil;
      break;
    case "media":
      timePerQuestion = 15;
      maxQuestions = 15;
      allQuestions = questionsMedia;
      break;
    case "dificil":
      timePerQuestion = 15;
      maxQuestions = 20;
      allQuestions = questionsDificil;
      break;
    /*case "prueba":
      timePerQuestion = 7;
      maxQuestions = 5;
      allQuestions = prueba;
      break; */
  }

  selectedQuestions = shuffleArray([...allQuestions]).slice(0, maxQuestions);

  document.getElementById("menu").classList.remove("activa");
  startGame();
}

// ==== UTILIDADES ====  
function shuffleArray(array){
  for(let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// ==== INICIAR JUEGO ====  
function startGame() {
  index = 0;
  score = 0;
  lives = 3;
  correctAnswers = 0;
  maxScore = selectedQuestions.length * pointsPerQuestion;
  comboCount = 0;
  comboActive = false;
  comboAwarded = false;

  initPowerUps();

  document.getElementById("game").classList.add("activa");
  updateLives();
  document.getElementById("score").innerText = score;


  // Indicador de combo superior derecho
comboIndicator = document.getElementById("comboIndicator");
if(!comboIndicator){
  comboIndicator = document.createElement("div");
  comboIndicator.id = "comboIndicator";
  comboIndicator.style.position = "fixed";
  comboIndicator.style.top = "10px";       // desde arriba
  comboIndicator.style.right = "10px";     // desde la derecha
  comboIndicator.style.fontSize = "28px";
  comboIndicator.style.fontWeight = "bold";
  comboIndicator.style.color = "orange";
  comboIndicator.style.textShadow = "0 0 8px #ffcc33";
  comboIndicator.style.transform = "";     // eliminar centrado
  document.body.appendChild(comboIndicator);
}
comboIndicator.style.display = "none";
comboIndicator.className = "";


  // Mensaje de power-up ganado debajo de las opciones
  powerUpMessage = document.getElementById("powerUpMessage");
  if(!powerUpMessage){
    powerUpMessage = document.createElement("div");
    powerUpMessage.id = "powerUpMessage";
    powerUpMessage.style.fontSize = "24px";
    powerUpMessage.style.fontWeight = "bold";
    powerUpMessage.style.color = "yellow";
    powerUpMessage.style.textAlign = "center";
    powerUpMessage.style.marginTop = "10px";
    document.getElementById("answers").after(powerUpMessage);
  }
  powerUpMessage.style.display = "none";

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
  options = shuffleArray(options);
  const correctIndex = options.findIndex(o => o.originalIndex === q.c);

  document.getElementById("question").innerHTML = q.q;

  const answers = document.getElementById("answers");
  answers.innerHTML = "";

  options.forEach((o, i) => {
    const btn = document.createElement("button");
    btn.innerText = o.text;
    btn.dataset.correct = (i === correctIndex);
    btn.onclick = () => checkAnswer(i, btn, correctIndex);
    answers.appendChild(btn);
  });

  startTimer(() => {
    lives--;
    updateLives();
    soundWrong.currentTime = 0;
    soundWrong.play();
    resetCombo();
    index++;
    loadQuestion();
  });
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
    showFloatingMessage("¡Correcto! 🎉", "correct");
    updateCombo();
  } else {
    lives--;
    btn.classList.add("wrong");
    soundWrong.currentTime = 0;
    soundWrong.play();
    showFloatingMessage("Incorrecto 😬", "wrong");
    resetCombo();
  }

  score = Math.max(0, score);
  updateLives();
  document.getElementById("score").innerText = score;

  setTimeout(()=> {
    index++;
    loadQuestion();
  }, 800);
}

// ==== VIDAS ====  
function updateLives(){
  document.getElementById("vidas").innerText = "❤️".repeat(lives);
}

// ==== MENSAJES FLOTANTES ====  
function showFloatingMessage(text, type){
  const msg = document.createElement("div");
  msg.className = `floating-message ${type}`;
  msg.innerText = text;
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 1000);
}

// ==== POWER-UP: ELIMINAR OPCIÓN INCORRECTA ====  
function removeRandomWrongOption() {
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

  const msg = document.createElement("div");
  msg.className = "floating-message power-up";
  msg.innerText = "Opción eliminada ❌";
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 1200);
}

// ==== COMBO ====  
function updateCombo(){
  if(comboAwarded) return;

  // Inicia combo después de la segunda pregunta correcta
  if(correctAnswers <= 1) return;

  comboCount++;
  comboActive = true;
  comboIndicator.style.display = "block";
  comboIndicator.className = "glow"; // efecto de brillo mientras está activo

  if(comboCount < 5){
    comboIndicator.innerText = `x${comboCount}🔥`;
  } else if(comboCount >= 5){
    comboAwarded = true;
    comboIndicator.innerText = "";

    // Otorgar power-up de reducir opciones
    powerUps.removeOption++;
    updatePowerUpsDisplay();

    // Mostrar mensaje debajo de opciones
    powerUpMessage.innerText = "¡Has ganado un power-up de reducir opciones!";
    powerUpMessage.style.display = "block";

    setTimeout(()=> {
      comboIndicator.style.display = "none";
      powerUpMessage.style.display = "none";
      comboActive = false;
      comboCount = 0;
    }, 2500);
  }
}

function resetCombo(){
  if(comboActive){
    // Aplicar animación de ruptura
    comboIndicator.classList.add("break");

    setTimeout(() => {
      comboIndicator.classList.remove("break");
      comboIndicator.style.display = "none";
      comboActive = false;
      comboCount = 0;
    }, 800); // coincide con duración de comboBreak
  } else {
    comboCount = 0;
    comboActive = false;
    comboIndicator.style.display = "none";
    comboIndicator.className = "";
  }
}
