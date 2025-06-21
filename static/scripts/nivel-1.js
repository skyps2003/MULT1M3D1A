// --- CONFIGURACIÓN ---
const TOTAL_PREGUNTAS = 7;
let preguntasRealizadas = 0;
let aciertos = 0;

// Elementos DOM
const cuadrosContainer = document.getElementById('cuadros');
const feedback = document.getElementById('feedback-nivel');
const ecuacion = document.getElementById('ecuacion');
const canvas = document.getElementById('canvasAnim');
const ctx = canvas.getContext('2d');

// Colores
const colorAzul = "#64b5f6";
const colorRojo = "#e57373";
const colores = [
  "#e57373", "#64b5f6", "#81c784", "#ffd54f", "#ba68c8", "#ff8a65",
  "#bdbdbd", "#9575cd", "#ffd180", "#4dd0e1", "#aed581", "#f06292"
];

// Estado global
let seleccionado = 0;
let tipoActual = ""; // "suma" o "multiplicacion"
let n, a, resultado;

// --- FUNCIONES PRINCIPALES ---

function iniciarPregunta() {
  cuadrosContainer.innerHTML = "";
  seleccionado = 0;
  tipoActual = Math.random() < 0.5 ? "suma" : "multiplicacion";
  if (tipoActual === "suma") {
    n = Math.floor(Math.random() * 6) + 2; // 2 a 7
    a = Math.floor(Math.random() * 10) + 1; // 2 a 7
    resultado = n + a;
    ecuacion.textContent = `${n} + a = ${resultado}`;
  } else {
    n = Math.floor(Math.random() * 5) + 2; // 2 a 6
    a = Math.floor(Math.random() * 10) + 1; // 1 a 10
    resultado = n * a;
    ecuacion.textContent = `${n}a = ${resultado}`;
  }
  feedback.textContent = "";
  generarCuadros();
  limpiarCanvas();
}

