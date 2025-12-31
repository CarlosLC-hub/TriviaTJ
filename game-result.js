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

  const starsCount = Math.round((score / maxScore) * 10);
  let endMessage = "";

  if(lives <= 0 && starsCount === 0){
    // GAME OVER total
    endMessage = "💀 GAME OVER";
    soundGameOver.currentTime = 0;
    soundGameOver.play();

    for(let i = 0; i < 10; i++){
      const star = document.createElement("span");
      star.classList.add("star-fall");
      star.innerText = "⭐";
      starsContainer.appendChild(star);
    }

    // Después de animación, desaparecen todas
    setTimeout(() => {
      starsContainer.innerHTML = "";
    }, 800);

  } else if(lives <= 0 && starsCount > 0){
    // GAME OVER pero con estrellas ganadas
    endMessage = "💀 GAME OVER";
    soundGameOver.currentTime = 0;
    soundGameOver.play();

    for(let i = 0; i < starsCount; i++){
      const star = document.createElement("span");
      star.classList.add("star-fall");
      star.innerText = "⭐";
      starsContainer.appendChild(star);
    }

    // Después de animación, mostrar estrellas fijas
    setTimeout(() => {
      starsContainer.innerHTML = "⭐".repeat(starsCount) + "☆".repeat(10 - starsCount);
    }, 800);

  } else if(correctAnswers === selectedQuestions.length){
    // VICTORIA TOTAL
    endMessage = "🏆 VICTORIA";
    soundVictory.currentTime = 0;
    soundVictory.play();

    // Confeti
    const confettiContainer = document.createElement("div");
    confettiContainer.id = "confetti";
    document.body.appendChild(confettiContainer);

    const colors = ["#FF5733","#33FF57","#3357FF","#F333FF","#FF33A6","#33FFF3"];
    const shapes = ["circle","square","triangle"];

    for (let i = 0; i < 30; i++){
      const piece = document.createElement("div");
      piece.classList.add("confetti-piece");
      piece.style.top = "-20px";
      piece.style.left = Math.random() * window.innerWidth + "px";

      const size = 6 + Math.random() * 12;
      piece.style.width = size + "px";
      piece.style.height = size + "px";
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      if(shape === "circle") piece.style.borderRadius = "50%";
      else if(shape === "triangle"){
        piece.style.width = "0";
        piece.style.height = "0";
        piece.style.borderLeft = size/2 + "px solid transparent";
        piece.style.borderRight = size/2 + "px solid transparent";
        piece.style.borderBottom = size + "px solid " + piece.style.backgroundColor;
        piece.style.backgroundColor = "transparent";
      }

      piece.style.animation = `fall ${(2 + Math.random()*2)}s linear forwards`;
      piece.style.animationDelay = Math.random() * 0.5 + "s";

      confettiContainer.appendChild(piece);
    }
    setTimeout(() => confettiContainer.remove(), 4000);

    for(let i = 0; i < starsCount; i++){
      const span = document.createElement("span");
      span.className = "star-glow";
      span.innerText = "⭐";
      starsContainer.appendChild(span);
    }
    for(let i = starsCount; i < 10; i++){
      const span = document.createElement("span");
      span.innerText = "☆";
      starsContainer.appendChild(span);
    }

  } 
else {
  // SIGUE PARTICIPANDO
  endMessage = "✏️ SIGUE PARTICIPANDO";
  soundContinue.currentTime = 0;
  soundContinue.play();

  starsContainer.innerHTML = ""; // limpiar estrellas previas

  // Animacion de estrellas intermitentes
  const animationClass = "star-glow-pulse";

  for (let i = 0; i < starsCount; i++) {
    const span = document.createElement("span");
    span.className = animationClass;
    span.innerText = "⭐";
    starsContainer.appendChild(span);
  }
  for (let i = starsCount; i < 10; i++) {
    const span = document.createElement("span");
    span.className = animationClass;
    span.innerText = "☆";
    starsContainer.appendChild(span);
  }
}



  document.getElementById("endTitle").innerText = endMessage;
  document.getElementById("finalScore").innerText = `Puntuación: ${score} de ${maxScore}`;
  const percentage = Math.round((score / maxScore) * 100);
  document.getElementById("percentage").innerText = `Resultado: ${percentage}%`;
}

// Botón de reintentar
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

  initPowerUps();
  resetCombo();
  clearInterval(timer);
}
