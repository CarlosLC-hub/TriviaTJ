// ==== FINAL DEL JUEGO ====
function endGame() {
  clearInterval(timer);
  hidePowerUps(); // ocultar power-ups

  const gameScreen = document.getElementById("game");
  const endScreen = document.getElementById("end");

  gameScreen.classList.remove("activa");
  endScreen.classList.add("activa");

  const starsContainer = document.getElementById("stars");
  starsContainer.innerHTML = "";

  const starsCount = maxScore > 0 ? Math.round((score / maxScore) * 10) : 0;
  let endMessage = "";

  if (lives <= 0 && starsCount === 0) {
    // GAME OVER total
    endMessage = "💀 GAME OVER";
    soundGameOver.currentTime = 0;
    soundGameOver.play();

    for (let i = 0; i < 10; i++) {
      const star = document.createElement("span");
      star.classList.add("star-fall");
      star.innerText = "⭐";
      starsContainer.appendChild(star);
    }

    setTimeout(() => {
      starsContainer.innerHTML = "";
    }, 800);

  } else if (lives <= 0 && starsCount > 0) {
    // GAME OVER con estrellas
    endMessage = "💀 GAME OVER";
    soundGameOver.currentTime = 0;
    soundGameOver.play();

    for (let i = 0; i < starsCount; i++) {
      const star = document.createElement("span");
      star.classList.add("star-fall");
      star.innerText = "⭐";
      starsContainer.appendChild(star);
    }

    setTimeout(() => {
      starsContainer.innerHTML = "⭐".repeat(starsCount) + "☆".repeat(10 - starsCount);
    }, 800);

  } else if (correctAnswers === selectedQuestions.length) {
    // VICTORIA TOTAL
    endMessage = "🏆 VICTORIA";
    soundVictory.currentTime = 0;
    soundVictory.play();

    const confettiContainer = document.createElement("div");
    confettiContainer.id = "confetti";
    document.body.appendChild(confettiContainer);

    const colors = ["#FF5733", "#33FF57", "#3357FF", "#F333FF", "#FF33A6", "#33FFF3"];
    const shapes = ["circle", "square", "triangle"];

    for (let i = 0; i < 30; i++) {
      const piece = document.createElement("div");
      piece.classList.add("confetti-piece");
      piece.style.top = "-20px";
      piece.style.left = Math.random() * window.innerWidth + "px";

      const size = 6 + Math.random() * 12;
      piece.style.width = size + "px";
      piece.style.height = size + "px";
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      if (shape === "circle") piece.style.borderRadius = "50%";
      else if (shape === "triangle") {
        piece.style.width = "0";
        piece.style.height = "0";
        piece.style.borderLeft = size / 2 + "px solid transparent";
        piece.style.borderRight = size / 2 + "px solid transparent";
        piece.style.borderBottom = size + "px solid " + piece.style.backgroundColor;
        piece.style.backgroundColor = "transparent";
      }

      piece.style.animation = `fall ${(2 + Math.random() * 2)}s linear forwards`;
      piece.style.animationDelay = Math.random() * 0.5 + "s";

      confettiContainer.appendChild(piece);
    }

    setTimeout(() => confettiContainer.remove(), 4000);

    for (let i = 0; i < 10; i++) {
      const span = document.createElement("span");
      span.innerText = i < starsCount ? "⭐" : "☆";
      span.className = i < starsCount ? "star-glow" : "";
      starsContainer.appendChild(span);
    }

  } else {
    // SIGUE PARTICIPANDO
    endMessage = "✏️ SIGUE PARTICIPANDO";
    soundContinue.currentTime = 0;
    soundContinue.play();

    const animationClass = "star-glow-pulse";

    for (let i = 0; i < 10; i++) {
      const span = document.createElement("span");
      span.className = animationClass;
      span.innerText = i < starsCount ? "⭐" : "☆";
      starsContainer.appendChild(span);
    }
  }

  // ✅ PORCENTAJE SEGURO
  const percentage = maxScore > 0
    ? Math.round((score / maxScore) * 100)
    : 0;

  if (typeof playerName !== "undefined" && playerName) {
    saveScore(playerName, percentage);
  }

  document.getElementById("endTitle").innerText = endMessage;
  document.getElementById("finalScore").innerText = `Puntuación: ${score} de ${maxScore}`;
  document.getElementById("percentage").innerText = `Resultado: ${percentage}%`;


  
}

// ==== BOTÓN REINTENTAR ====
function retryGame() {
  document.getElementById("end").classList.remove("activa");
  document.getElementById("menu").classList.add("activa");

  index = 0;
  score = 0;
  lives = 3;
  correctAnswers = 0;
  maxScore = 0;

  document.getElementById("stars").innerHTML = "";
  document.getElementById("finalScore").innerText = "";
  document.getElementById("percentage").innerText = "";

    // 🔥 LIMPIAR RACHA
  const comboEl = document.getElementById("combo");
  if (comboEl) comboEl.innerText = "";

  initPowerUps();
  resetCombo();
  clearInterval(timer);
}

function backToMain(){
  // Ocultar todas las pantallas
  document.querySelectorAll(".pantalla").forEach(p => p.classList.remove("activa"));

  // Mostrar el menú principal
  document.getElementById("mainMenu").classList.add("activa");

  // --- REINICIAR JUEGO ---
  index = 0;
  score = 0;
  lives = 3;
  correctAnswers = 0;
  maxScore = 0;

  // Limpiar HUD
  document.getElementById("score").innerText = score;
  document.getElementById("vidas").innerHTML = "❤️❤️❤️";
  document.getElementById("stars").innerHTML = "";
  document.getElementById("finalScore").innerText = "";
  document.getElementById("percentage").innerText = "";

  // Limpiar racha
  resetCombo(); 

  // Ocultar power-ups si estaban visibles
  hidePowerUps();

  // Detener temporizador
  clearInterval(timer);
}

  