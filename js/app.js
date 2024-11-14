// variables selectores
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");

// eventos
evenListeners();
function evenListeners() {
  document.addEventListener("DOMContentLoaded", preguntarPresupuesto);
  formulario.addEventListener("submit", agregarGastos);
}

// clases
class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    this.calcularRestante();
  }

  eliminarGasto(id) {
    // Filtrar los gastos, excluyendo el que tiene el id dado
    this.gastos = this.gastos.filter(gasto => gasto.id !== id);
    this.calcularRestante();
  }

  calcularRestante() {
    const gastado = this.gastos.reduce(
      (total, gasto) => total + gasto.cantidad,
      0
    );
    this.restante = this.presupuesto - gastado;
  }
}

class UI {
  insertarPresupuesto(cantidad) {
    const { presupuesto, restante } = cantidad;
    document.querySelector("#total").textContent = presupuesto;
    document.querySelector("#restante").textContent = restante;
  }

  imprimirAlerta(mensaje, tipo) {
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("text-center", "alert");

    if (tipo === "error") {
      divMensaje.classList.add("alert-danger");
    } else {
      divMensaje.classList.add("alert-success");
    }

    // mensaje de alerta
    divMensaje.textContent = mensaje;

    // insertar en el html
    document.querySelector(".primario").insertBefore(divMensaje, formulario);

    // quitar del html después de 3 segundos
    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }

  agregarGastosListado(gastos) {
    this.limpiarHTML();

    // iterar sobre los gastos
    gastos.forEach((gasto) => {
      const { cantidad, nombre, id } = gasto;

      // crear li
      const nuevoGasto = document.createElement("li");
      nuevoGasto.className =
        "list-group-item d-flex justify-content-between align-items-center";
      nuevoGasto.setAttribute("data-id", id);
      nuevoGasto.dataset.id = id;

      // html gasto
      nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span>   `;

      // btn borrar gasto
      const btnBorrar = document.createElement("button");
      btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
      btnBorrar.innerHTML = "Borrar &times";
      btnBorrar.onclick = () => {
        eliminarGasto(id);
      }
      nuevoGasto.appendChild(btnBorrar);

      // agregar html
      gastoListado.appendChild(nuevoGasto);
    });
  }

  limpiarHTML() {
    while (gastoListado.firstChild) {
      gastoListado.removeChild(gastoListado.firstChild);
    }
  }

  actualizarRestante(restante) {
    document.querySelector("#restante").textContent = restante;
  }

  comprobarPresupuesto(presupuestoObj) {
    const { presupuesto, restante } = presupuestoObj;
    const restanteDiv = document.querySelector(".restante");

    // comprobar 25%
    if (presupuesto / 4 > restante) {
      restanteDiv.classList.remove("alert-success");
      restanteDiv.classList.add("alert-danger");
    } else if (presupuesto / 2 > restante) {
      restanteDiv.classList.remove("alert-success");
      restanteDiv.classList.add("alert-warning");
    }
  }
}

const ui = new UI();
let presupuesto;

// funciones
function preguntarPresupuesto() {
  const presupuestoUsuario = prompt("¿Cuál es tu presupuesto?");

  if (
    presupuestoUsuario === "" ||
    presupuestoUsuario === null ||
    isNaN(presupuestoUsuario) ||
    presupuestoUsuario <= 0
  ) {
    window.location.reload();
  }

  // presupuesto válido
  presupuesto = new Presupuesto(presupuestoUsuario);
  console.log(presupuesto);

  ui.insertarPresupuesto(presupuesto);
}

function agregarGastos(evento) {
  evento.preventDefault();

  const nombre = document.querySelector("#gasto").value;
  const cantidad = Number(document.querySelector("#cantidad").value);

  // validar
  if (nombre === "" || cantidad === "") {
    ui.imprimirAlerta("Ambos campos son obligatorios", "error");
    return;
  } else if (cantidad <= 0 || isNaN(cantidad)) {
    ui.imprimirAlerta("Cantidad no válida", "error");
    return;
  }

  // objeto con el gasto
  const gasto = {
    nombre,
    cantidad,
    id: Date.now(),
  };

  presupuesto.nuevoGasto(gasto);

  // mensaje de éxito
  ui.imprimirAlerta("Gasto agregado correctamente", "success");

  // imprimir los gastos
  const { gastos, restante } = presupuesto;
  ui.agregarGastosListado(presupuesto.gastos);
  ui.actualizarRestante(restante);
  ui.comprobarPresupuesto(presupuesto);

  formulario.reset();
}

function eliminarGasto(id) {
  // Eliminar el gasto desde el objeto presupuesto
  presupuesto.eliminarGasto(id);

  // Actualizar la lista de gastos y el presupuesto restante
  const { gastos, restante } = presupuesto;
  ui.agregarGastosListado(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarPresupuesto(presupuesto);
}