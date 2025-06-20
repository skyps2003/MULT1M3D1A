// Parámetros aleatorios
let n = Math.floor(Math.random() * 5) + 2; // 2 a 6
let a = Math.floor(Math.random() * 5) + 2; // 2 a 6
let resultado = n * a;

const colores = [
  "#e57373", "#64b5f6", "#81c784", "#ffd54f", "#ba68c8", "#ff8a65",
  "#bdbdbd", "#9575cd", "#ffd180", "#4dd0e1", "#aed581", "#f06292"
];

// Mostrar ecuación
document.getElementById('ecuacion').textContent = `${n}a = ${resultado}`;

// Generar 10 cuadros
const cuadrosContainer = document.getElementById('cuadros');
const feedback = document.getElementById('feedback-nivel');
let seleccionado = 0;

for (let i = 1; i <= 10; i++) {
  const cuadro = document.createElement('div');
  cuadro.className = 'cuadro';
  cuadro.dataset.valor = i;
  cuadro.addEventListener('mouseenter', function() {
    if (seleccionado === 0) resaltaHasta(i);
  });
  cuadro.addEventListener('mouseleave', function() {
    if (seleccionado === 0) resaltaHasta(0);
  });
  cuadro.addEventListener('click', function() {
    seleccionado = i;
    resaltaHasta(i, true);
    feedback.textContent = `Seleccionaste el cuadro ${i} (a = ${i})`;
    feedback.style.color = "#1e7d1e";
  });
  cuadrosContainer.appendChild(cuadro);
}

function resaltaHasta(n, select = false) {
  const cuadros = document.querySelectorAll('.cuadro');
  cuadros.forEach((c, idx) => {
    c.classList.remove('activo', 'seleccionado');
    if (n > 0 && idx < n) {
      c.classList.add(select ? 'seleccionado' : 'activo');
    }
  });
}

// Canvas animación
const canvas = document.getElementById('canvasAnim');
const ctx = canvas.getContext('2d');

function verificarCuadros() {
  if (seleccionado === 0) {
    feedback.textContent = "Selecciona un valor para a";
    feedback.style.color = "#ff6f61";
    return;
  }
  feedback.textContent = "";
  animarResolucion(n, seleccionado, resultado, seleccionado === a);
}
/***************************************** */
// Función para animar la resolución del problema
// Parámetros:
function animarResolucion(n, aSel, resultado, correcto) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Parámetros visuales
const maxBlocks = Math.max(n * a, n * aSel);
  const maxHeight = 220;
  const blockH = Math.min(32, Math.floor(maxHeight / maxBlocks));
  const blockW = 32;
 const baseY = 350 + Math.max(0, maxHeight / 2 - (blockH * maxBlocks) / 2);