function generarCuadros() {
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

function limpiarCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// --- VERIFICACIÓN Y ANIMACIÓN ---
function verificarCuadros() {
  if (seleccionado === 0) {
    feedback.textContent = "Selecciona un valor para a";
    feedback.style.color = "#ff6f61";
    return;
  }
  feedback.textContent = "";
  if (tipoActual === "suma") {
    animarSuma(n, seleccionado, resultado, seleccionado === a);
  } else {
    animarResolucion(n, seleccionado, resultado, seleccionado === a);
  }
}

// --- ANIMACIÓN SUMA ---
function animarSuma(n, aSel, resultado, correcto) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Parámetros visuales
  const maxBlocks = Math.max(n + a, n + aSel);
  const maxHeight = 220;
  const blockH = Math.min(32, Math.floor(maxHeight / maxBlocks));
  const blockW = 32;
  const baseY = 350 + Math.max(0, maxHeight / 2 - (blockH * maxBlocks) / 2);

  const leftX = 180;
  const rightX = 500;

  // Altura de cada torre
  const alturaIzq = (n + aSel) * blockH;
  const alturaDer = (n + a) * blockH;
  const topYIzq = baseY - alturaIzq;
  const topYDer = baseY - alturaDer;

  // Puente partido
  const puenteMitad = (rightX - leftX + blockW + 20) / 2;
  let puenteYIzq = -60;
  let puenteYDer = -60;

  // Panda
  const pandaImg = new Image();
  pandaImg.src = "/static/imagenes/POO.png";
  const pandaSadImg = new Image();
  pandaSadImg.src = "/static/imagenes/POO_triste.png";
  let pandaX = leftX + blockW / 2;
  let pandaY = 0;
  let pandaCruza = false;
  let pandaTriste = false;

  // Estados de animación
  let fase = 0; // 0: solo n, 1: n+aSel, 2: puente, 3: panda cruza o no
  let bloquesActuales = 0;
  let puenteListo = false;

  function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Piso verde
    ctx.fillStyle = "#4caf50";
    ctx.fillRect(leftX - 60, baseY, (rightX - leftX) + blockW + 120, 30);
    ctx.strokeStyle = "#2e7d32";
    ctx.lineWidth = 2;
    ctx.strokeRect(leftX - 60, baseY, (rightX - leftX) + blockW + 120, 30);

    // Torre izquierda: primero n azules, luego aSel rojos
    let totalBloques = fase === 0 ? n : n + bloquesActuales;
    for (let i = 0; i < totalBloques; i++) {
      if (i < n) {
        ctx.fillStyle = colorAzul;
        ctx.strokeStyle = "#1565c0";
      } else {
        ctx.fillStyle = colorRojo;
        ctx.strokeStyle = "#b71c1c";
      }
      ctx.lineWidth = 2;
      ctx.fillRect(leftX, baseY - (i + 1) * blockH, blockW, blockH);
      ctx.strokeRect(leftX, baseY - (i + 1) * blockH, blockW, blockH);
    }
    // Torre derecha (resultado correcto): todos azules
    for (let i = 0; i < n + a; i++) {
      ctx.fillStyle = colorAzul;
      ctx.strokeStyle = "#1565c0";
      ctx.lineWidth = 2;
      ctx.fillRect(rightX, baseY - (i + 1) * blockH, blockW, blockH);
      ctx.strokeRect(rightX, baseY - (i + 1) * blockH, blockW, blockH);
    }

    // Etiquetas centradas verticalmente
    ctx.font = "bold 28px Arial";
    ctx.fillStyle = "#333";
    // Izquierda (n o n+aSel)
    const alturaTorreIzq = totalBloques * blockH;
    const centroYIzq = baseY - (alturaTorreIzq / 2) + blockH / 2 + 4;
    ctx.fillText(fase === 0 ? n : n + bloquesActuales, leftX - 35, centroYIzq);

    // Derecha (resultado)
    const alturaTorreDer = (n + a) * blockH;
    const centroYDer = baseY - (alturaTorreDer / 2) + blockH / 2 + 4;
    ctx.fillText(n + a, rightX + 50, centroYDer);

    // Etiqueta "a" abajo de la izquierda
    ctx.font = "bold 28px Arial";
    ctx.fillText("", leftX + 2, baseY + 40);

    // Puente partido (cada mitad baja sobre su torre)
    if (fase === 2 || fase === 3) {
      ctx.fillStyle = "#d18b2e";
      ctx.fillRect(leftX - 10, puenteYIzq, puenteMitad, 12);
      ctx.fillRect(leftX - 10 + puenteMitad, puenteYDer, puenteMitad, 12);
    }

    // Panda
    if (fase === 3 && puenteListo) {
      let pandaDrawY = puenteYIzq - 35;
      if (pandaTriste) {
        if (pandaSadImg.complete) {
          ctx.drawImage(pandaSadImg, pandaX, pandaDrawY, 40, 40);
        }
      } else if (pandaCruza) {
        if (pandaImg.complete) {
          ctx.drawImage(pandaImg, pandaX, pandaDrawY, 40, 40);
        }
      }
    }

    // Mensaje final
    if (fase === 3 && puenteListo) {
      ctx.font = "bold 32px Comic Sans MS";
      if ((n + aSel) === (n + a)) {
        ctx.fillStyle = "#1e7d1e";
        ctx.fillText("¡Correcto! 🎉", 320, 60);
        feedback.textContent = `¡Bien hecho! ${n} + ${aSel} = ${n + aSel}`;
        feedback.style.color = "#1e7d1e";
      } else {
        ctx.fillStyle = "#ff6f61";
        ctx.fillText("¡El puente no encaja!", 320, 60);
        feedback.textContent = `No es correcto. ${n} + ${aSel} = ${n + aSel}`;
        feedback.style.color = "#ff6f61";
      }
    }
  }

  // Animación de suma: primero n, luego suma aSel bloques uno a uno
  function animarSumaInterna(bloque) {
    if (bloque <= aSel) {
      fase = bloque === 0 ? 0 : 1;
      bloquesActuales = bloque;
      drawScene();
      setTimeout(() => animarSumaInterna(bloque + 1), 250);
    } else {
      fase = 2;
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
      fase = 3;
      drawScene();
      // Panda cruza si es correcto, si no, va y regresa triste y reinicia
      if ((n + aSel) === (n + a)) {
        pandaCruza = true;
        setTimeout(animarPandaCruza, 300);
      } else {
        pandaCruza = true;
        setTimeout(animarPandaFalla, 300);
      }
    }
  }

  // Panda cruza (correcto)
  function animarPandaCruza() {
    if (pandaX < rightX) {
      pandaX += 6;
      drawScene();
      setTimeout(animarPandaCruza, 40);
    } else {
      drawScene();
      siguientePregunta(true);
    }
  }

  // Panda intenta cruzar, se regresa y se pone triste (incorrecto)
  function animarPandaFalla() {
    if (pandaX < leftX + (rightX - leftX) / 2) {
      pandaX += 6;
      drawScene();
      setTimeout(animarPandaFalla, 40);
    } else {
      // Regresa triste
      pandaCruza = false;
      pandaTriste = true;
      setTimeout(animarPandaRegresa, 400);
    }
  }
  function animarPandaRegresa() {
    if (pandaX > leftX + blockW / 2) {
      pandaX -= 6;
      drawScene();
      setTimeout(animarPandaRegresa, 40);
    } else {
      drawScene();
      setTimeout(() => siguientePregunta(false), 1000);
    }
  }

  // Inicia animación
  drawScene();
  setTimeout(() => animarSumaInterna(0), 600);
}

