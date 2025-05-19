const form = document.getElementById("formTarea");
const input = document.getElementById("inputTarea");
const contenedor = document.getElementById("contenedorTarjetas");

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];


tareas.forEach(t => crearTarjeta(t));
actualizarEstadisticas ();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const texto = input.value.trim();
  const categoria = document.getElementById("categoriaTarea").value;
  const fecha = document.getElementById("fechaVencimiento").value;
  const importante = document.getElementById("tareaImportante").checked;

  if (!validarTexto(texto)) {
    alert("La tarea no puede estar vacía ni contener caracteres inválidos.");
    return;
  }

  const nuevaTarea = {
    texto,
    categoria,
    fecha,
    importante,
    completada: false
  };

  tareas.push(nuevaTarea);
  guardarTareas();
  crearTarjeta(nuevaTarea);
  form.reset(); 
});

function validarTexto(texto) {
  const regex = /^[a-zA-Z0-9\s.,áéíóúÁÉÍÓÚñÑ]{1,100}$/;
  return regex.test(texto);
}

function guardarTareas() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
  actualizarEstadisticas();

}
function crearTarjeta(tarea) {
  const tarjeta = document.createElement("div");
  tarjeta.classList.add("tarjeta");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = tarea.completada;

  const parrafo = document.createElement("p");
  parrafo.textContent = tarea.texto;

  const categoria = document.createElement("div");
  categoria.classList.add("categoria");
  categoria.textContent = `📁 ${tarea.categoria}`;

  const fechaVenc = tarea.fecha ? new Date(tarea.fecha) : null;
  const vencida = fechaVenc && new Date() > fechaVenc && !tarea.completada;

  if (vencida) {
    tarjeta.classList.add("vencida");
    categoria.textContent += " ⚠️ Vencida";
  }

  if (tarea.importante) {
    tarjeta.classList.add("importante");
    const estrella = document.createElement("span");
    estrella.textContent = "⭐";
    estrella.classList.add("estrella");
    tarjeta.appendChild(estrella);
  }

  const btnEditar = document.createElement("button");
  btnEditar.textContent = "✏️";
  btnEditar.classList.add("editar");

  const btnEliminar = document.createElement("button");
  btnEliminar.textContent = "X";
  btnEliminar.classList.add("eliminar");

  checkbox.addEventListener("change", () => {
    tarea.completada = checkbox.checked;
    guardarTareas();
    tarjeta.classList.toggle("completada", tarea.completada);
    if (tarea.completada) {
      tarjeta.classList.remove("vencida");
    } else if (fechaVenc && new Date() > fechaVenc) {
      tarjeta.classList.add("vencida");
    }
    actualizarEstadisticas();
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

document.getElementById("vaciarLista").addEventListener("click", () => {
  if (confirm("¿Seguro que querés eliminar TODAS las tareas?")) {
    tareas = [];
    guardarTareas();
    contenedor.innerHTML = "";
    actualizarEstadisticas();
  }
});
