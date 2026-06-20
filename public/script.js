/*
================================================================================
ARCHIVO: script.js
FUNCION GENERAL:
Este archivo controla la logica del formulario.
Aqui se capturan los datos, se validan y se muestran en la pagina.
Los datos se guardan localmente en el navegador usando localStorage.
================================================================================
*/

// Clave de localStorage para guardar las inscripciones.
const STORAGE_KEY = "inscripcionesTalleres";

function obtenerInscripcionesLocal() {
    const datos = localStorage.getItem(STORAGE_KEY);
    return datos ? JSON.parse(datos) : [];
}

function guardarInscripcionesLocal(inscripciones) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inscripciones));
}

function generarId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

// Buscamos en el HTML el formulario que tiene el id "formularioInscripcion".
// Esta constante nos permite escuchar cuando el usuario intenta enviar el formulario.
const formulario = document.getElementById("formularioInscripcion");

// Buscamos el campo donde el usuario escribe su nombre completo.
// Con esta referencia podremos leer y validar el nombre escrito.
const nombre = document.getElementById("nombre");

// Buscamos el campo donde el usuario escribe su correo electronico.
// Este dato sera validado para comprobar que tenga formato de correo.
const correo = document.getElementById("correo");

// Buscamos el campo donde el usuario escribe su edad.
// Este dato se validara para asegurar que sea un numero mayor o igual a 12.
const edad = document.getElementById("edad");

// Buscamos el campo donde el usuario escribe su numero de contacto.
// Este dato se validara para comprobar que tenga exactamente 10 digitos.
const telefono = document.getElementById("telefono");

// Buscamos la lista desplegable donde el usuario selecciona el taller de interes.
// Este campo se validara para asegurar que el usuario seleccione una opcion real.
const taller = document.getElementById("taller");

// Buscamos el campo de observacion.
// Este campo sera opcional, por eso no se obliga al usuario a llenarlo.
const observacion = document.getElementById("observacion");

// Buscamos el contenedor del mensaje general.
// Aqui mostraremos mensajes como "Inscripcion guardada" o "Corrige los errores".
const mensajeGeneral = document.getElementById("mensajeGeneral");

// Buscamos el espacio donde se mostrara el error del nombre.
// Tener un espacio separado para cada error permite orientar mejor al usuario.
const errorNombre = document.getElementById("errorNombre");

// Buscamos el espacio donde se mostrara el error del correo.
const errorCorreo = document.getElementById("errorCorreo");

// Buscamos el espacio donde se mostrara el error de la edad.
const errorEdad = document.getElementById("errorEdad");

// Buscamos el espacio donde se mostrara el error del telefono.
const errorTelefono = document.getElementById("errorTelefono");

// Buscamos el espacio donde se mostrara el error del taller.
const errorTaller = document.getElementById("errorTaller");

// Buscamos el contenedor donde se van a mostrar las inscripciones guardadas.
const listaInscripciones = document.getElementById("listaInscripciones");

// Botones adicionales para limpiar el formulario, recargar la lista de inscripciones y comprobar el funcionamiento.
const botonLimpiar = document.getElementById("btnLimpiar");
const botonActualizar = document.getElementById("btnActualizar");
const botonVerificar = document.getElementById("btnVerificar");

/*
================================================================================
FUNCION: limpiarErrores
OBJETIVO:
Borrar los mensajes de error anteriores antes de hacer una nueva validacion.
Esto evita que queden mensajes viejos en pantalla cuando el usuario corrige los datos.
================================================================================
*/
function limpiarErrores() {
    // Dejamos vacio el mensaje de error del nombre.
    errorNombre.textContent = "";

    // Dejamos vacio el mensaje de error del correo.
    errorCorreo.textContent = "";

    // Dejamos vacio el mensaje de error de la edad.
    errorEdad.textContent = "";

    // Dejamos vacio el mensaje de error del telefono.
    errorTelefono.textContent = "";

    // Dejamos vacio el mensaje de error del taller.
    errorTaller.textContent = "";

    // Ocultamos el mensaje general para que no se mezcle con una nueva validacion.
    mensajeGeneral.className = "mensaje oculto";

    // Borramos el texto del mensaje general.
    mensajeGeneral.textContent = "";
}

