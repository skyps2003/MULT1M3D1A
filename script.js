document.getElementById("btnRestar").addEventListener("click", () => {
  // Eliminar el "+2"
  const plus2 = document.getElementById("plus2");
  plus2.style.opacity = "0";
  plus2.style.transform = "translateY(-20px)";
  
  // Cambiar el 5 a 3
  const value5 = document.getElementById("value5");
  value5.innerText = "3";

  // Mostrar resultado
  document.getElementById("resultado").innerText = "✅ x = 3 ¡Correcto!";
  
  // Desactivar el botón
  document.getElementById("btnRestar").disabled = true;
});