// --- ANIMACIÓN MULTIPLICACIÓN ---
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
  pandaImg.src = "/static/imagenes/POO.png";
  const pandaSadImg = new Image();
  pandaSadImg.src = "/static/imagenes/poo_triste.png";
  let pandaX = leftX + blockW / 2;
  let pandaY = 0;
  let pandaCruza = false;
  let pandaTriste = false;

  // Estados de animación
  let fase = 0; // 0: construir bloques, 1: puente cae, 2: panda cruza o no
  let grupoActual = -1;
  let puenteListo = false;

  function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Piso verde
    ctx.fillStyle = "#4caf50";
    ctx.fillRect(leftX - 60, baseY, (rightX - leftX) + blockW + 120, 30);
    ctx.strokeStyle = "#2e7d32";
    ctx.lineWidth = 2;
    ctx.strokeRect(leftX - 60, baseY, (rightX - leftX) + blockW + 120, 30);

    // Torres izquierda (colores, de n en n)
    let blockIndex = 0;
    for (let i = 0; i < n; i++) {
      let colorGrupo = colores[i % colores.length];
      for (let j = 0; j < aSel; j++) {
        if (i <= grupoActual || fase > 0) {
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
    ctx.fillText("", leftX + 10, baseY + 40);

    // Puente partido (cada mitad baja sobre su torre)
    if (fase > 0) {
      ctx.fillStyle = "#d18b2e";
      ctx.fillRect(leftX - 10, puenteYIzq, puenteMitad, 12);
      ctx.fillRect(leftX - 10 + puenteMitad, puenteYDer, puenteMitad, 12);
    }

    // Panda
    if (fase === 2 && puenteListo) {
      let pandaDrawY = puenteYIzq - 35;
      if (pandaTriste) {
        if (pandaSadImg.complete) {
          ctx.drawImage(pandaSadImg, pandaX, pandaDrawY, 40, 40);
        }
      } else if (pandaCruza) {
        if (pandaImg.complete) {
          ctx.drawImage(pandaImg, pandaX, pandaDrawY, 40, 40);
        }
      }
    }

    // Mensaje final
    if (fase === 2 && puenteListo) {
      ctx.font = "bold 32px Comic Sans MS";
      if (alturaIzq === alturaDer) {
        ctx.fillStyle = "#1e7d1e";
        ctx.fillText("¡Correcto! 🎉", 320, 60);
        feedback.textContent = `¡Bien hecho! ${n} × ${aSel} = ${n * aSel}`;
        feedback.style.color = "#1e7d1e";
      } else {
        ctx.fillStyle = "#ff6f61";
        ctx.fillText("¡El puente no encaja!", 320, 60);
        feedback.textContent = `No es correcto. ${n} × ${aSel} = ${n * aSel}`;
        feedback.style.color = "#ff6f61";
      }
    }
  }

  // Animación de construcción de bloques (de n en n)
  function animarMultiplicacion(grupo) {
    if (grupo < n) {
      grupoActual = grupo;
      drawScene();
      setTimeout(() => animarMultiplicacion(grupo + 1), 300);
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
        setTimeout(animarPandaCruza, 300);
      } else {
        pandaY = puenteYIzq - 35;
        pandaX = leftX + blockW / 2;
        pandaCruza = true;
        setTimeout(animarPandaFalla, 300);
      }
    }
  }

  // Panda cruza correctamente
  function animarPandaCruza() {
    if (pandaX < rightX) {
      pandaX += 6;
      drawScene();
      setTimeout(animarPandaCruza, 40);
    } else {
      drawScene();
      siguientePregunta(true);
    }
  }

  // Panda intenta cruzar, se regresa y se pone triste (incorrecto)
  function animarPandaFalla() {
    if (pandaX < leftX + (rightX - leftX) / 2) {
      pandaX += 6;
      drawScene();
      setTimeout(animarPandaFalla, 40);
    } else {
      // Regresa triste
      pandaCruza = false;
      pandaTriste = true;
      setTimeout(animarPandaRegresa, 400);
    }
  }
  function animarPandaRegresa() {
    if (pandaX > leftX + blockW / 2) {
      pandaX -= 6;
      drawScene();
      setTimeout(animarPandaRegresa, 40);
    } else {
      drawScene();
      setTimeout(() => siguientePregunta(false), 1000);
    }
  }

  // Inicia animación
  drawScene();
  setTimeout(() => animarMultiplicacion(0), 600);
}

