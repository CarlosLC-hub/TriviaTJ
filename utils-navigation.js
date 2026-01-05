function goToMainMenu() {
  // Detener cualquier timer activo si existe
  if (typeof timer !== "undefined") {
    clearInterval(timer);
  }

  // Redirigir al menú principal
  window.location.href = "../index.html";
}