/*
================================================================================
FUNCION: mostrarMensaje
PARAMETROS:
texto: mensaje que queremos mostrar.
tipo: puede ser "exito" o "fallo" para cambiar el color del mensaje.
================================================================================
*/
function mostrarMensaje(texto, tipo) {
    // Insertamos el texto recibido dentro del contenedor de mensajes.
    mensajeGeneral.textContent = texto;

    // Asignamos las clases CSS necesarias para mostrar el mensaje con el color correcto.
    mensajeGeneral.className = `mensaje ${tipo}`;
}

/*
================================================================================
FUNCION: limpiarFormulario
OBJETIVO:
Reiniciar el formulario y limpiar los mensajes de error y estado.
================================================================================
*/
function limpiarFormulario() {
    formulario.reset();
    limpiarErrores();
}

/*
================================================================================
FUNCION: probarServidor
OBJETIVO:
Informar que la aplicacion funciona sin servidor y guarda los datos en el navegador.
================================================================================
*/
function probarServidor() {
    mostrarMensaje("Esta pagina funciona sin servidor. Los datos se guardan localmente en este navegador.", "exito");
}

/*
================================================================================
FUNCION: validarFormulario
OBJETIVO:
Revisar que los datos ingresados cumplan las reglas del proyecto.
Si todo esta correcto, devuelve true.
Si hay errores, devuelve false.
================================================================================
*/
function validarFormulario() {
    // Limpiamos errores anteriores para comenzar la validacion desde cero.
    limpiarErrores();

    // Creamos una variable booleana llamada esValido.
    // Inicia en true porque asumimos que el formulario esta bien hasta encontrar un error.
    let esValido = true;

    // Obtenemos el valor del campo nombre y usamos trim para quitar espacios al inicio y al final.
    const valorNombre = nombre.value.trim();

    // Obtenemos el valor del campo correo y quitamos espacios innecesarios.
    const valorCorreo = correo.value.trim();

    // Obtenemos el valor del campo edad y quitamos espacios innecesarios.
    const valorEdad = edad.value.trim();

    // Obtenemos el valor del campo telefono y quitamos espacios innecesarios.
    const valorTelefono = telefono.value.trim();

    // Obtenemos el valor seleccionado en la lista de talleres.
    const valorTaller = taller.value;

    // Creamos una expresion regular para validar correos de forma sencilla.
    // Esta regla revisa que haya texto antes y despues del simbolo @ y un punto al final.
    const reglaCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Creamos una expresion regular para validar telefonos de 10 digitos.
    // \d representa un digito y {10} significa exactamente diez veces.
    const reglaTelefono = /^\d{10}$/;

    // Validamos si el nombre esta vacio.
    if (valorNombre === "") {
        // Mostramos un mensaje de error debajo del campo nombre.
        errorNombre.textContent = "El nombre completo es obligatorio.";

        // Cambiamos esValido a false porque encontramos un error.
        esValido = false;
    } else if (valorNombre.length < 3) {
        // Si el nombre no esta vacio pero tiene menos de 3 caracteres, tambien es invalido.
        errorNombre.textContent = "El nombre debe tener minimo 3 caracteres.";

        // Marcamos el formulario como invalido.
        esValido = false;
    }

    // Validamos si el correo esta vacio.
    if (valorCorreo === "") {
        // Mostramos un error si no se escribio correo.
        errorCorreo.textContent = "El correo electronico es obligatorio.";

        // Marcamos el formulario como invalido.
        esValido = false;
    } else if (!reglaCorreo.test(valorCorreo)) {
        // test revisa si el correo cumple la expresion regular.
        // El simbolo ! significa negacion, es decir, si NO cumple la regla.
        errorCorreo.textContent = "Escribe un correo valido. Ejemplo: usuario@gmail.com";

        // Marcamos el formulario como invalido.
        esValido = false;
    }

    // Validamos si la edad esta vacia.
    if (valorEdad === "") {
        // Mostramos error si el usuario no escribio edad.
        errorEdad.textContent = "La edad es obligatoria.";

        // Marcamos el formulario como invalido.
        esValido = false;
    } else if (Number(valorEdad) < 12) {
        // Convertimos la edad a numero y revisamos si es menor que 12.
        errorEdad.textContent = "La edad debe ser mayor o igual a 12 anos.";

        // Marcamos el formulario como invalido.
        esValido = false;
    }

    // Validamos si el telefono esta vacio.
    if (valorTelefono === "") {
        // Mostramos error si no se escribio telefono.
        errorTelefono.textContent = "El numero de contacto es obligatorio.";

        // Marcamos el formulario como invalido.
        esValido = false;
    } else if (!reglaTelefono.test(valorTelefono)) {
        // Si el telefono no tiene exactamente 10 digitos, mostramos error.
        errorTelefono.textContent = "El telefono debe tener exactamente 10 digitos numericos.";

        // Marcamos el formulario como invalido.
        esValido = false;
    }

    // Validamos si el usuario no selecciono un taller.
    if (valorTaller === "") {
        // Mostramos error debajo de la lista desplegable.
        errorTaller.textContent = "Debes seleccionar un taller.";

        // Marcamos el formulario como invalido.
        esValido = false;
    }

    // Devolvemos true si no hubo errores o false si se encontro al menos uno.
    return esValido;
}

