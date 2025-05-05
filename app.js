const form = document.getElementById("formTarea");
const input = document.getElementById("inputTarea");
const contenedor = document.getElementById("contenedorTarjetas");

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];


tareas.forEach(t => crearTarjeta(t.texto, t.completada));
actualizarEstadisticas ();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const texto = input.value.trim();

  if (!validarTexto(texto)) {
    alert("La tarea no puede estar vacía ni contener caracteres inválidos.");
    return;
  }

  const nuevaTarea = { texto, completada: false };
  tareas.push(nuevaTarea);
  guardarTareas();
  crearTarjeta(nuevaTarea.texto, nuevaTarea.completada);
  input.value = "";
});

function validarTexto(texto) {
  const regex = /^[a-zA-Z0-9\s.,áéíóúÁÉÍÓÚñÑ]{1,100}$/;
  return regex.test(texto);
}

function guardarTareas() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
  actualizarEstadisticas();

}

function crearTarjeta(texto, completada) {
  const tarjeta = document.createElement("div");
  tarjeta.classList.add("tarjeta");
  if (completada) tarjeta.classList.add("completada");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = completada;

  const parrafo = document.createElement("p");
  parrafo.textContent = texto;

  const btnEditar = document.createElement("button");
  btnEditar.textContent = "Editar";
  btnEditar.classList.add("editar");

  const btnEliminar = document.createElement("button");
  btnEliminar.textContent = "X";
  btnEliminar.classList.add("eliminar");

  checkbox.addEventListener("change", () => {
    tarjeta.classList.toggle("completada", checkbox.checked);
    const index = obtenerIndice(parrafo.textContent);
    if (index !== -1) {
      tareas[index].completada = checkbox.checked;
      guardarTareas();
    }
  });

  btnEditar.addEventListener("click", () => {
    const nuevoTexto = prompt("Editar tarea:", parrafo.textContent);
    if (nuevoTexto && validarTexto(nuevoTexto.trim())) {
      const index = obtenerIndice(parrafo.textContent);
      if (index !== -1) {
        tareas[index].texto = nuevoTexto.trim();
        guardarTareas();
        parrafo.textContent = nuevoTexto.trim();
      }
    } else {
      alert("Texto inválido.");
    }
  });

  btnEliminar.addEventListener("click", () => {
    const index = obtenerIndice(parrafo.textContent);
    if (index !== -1) {
      tareas.splice(index, 1);
      guardarTareas();
      tarjeta.remove();
    }
  });

  tarjeta.appendChild(checkbox);
  tarjeta.appendChild(parrafo);
  tarjeta.appendChild(btnEditar);
  tarjeta.appendChild(btnEliminar);

  contenedor.appendChild(tarjeta);
}

function obtenerIndice(texto) {
  return tareas.findIndex(t => t.texto === texto);
}


function actualizarEstadisticas() {
  const total = tareas.length;
  const completadas = tareas.filter(t => t.completada).length;
  const pendientes = total - completadas;
  const porcentaje = total ? Math.round((completadas / total) * 100) : 0;

  document.getElementById("total").textContent = total;
  document.getElementById("completadas").textContent = completadas;
  document.getElementById("pendientes").textContent = pendientes;
  document.getElementById("porcentaje").textContent = `${porcentaje}%`;
}
