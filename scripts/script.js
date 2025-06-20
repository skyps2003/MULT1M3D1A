// script.js

// Pantalla de carga
window.addEventListener('load', function() {
  setTimeout(() => {
    document.getElementById('loading-screen').style.opacity = 0;
    setTimeout(() => {
      document.getElementById('loading-screen').style.display = 'none';
    }, 500);
  }, 1200);
});

// Mostrar pasos de cómo jugar antes de iniciar el juego
document.getElementById('btnEmpezar').addEventListener('click', function() {
  document.getElementById('inicioContent').style.display = 'none';
  const comoJugar = document.getElementById('comoJugar');
  comoJugar.style.display = 'block';
  comoJugar.classList.add('animated');
});

// Mostrar el nivel 1 después de la explicación
document.getElementById('btnJugar').addEventListener('click', function() {
  document.getElementById('comoJugar').style.display = 'none';
  document.getElementById('nivel1').style.display = 'flex';
});

// Animaciones de ejemplo para sumar/restar y multiplicar/dividir
function sumarRestar() {
  const bloqueAzul = document.getElementById('bloqueAzul');
  bloqueAzul.style.background = "#fcb6b6";
  bloqueAzul.style.color = "#7d1e1e";
  bloqueAzul.innerText = "0";
  setTimeout(() => {
    bloqueAzul.style.background = "#b6e0fc";
    bloqueAzul.style.color = "#1e4a7d";
    bloqueAzul.innerText = "2";
  }, 800);
}

function multiplicarDividir() {
  const bloqueVerde = document.getElementById('bloqueVerde');
  bloqueVerde.style.transform = "scaleX(1.5)";
  setTimeout(() => {
    bloqueVerde.style.transform = "scaleX(1)";
  }, 800);
}

// Verificar respuesta
function verificarRespuesta() {
  const valor = document.getElementById('respuesta').value;
  const feedback = document.getElementById('feedback-nivel');
  if (valor === "2") {
    feedback.innerHTML = "🎉 ¡Correcto! x = 2. ¡Sigue así!";
    feedback.style.color = "#1e7d1e";
  } else {
    feedback.innerHTML = "❌ Intenta de nuevo. Recuerda despejar la x.";
    feedback.style.color = "#ff6f61";
  }
}
// script.js

document.getElementById('btnJugar').addEventListener('click', function() {
  window.location.href = "nivel1.html";
});