/*
================================================================================
FUNCION: obtenerDatosFormulario
OBJETIVO:
Construir un objeto con los datos que el usuario escribio.
Este objeto se guardara localmente en el navegador.
================================================================================
*/
function obtenerDatosFormulario() {
    // Retornamos un objeto JavaScript con los datos del formulario.
    return {
        // Guardamos el nombre sin espacios sobrantes al inicio o al final.
        nombre: nombre.value.trim(),

        // Guardamos el correo sin espacios sobrantes.
        correo: correo.value.trim(),

        // Guardamos la edad convertida a numero.
        edad: Number(edad.value.trim()),

        // Guardamos el telefono como texto porque no se usara para operaciones matematicas.
        telefono: telefono.value.trim(),

        // Guardamos el taller seleccionado.
        taller: taller.value,

        // Guardamos la observacion; si esta vacia, simplemente se enviara un texto vacio.
        observacion: observacion.value.trim()
    };
}

/*
================================================================================
FUNCION: cargarInscripciones
OBJETIVO:
Cargar la lista de inscripciones desde localStorage y mostrarlas en pantalla.
================================================================================
*/
async function cargarInscripciones() {
    try {
        const inscripciones = obtenerInscripcionesLocal();
        mostrarInscripciones(inscripciones);
        return true;
    } catch (error) {
        listaInscripciones.innerHTML = "<p>No fue posible cargar las inscripciones.</p>";
        mostrarMensaje("Ocurrió un error al leer los datos locales.", "fallo");
        console.error("Error cargando inscripciones:", error);
        return false;
    }
}

