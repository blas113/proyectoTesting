const form = document.getElementById("formTarea");
const input = document.getElementById("inputTarea");
const contenedor = document.getElementById("contenedorTarjetas");

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];


tareas.forEach(t => crearTarjeta(t));
actualizarEstadisticas();

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
    completada: false,
    subtareas: subtareasTemporales
  };
  subtareasTemporales = [];


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

  // if (tarea.importante) {
  //   tarjeta.classList.add("importante");
  //   const estrella = document.createElement("span");
  //   estrella.textContent = "⭐";
  //   estrella.classList.add("estrella");
  //   tarjeta.appendChild(estrella);
  // }

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




//  CAMBIAR A IMPORTANTE

const btnMarcarImportante = document.createElement("button");
btnMarcarImportante.textContent = tarea.importante ? "⭐" : "☆";
btnMarcarImportante.classList.add("btn-importante");

btnMarcarImportante.setAttribute("data-importante", tarea.importante);

btnMarcarImportante.addEventListener("click", () => {
  tarea.importante = !tarea.importante;
  guardarTareas();

  btnMarcarImportante.textContent = tarea.importante ? "⭐" : "☆";
  btnMarcarImportante.setAttribute("data-importante", tarea.importante);

  actualizarEstadisticas();
});







  tarjeta.appendChild(checkbox);
  tarjeta.appendChild(parrafo);
  tarjeta.appendChild(btnEditar);
  tarjeta.appendChild(btnEliminar);

  tarjeta.appendChild(btnMarcarImportante);



  contenedor.appendChild(tarjeta);

  if (tarea.subtareas && tarea.subtareas.length > 0) {
    const listaSub = document.createElement("ul");
    listaSub.classList.add("subtareas");

    tarea.subtareas.forEach((sub, index) => {
      const li = document.createElement("li");
      li.classList.add("subtarea-item");

      const subCheck = document.createElement("input");
      subCheck.type = "checkbox";
      subCheck.checked = sub.completada;

      subCheck.addEventListener("change", () => {
        sub.completada = subCheck.checked;
        guardarTareas();
      });

      const subTexto = document.createElement("span");
      subTexto.textContent = sub.texto;

      if (sub.completada) subTexto.style.textDecoration = "line-through";

      subCheck.addEventListener("change", () => {
        sub.completada = subCheck.checked;
        subTexto.style.textDecoration = subCheck.checked ? "line-through" : "none";
        guardarTareas();
      });

      const btnEliminarSub = document.createElement("button");
      btnEliminarSub.textContent = "❌";
      btnEliminarSub.classList.add("eliminar-sub");

      btnEliminarSub.addEventListener("click", () => {
        tarea.subtareas.splice(index, 1);
        guardarTareas();
        tarjeta.remove();
        crearTarjeta(tarea);
      });

      li.appendChild(subCheck);
      li.appendChild(subTexto);
      li.appendChild(btnEliminarSub);
      listaSub.appendChild(li);
    });

    tarjeta.appendChild(listaSub);
  }


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

  mostrarHistorial();
  verificarLogros();

  mostrarResumenPorDia();
}

function mostrarHistorial() {
  const historial = document.getElementById("historialCompletadas");
  historial.innerHTML = "";
  tareas.filter(t => t.completada).forEach(t => {
    const div = document.createElement("div");
    div.textContent = `✔ ${t.texto}`;
    historial.appendChild(div);
  });
}

document.getElementById("vaciarLista").addEventListener("click", () => {
  if (confirm("¿Seguro que querés eliminar TODAS las tareas?")) {
    tareas = [];
    guardarTareas();
    contenedor.innerHTML = "";
    actualizarEstadisticas();
  }
});


let subtareasTemporales = [];

document.getElementById("agregarSubtarea").addEventListener("click", () => {
  const subInput = document.getElementById("inputSubtarea");
  const texto = subInput.value.trim();
  if (texto && validarTexto(texto)) {
    subtareasTemporales.push({ texto, completada: false });
    mostrarSubtareasTemporales();
    subInput.value = "";
  }
});

function mostrarSubtareasTemporales() {
  const lista = document.getElementById("listaSubtareas");
  lista.innerHTML = "";
  subtareasTemporales.forEach((st, i) => {
    const li = document.createElement("li");
    li.textContent = st.texto;
    lista.appendChild(li);
  });
}


const nuevaTarea = {
  texto,
  categoria,
  fecha,
  importante,
  completada: false,
  subtareas: subtareasTemporales
};
subtareasTemporales = [];


function verificarLogros() {
  const completadas = tareas.filter(t => t.completada).length;
  const logro = document.getElementById("logro");

  if (completadas >= 5 && completadas < 10) {
    logro.textContent = "🏅 ¡Completaste 5 tareas!";
  } else if (completadas >= 10) {
    logro.textContent = "🥇 ¡Completaste 10 tareas!";
  } else {
    logro.textContent = "";
  }
}







// RESUMEN POR DIA 

function mostrarResumenPorDia() {
  const resumen = {};
  tareas.forEach(t => {
    if (t.fecha) {
      const dia = new Date(t.fecha).toLocaleDateString('es-AR', { weekday: 'long' });
      if (!resumen[dia]) resumen[dia] = [];
      resumen[dia].push(t.texto);
    }
  });

  const resumenDiv = document.getElementById("resumenPorDia");
  resumenDiv.innerHTML = "<h3>Resumen por día de la semana:</h3>";

  if (Object.keys(resumen).length === 0) {
    resumenDiv.innerHTML += "<p>No hay tareas asignadas a días específicos.</p>";
    return;
  }

  for (const dia in resumen) {
    const divDia = document.createElement("div");
    divDia.innerHTML = `<strong>${dia.charAt(0).toUpperCase() + dia.slice(1)}:</strong> ${resumen[dia].join(", ")}`;
    resumenDiv.appendChild(divDia);
  }
}



// MODO OSCURO 

function myFunction() {
  var element = document.body;
  element.classList.toggle("dark-mode");

  var boton = document.getElementById("modoOscuro");
  if (element.classList.contains("dark-mode")) {
    boton.textContent = "☀️ Modo Claro";
  } else {
    boton.textContent = "🌙 Modo Oscuro";
  }
}








