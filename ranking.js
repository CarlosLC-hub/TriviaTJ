  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
  import { 
    getFirestore, 
    doc, 
    setDoc,           
    getDoc 
  } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyAIMormQk971x6UpOvY-IRJKmYdDVG3LkI",
    authDomain: "trivia-f0c84.firebaseapp.com",
    projectId: "trivia-f0c84",
    storageBucket: "trivia-f0c84.firebasestorage.app",
    messagingSenderId: "176201187022",
    appId: "1:176201187022:web:c09989347829d07f2fda9f"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

// Guarda SOLO si es mejor porcentaje
window.saveScore = async (name, percentage) => {
  try {
    const cleanId = name.trim().toLowerCase(); // ID único por jugador
    const ref = doc(db, "scores", cleanId);
    const snap = await getDoc(ref);

    const now = new Date();
    const readableDate = now.toLocaleString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    if (!snap.exists()) {
      // Jugador nuevo
      await setDoc(ref, {
        name: name.trim(),
        percentage,
        date: readableDate
      });
      console.log("Nuevo jugador guardado");
      return;
    }

    const prevPercentage = snap.data().percentage;

    if (percentage > prevPercentage) {
      await setDoc(ref, {
        name: name.trim(),
        percentage,
        date: readableDate
      });
      console.log("Resultado actualizado");
    } else {
      console.log("No mejoró el resultado");
    }

  } catch (e) {
    console.error("Error Firebase:", e);
  }
};