// --- CONTROL DE PREGUNTAS ---
function siguientePregunta(acierto) {
  preguntasRealizadas++;
  if (acierto) aciertos++;
  if (preguntasRealizadas >= TOTAL_PREGUNTAS) {
    mostrarNivelPasado();
  } else {
    iniciarPregunta();
  }
}
function mostrarNivelPasado() {
  limpiarCanvas();
  cuadrosContainer.innerHTML = "";
  ecuacion.textContent = "";

  // Crear overlay de felicitación a pantalla completa
  let overlay = document.createElement('div');
  overlay.id = "overlay-nivel-pasado";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(0,0,0,0.85)";
  overlay.style.zIndex = "9999";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.innerHTML = `
    <canvas id="fireworks-canvas" style="position:absolute;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:1;"></canvas>
    <div style="position:relative;z-index:2;text-align:center;">
      <div style="color:#fff;font-size:2.5em;font-weight:bold;margin-bottom:10px;text-shadow:0 0 20px #1e7d1e;">
        ¡Nivel pasado!<br>
        <span style="font-size:1.2em;color:#ffd54f;text-shadow:0 0 10px #ffeb3b;">Respondiste correctamente ${aciertos} de ${TOTAL_PREGUNTAS} preguntas.</span>
      </div>
      <div style="margin-top:30px;">
        <button id="btn-repetir" style="font-size:1.2em;padding:12px 28px;margin-right:20px;background:#64b5f6;color:white;border:none;border-radius:12px;cursor:pointer;box-shadow:0 2px 8px #222;">
          Repetir nivel
        </button>
        <button id="btn-siguiente" style="font-size:1.2em;padding:12px 28px;background:#43a047;color:white;border:none;border-radius:12px;cursor:pointer;box-shadow:0 2px 8px #222;">
          Siguiente nivel
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Botones
  document.getElementById('btn-repetir').onclick = () => {
    document.body.removeChild(overlay);
    preguntasRealizadas = 0;
    aciertos = 0;
    iniciarPregunta();
    actualizarProgreso(); // Reiniciar progreso
  };
  document.getElementById('btn-siguiente').onclick = () => {
    window.location.href = "/nivel2";
  };

  // Fuegos artificiales animados
  fireworksAnimation();

  function fireworksAnimation() {
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');
    // Ajustar tamaño
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Firework y Particle clases
    function randomColor() {
      const colors = ['#ffd54f', '#64b5f6', '#e57373', '#81c784', '#ba68c8', '#ff8a65', '#fff', '#ffeb3b'];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 2 + 1;
        this.color = color;
        this.angle = Math.random() * 2 * Math.PI;
        this.speed = Math.random() * 6 + 2;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.008;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.gravity = 0.04;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.alpha -= this.decay;
      }
      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(this.alpha, 0);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.restore();
      }
    }
    class Firework {
      constructor() {
        this.x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
        this.y = Math.random() * canvas.height * 0.4 + canvas.height * 0.1;
        this.color = randomColor();
        this.particles = [];
        for (let i = 0; i < 40 + Math.random() * 20; i++) {
          this.particles.push(new Particle(this.x, this.y, this.color));
        }
      }
      update() {
        this.particles.forEach(p => p.update());
      }
      draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
      }
      done() {
        return this.particles.every(p => p.alpha <= 0);
      }
    }

    let fireworks = [];
    let lastFirework = 0;

    function animateFireworks(ts) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!lastFirework || ts - lastFirework > 600) {
        fireworks.push(new Firework());
        lastFirework = ts;
      }
      fireworks.forEach(fw => {
        fw.update();
        fw.draw(ctx);
      });
      fireworks = fireworks.filter(fw => !fw.done());
      requestAnimationFrame(animateFireworks);
    }
    animateFireworks();
  }
}
function siguientePregunta(acierto) {
  preguntasRealizadas++;
  if (acierto) aciertos++;
  if (acierto) {
    actualizarProgreso(); // Solo sube si responde bien
  }
  if (preguntasRealizadas >= TOTAL_PREGUNTAS) {
    mostrarNivelPasado();
  } else {
    iniciarPregunta();
  }
}

// Barra de progreso visual y porcentaje
function actualizarProgreso() {
  let barra = document.getElementById('barra-progreso-nivel');
  let texto = document.getElementById('texto-progreso-nivel');
  // Colores personalizados
  const colorPrimario = "#ff6f61";    // --color-primario
  const colorSecundario = "#ffb88c";  // --color-secundario

  if (!barra) {
    // Crear barra si no existe
    barra = document.createElement('div');
    barra.id = 'barra-progreso-nivel';
    barra.style.width = '80%';
    barra.style.height = '22px';
    barra.style.background = colorSecundario;
    barra.style.borderRadius = '12px';
    barra.style.margin = '18px auto 0 auto';
    barra.style.overflow = 'hidden';
    barra.style.boxShadow = '0 2px 8px #bbb';
    barra.innerHTML = `<div id="progreso-interno-nivel" style="height:100%;width:0%;background:${colorPrimario};border-radius:12px;transition:width 0.4s;"></div>`;
    feedback.parentNode.insertBefore(barra, feedback);
    // Texto porcentaje
    texto = document.createElement('div');
    texto.id = 'texto-progreso-nivel';
    texto.style.textAlign = 'center';
    texto.style.fontWeight = 'bold';
    texto.style.margin = '4px auto 12px auto';
    texto.style.color = colorPrimario;
    barra.parentNode.insertBefore(texto, barra.nextSibling);
  }

  // El porcentaje ahora depende de aciertos, no de preguntasRealizadas
  let porcentaje = Math.round((aciertos / TOTAL_PREGUNTAS) * 100);
  document.getElementById('progreso-interno-nivel').style.width = porcentaje + "%";
  texto.textContent = `Progreso: ${aciertos} / ${TOTAL_PREGUNTAS} (${porcentaje}%)`;
}
// --- INICIO ---
iniciarPregunta();
actualizarProgreso(); 