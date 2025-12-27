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

// ==== SELECCIONAR DIFICULTAD ====  
function chooseDifficulty(level){
  let allQuestions = [];
  switch(level){
    case "facil":
      timePerQuestion = 20;
      maxQuestions = 20; // mostrar 20 preguntas aleatorias
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
    case "prueba":
      timePerQuestion = 7;
      maxQuestions = 5;
      allQuestions = prueba;
      break;
  }

  // Mezclar y seleccionar al azar maxQuestions preguntas
  selectedQuestions = shuffleArray([...allQuestions]).slice(0, maxQuestions);

  document.getElementById("menu").classList.remove("activa");
  startGame();
}

// Función de utilidad para mezclar arrays
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

  document.getElementById("game").classList.add("activa");
  updateLives();
  document.getElementById("score").innerText = score;

  showPowerUps(); // Mostrar power-ups al iniciar
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

    // Marcar opción correcta para power-ups
    btn.dataset.correct = (i === correctIndex);

    btn.onclick = () => checkAnswer(i, btn, correctIndex);
    answers.appendChild(btn);
  });

  startTimer(() => {
    lives--;
    updateLives();
    soundWrong.currentTime = 0;
    soundWrong.play();
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
  } else {
    lives--;
    btn.classList.add("wrong");
    soundWrong.currentTime = 0;
    soundWrong.play();
    showFloatingMessage("Incorrecto 😬", "wrong");
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

  // Animación flotante
  const msg = document.createElement("div");
  msg.className = "floating-message power-up";
  msg.innerText = "Opción eliminada ❌";
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 1200);
}