const leftX = 180;
const rightX = 500;

  // Altura de cada torre
  const alturaIzq = n * aSel * blockH;
  const alturaDer = n * a * blockH;
  const topYIzq = baseY - alturaIzq;
  const topYDer = baseY - alturaDer;

  // Puente partido
  const puenteMitad = (rightX - leftX + blockW + 20) / 2;
  let puenteYIzq = -60;
  let puenteYDer = -60;

  // Panda
  const pandaImg = new Image();
  pandaImg.src = "../imagenes/POO.png";
  let pandaX = leftX + blockW / 2;
  let pandaY = 0;
  let pandaCruza = false;

  // Estados de animación
  let fase = 0; // 0: construir bloques, 1: puente cae, 2: panda cruza o no
  let grupoActual = 0, bloquesActuales = 0;
  let puenteListo = false;

  function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Torres
    // Izquierda (colores)
    let blockIndex = 0;
    for (let i = 0; i < n; i++) {
      let colorGrupo = colores[i % colores.length];
      for (let j = 0; j < aSel; j++) {
        if (i < grupoActual || (i === grupoActual && j < bloquesActuales) || fase > 0) {
          ctx.fillStyle = colorGrupo;
          ctx.strokeStyle = "#088";
          ctx.lineWidth = 2;
          ctx.fillRect(leftX, baseY - (blockIndex + 1) * blockH, blockW, blockH);
          ctx.strokeRect(leftX, baseY - (blockIndex + 1) * blockH, blockW, blockH);
        }
        blockIndex++;
      }
    }
    // Derecha (azul)
    for (let i = 0; i < n * a; i++) {
      ctx.fillStyle = "#19c6e6";
      ctx.strokeStyle = "#088";
      ctx.lineWidth = 2;
      ctx.fillRect(rightX, baseY - (i + 1) * blockH, blockW, blockH);
      ctx.strokeRect(rightX, baseY - (i + 1) * blockH, blockW, blockH);
    }

    // Etiquetas centradas verticalmente
    ctx.font = "bold 28px Arial";
    ctx.fillStyle = "#333";
    // Izquierda (n)
    const alturaTorreIzq = n * aSel * blockH;
    const centroYIzq = baseY - (alturaTorreIzq / 2) + blockH / 2 + 4;
    ctx.fillText(n, leftX - 35, centroYIzq);

    // Derecha (resultado)
    const alturaTorreDer = n * a * blockH;
    const centroYDer = baseY - (alturaTorreDer / 2) + blockH / 2 + 4;
    ctx.fillText(n * a, rightX + 50, centroYDer);

    // Etiqueta "a" abajo de la izquierda
    ctx.font = "bold 28px Arial";
    ctx.fillText("a", leftX + 10, baseY + 40);

    // Puente partido (cada mitad baja sobre su torre)
    if (fase > 0) {
      ctx.fillStyle = "#d18b2e";
      // Izquierda
      ctx.fillRect(leftX - 10, puenteYIzq, puenteMitad, 12);
      // Derecha
      ctx.fillRect(leftX - 10 + puenteMitad, puenteYDer, puenteMitad, 12);
    }

    // Panda cruzando solo si el puente está alineado y la animación lo permite
    if (fase === 2 && puenteListo && pandaCruza) {
      let pandaDrawY = puenteYIzq - 35;
      if (pandaImg.complete) {
        ctx.drawImage(pandaImg, pandaX, pandaDrawY, 40, 40);
      } else {
        pandaImg.onload = function () {
          ctx.drawImage(pandaImg, pandaX, pandaDrawY, 40, 40);
        };
      }
    }

    // Mensaje final
    if (fase === 2 && puenteListo) {
      ctx.font = "bold 32px Comic Sans MS";
      ctx.fillStyle = correcto && alturaIzq === alturaDer ? "#1e7d1e" : "#ff6f61";
      ctx.fillText(
        correcto && alturaIzq === alturaDer ? "¡Correcto! 🎉" : "¡El puente no encaja!",
        320, 60
      );
      feedback.textContent = correcto && alturaIzq === alturaDer
        ? `¡Bien hecho! ${n} × ${aSel} = ${n * aSel}`
        : `No es correcto. ${n} × ${aSel} = ${n * aSel}`;
      feedback.style.color = correcto && alturaIzq === alturaDer ? "#1e7d1e" : "#ff6f61";
    }
  }

  // Animación de construcción de bloques
  function animarMultiplicacion(grupo, bloque) {
    if (grupo < n) {
      if (bloque < aSel) {
        grupoActual = grupo;
        bloquesActuales = bloque + 1;
        drawScene();
        setTimeout(() => animarMultiplicacion(grupo, bloque + 1), 120);
      } else {
        drawScene();
        setTimeout(() => animarMultiplicacion(grupo + 1, 0), 180);
      }
    } else {
      fase = 1;
      drawScene();
      setTimeout(animarPuentePartido, 400);
    }
  }

  // Animación del puente partido cayendo
  function animarPuentePartido() {
    let destinoIzq = topYIzq - 18;
    let destinoDer = topYDer - 18;
    let bajando = false;

    if (puenteYIzq < destinoIzq) {
      puenteYIzq += 12;
      if (puenteYIzq > destinoIzq) puenteYIzq = destinoIzq;
      bajando = true;
    }
    if (puenteYDer < destinoDer) {
      puenteYDer += 12;
      if (puenteYDer > destinoDer) puenteYDer = destinoDer;
      bajando = true;
    }
    drawScene();
    if (bajando) {
      setTimeout(animarPuentePartido, 20);
    } else {
      puenteListo = true;
      fase = 2;
      drawScene();
      // Si el puente encaja, inicia animación del panda
      if (alturaIzq === alturaDer) {
        pandaY = puenteYIzq - 35;
        pandaX = leftX + blockW / 2;
        pandaCruza = true;
        setTimeout(animarPanda, 300);
      }
    }
  }

  // Animación del panda cruzando
  function animarPanda() {
    if (pandaX < rightX) {
      pandaX += 6;
      drawScene();
      setTimeout(animarPanda, 40);
    } else {
      drawScene(); // termina cruzando
    }
  }

  // Inicia animación
  drawScene();
  setTimeout(() => animarMultiplicacion(0, 0), 600);
}