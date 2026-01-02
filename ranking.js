import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// Guarda puntuación
window.saveScore = async function (name, score) {
  try {
    await addDoc(collection(db, "scores"), {
      name,
      score,
      created: serverTimestamp()
    });
    console.log("Puntaje guardado");
  } catch (err) {
    console.error("Error al guardar", err);
  }
};

// Carga ranking
window.loadRanking = async function (containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  const q = query(
    collection(db, "scores"),
    orderBy("score", "desc"),
    limit(10)
  );

  const snapshot = await getDocs(q);
  snapshot.forEach((doc, i) => {
    const data = doc.data();
    const div = document.createElement("div");
    div.innerText = `${i + 1}. ${data.name} — ${data.score}`;
    container.appendChild(div);
  });
};