/*
================================================================================
FUNCION: mostrarInscripciones
PARAMETRO:
inscripciones: arreglo con los registros que vienen desde la base de datos.
================================================================================
*/
function mostrarInscripciones(inscripciones) {
    // Limpiamos el contenedor antes de insertar la lista actualizada.
    listaInscripciones.innerHTML = "";

    // Revisamos si no hay inscripciones guardadas.
    if (inscripciones.length === 0) {
        // Mostramos un mensaje cuando la base de datos aun esta vacia.
        listaInscripciones.innerHTML = "<p>Aun no hay inscripciones registradas.</p>";

        // Usamos return para terminar la funcion y no ejecutar el resto del codigo.
        return;
    }

    // Recorremos cada inscripcion recibida desde la base de datos.
    inscripciones.forEach((inscripcion) => {
        // Creamos un elemento div para representar visualmente una inscripcion.
        const tarjeta = document.createElement("div");

        // Asignamos la clase registro para que CSS le aplique diseno.
        tarjeta.className = "registro";

        // Insertamos dentro de la tarjeta la informacion de la persona inscrita.
        tarjeta.innerHTML = `
            <h3>${inscripcion.nombre}</h3>
            <p><strong>Correo:</strong> ${inscripcion.correo}</p>
            <p><strong>Edad:</strong> ${inscripcion.edad}</p>
            <p><strong>Telefono:</strong> ${inscripcion.telefono}</p>
            <p><strong>Taller:</strong> ${inscripcion.taller}</p>
            <p><strong>Observacion:</strong> ${inscripcion.observacion || "Sin observacion"}</p>
            <button class="boton-eliminar" onclick="eliminarInscripcion(${inscripcion.id})">Eliminar</button>
        `;

        // Agregamos la tarjeta creada dentro del contenedor de inscripciones.
        listaInscripciones.appendChild(tarjeta);
    });
}

/*
================================================================================
FUNCION: eliminarInscripcion
OBJETIVO:
Eliminar de la base de datos una inscripcion especifica usando su id.
================================================================================
*/
function eliminarInscripcion(id) {
    const confirmar = confirm("Deseas eliminar esta inscripcion?");
    if (!confirmar) {
        return;
    }

    const inscripciones = obtenerInscripcionesLocal();
    const nuevasInscripciones = inscripciones.filter((inscripcion) => inscripcion.id !== id);
    guardarInscripcionesLocal(nuevasInscripciones);
    mostrarMensaje("Inscripcion eliminada correctamente.", "exito");
    cargarInscripciones();
}

/*
================================================================================
EVENTO: submit del formulario
OBJETIVO:
Controlar lo que ocurre cuando el usuario presiona el boton Guardar inscripcion.
================================================================================
*/
formulario.addEventListener("submit", async function (evento) {
    // preventDefault evita que el navegador recargue la pagina al enviar el formulario.
    evento.preventDefault();

    // Validamos el formulario antes de guardar los datos localmente.
    const formularioValido = validarFormulario();

    // Si el formulario no es valido, mostramos mensaje general y detenemos el proceso.
    if (!formularioValido) {
        // Mensaje general para indicar que hay errores pendientes.
        mostrarMensaje("Revisa los campos marcados antes de guardar la inscripcion.", "fallo");

        // return detiene la funcion porque no se envie informacion incorrecta.
        return;
    }

    // Obtenemos los datos del formulario en forma de objeto JavaScript.
    const datos = obtenerDatosFormulario();

    try {
        const inscripciones = obtenerInscripcionesLocal();
        datos.id = generarId();
        inscripciones.unshift(datos);
        guardarInscripcionesLocal(inscripciones);

        mostrarMensaje("Inscripción guardada correctamente.", "exito");
        formulario.reset();
        cargarInscripciones();
    } catch (error) {
        mostrarMensaje("No fue posible guardar la inscripcion localmente.", "fallo");
        console.error("Error guardando inscripcion:", error);
    }
});
if (botonLimpiar) {
    botonLimpiar.addEventListener("click", limpiarFormulario);
}

if (botonActualizar) {
    botonActualizar.addEventListener("click", cargarInscripciones);
}

if (botonVerificar) {
    botonVerificar.addEventListener("click", probarServidor);
}

// Cuando el navegador carga este archivo, inicializamos la lista local de inscripciones.
async function iniciarAplicacion() {
    await cargarInscripciones();
}

iniciarAplicacion();
