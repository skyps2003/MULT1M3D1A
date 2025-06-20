
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

document.getElementById('btnJugar').addEventListener('click', function() {
  window.location.href = "/nivel1";
});
