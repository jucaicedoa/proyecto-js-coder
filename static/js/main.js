document.addEventListener('DOMContentLoaded', () => {

    let datosDeTodosLosDesafios = {};
    let usuarioActual = null;
    let puntajesDeSesion = [];

    const seccionLogin = document.getElementById('seccion-login');
    const seccionMenu = document.getElementById('seccion-menu');
    const seccionDesafio = document.getElementById('seccion-desafio');
    const seccionReporte = document.getElementById('seccion-reporte');
    const tituloHeader = document.getElementById('header-title');
    const inputNombreUsuario = document.getElementById('nombre-usuario');
    const botonIniciar = document.getElementById('btn-iniciar');
    const tituloDesafio = document.getElementById('desafio-titulo');
    const contenidoDesafio = document.getElementById('contenido-desafio');
    const listaDePuntajes = document.getElementById('score-lista');
    const botonVolverMenu = document.getElementById('btn-volver-menu');
    const botonLimpiarHistorial = document.getElementById('btn-limpiar-historial');
    const botonFinalizarSesion = document.getElementById('btn-finalizar-sesion');
    const botonJugarOtraVez = document.getElementById('btn-jugar-otra-vez');
    const botonesDelMenu = document.querySelectorAll('.menu-opciones button');


    // Función Notificaciones con TOASTIFY
    /**
     * Muestra una notificación en pantalla usando Toastify.js.
     * @param {string} texto El mensaje a mostrar.
     * @param {string} tipo  exito(verde),error(rojo), aviso(azul).
     */
    function mostrarNotificacion(texto, tipo = 'aviso') {
        const colores = {
            exito: "linear-gradient(to right, #00b09b, #96c93d)",
            error: "linear-gradient(to right, #ff5f6d, #ffc371)",
            aviso: "linear-gradient(to right, #007bff, #00bfff)"
        };

        Toastify({
            text: texto,
            duration: 3000,
            close: true,
            gravity: "top", 
            position: "right", 
            stopOnFocus: true,
            style: {
                background: colores[tipo] || colores['aviso'],
            },
        }).showToast();
    }

    //Carga de datos con fetch
    async function cargarDatos() {
        try {
            const respuesta = await fetch('./static/data/desafios.json');
            if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
            datosDeTodosLosDesafios = await respuesta.json();
        } catch (error) {
            console.error("No se pudieron cargar los datos de los desafíos:", error);
            mostrarNotificacion("Error al cargar los desafíos.", "error");
        }
    }

    async function iniciarAplicacion() {
        await cargarDatos();
        mostrarPuntajes();
        botonIniciar.addEventListener('click', iniciarSesion);
        inputNombreUsuario.addEventListener('keyup', (evento) => {
            if (evento.key === 'Enter') iniciarSesion();
        });
    }

    function iniciarSesion() {
        const nombre = inputNombreUsuario.value.trim();
        if (nombre) {
            usuarioActual = nombre;
            puntajesDeSesion = [];
            tituloHeader.textContent = `¡A jugar, ${usuarioActual}!`;
            navegarHacia('menu');
        } else {
            mostrarNotificacion("Por favor, escribe tu nombre para empezar.", "aviso");
        }
    }
    
    function navegarHacia(seccion) {
        seccionLogin.style.display = 'none';
        seccionMenu.style.display = 'none';
        seccionDesafio.style.display = 'none';
        seccionReporte.style.display = 'none';
        document.getElementById(`seccion-${seccion}`).style.display = 'flex';
    }
    
    function guardarPuntaje(nombreDesafio, puntaje, total) {
        try {
            const puntajesGuardados = JSON.parse(localStorage.getItem('edukidsScores')) || [];
            const nuevoPuntaje = {
                usuario: usuarioActual,
                desafio: nombreDesafio,
                puntaje,
                total,
                fecha: new Date().toLocaleString()
            };
            puntajesGuardados.push(nuevoPuntaje);
            puntajesDeSesion.push(nuevoPuntaje);
            localStorage.setItem('edukidsScores', JSON.stringify(puntajesGuardados));
        } catch (error) {
            console.error("Error al guardar el puntaje: ", error);
        }
    }
    
    function mostrarPuntajes() {
        listaDePuntajes.innerHTML = '';
        try {
            const puntajesGuardados = JSON.parse(localStorage.getItem('edukidsScores')) || [];
            if (puntajesGuardados.length === 0) {
                listaDePuntajes.innerHTML = '<li>No hay puntajes guardados aún.</li>';
                return;
            }
            
            const itemsHTML = puntajesGuardados.reverse().map(p => 
                `<li>${p.fecha} - ${p.usuario || 'Jugador'} - ${p.desafio}: <strong>${p.puntaje}/${p.total}</strong></li>`
            ).join('');
            
            listaDePuntajes.innerHTML = itemsHTML;

        } catch (error) {
            console.error("Error al mostrar los puntajes: ", error);
            listaDePuntajes.innerHTML = '<li>Error al cargar puntajes.</li>';
        }
    }

    function mostrarResultado(aciertos, total, nombreDesafio) {
        let mensaje;
        if (aciertos === total) {
            mensaje = `¡Excelente! Respondiste todo correctamente en ${nombreDesafio}.`;
            mostrarNotificacion(mensaje, "exito");
        } else {
            mensaje = `Acertaste ${aciertos} de ${total} en ${nombreDesafio}. ¡Sigue practicando!`;
            mostrarNotificacion(mensaje, "aviso");
        }
        
        guardarPuntaje(nombreDesafio, aciertos, total);
        mostrarPuntajes();
        navegarHacia('menu');
    }

    const ejecutarDesafio = (idDelDesafio) => {
        const desafios = {
            'memoria': { titulo: "Desafío de Memoria", funcion: iniciarDesafioMemoria },
            'operaciones': { titulo: "Desafío de Operaciones", funcion: iniciarDesafioOperaciones },
            'quiz': { titulo: "Desafío de Quiz", funcion: iniciarDesafioQuiz },
            'adivinaLaPalabra': { titulo: "Adivina la Palabra", funcion: iniciarDesafioAdivinarPalabra }
        };

        if (desafios[idDelDesafio]) {
            const { titulo, funcion } = desafios[idDelDesafio];
            navegarHacia('desafio');
            tituloDesafio.textContent = titulo;
            contenidoDesafio.innerHTML = '';
            funcion();
        }
    };


    function iniciarDesafioMemoria() {
        const desafiosMemoria = datosDeTodosLosDesafios.memoria;
        const desafioActual = desafiosMemoria[Math.floor(Math.random() * desafiosMemoria.length)];
        const { tipo, secuencia, tiempo } = desafioActual;

        let separador = (tipo === 'palabras') ? ' ' : '';
        let placeholder = (tipo === 'palabras') ? 'PALABRA1 PALABRA2' : 'ABCD';
        let instruccion = `Memoriza esta secuencia de ${tipo}:`;

        contenidoDesafio.innerHTML = `
            <p>${instruccion}</p>
            <div class="sequence-display">${secuencia.join(separador)}</div>
            <p>¡Tienes ${tiempo / 1000} segundos!</p>
        `;

        setTimeout(() => {
            contenidoDesafio.innerHTML = `
                <p>Escribe la secuencia que memorizaste:</p>
                <input type="text" id="secuencia-usuario" placeholder="Ej: ${placeholder}">
                <button id="verificar-desafio">Verificar</button>
            `;
            document.getElementById('verificar-desafio').onclick = () => {
                const inputUsuario = document.getElementById('secuencia-usuario').value.toUpperCase();
                const respuestaUsuario = (tipo === 'palabras') ? inputUsuario.split(' ') : inputUsuario.split('');
                
                const acierto = JSON.stringify(respuestaUsuario) === JSON.stringify(secuencia) ? 1 : 0;
                
                mostrarResultado(acierto, 1, "Memoria");
            };
        }, tiempo);
    }

    function iniciarDesafioOperaciones() {
        const operaciones = datosDeTodosLosDesafios.operaciones;
        let indicePregunta = 0;
        let respuestasCorrectas = 0;

        function proximaPregunta() {
            if (indicePregunta < operaciones.length) {
                const op = operaciones[indicePregunta];
                contenidoDesafio.innerHTML = `
                    <p>Resuelve: <strong>${op.pregunta}</strong></p>
                    <input type="number" id="respuesta-usuario" placeholder="Tu respuesta">
                    <button id="responder">Responder</button>
                `;
                document.getElementById('responder').onclick = () => {
                    const respuesta = parseInt(document.getElementById('respuesta-usuario').value);
                    if (respuesta === op.resultadoEsperado) {
                        respuestasCorrectas++;
                        mostrarNotificacion("¡Correcto!", "exito");
                    } else {
                        mostrarNotificacion(`Incorrecto. La respuesta era ${op.resultadoEsperado}`, "error");
                    }
                    indicePregunta++;
                    
                    setTimeout(proximaPregunta, 1000);
                };
            } else {
                mostrarResultado(respuestasCorrectas, operaciones.length, "Operaciones");
            }
        }
        proximaPregunta();
    }
    
    function iniciarDesafioQuiz() {
        const preguntas = datosDeTodosLosDesafios.quiz;
        let indicePregunta = 0;
        let respuestasCorrectas = 0;
    
        function presentarPregunta() {
            if (indicePregunta < preguntas.length) {
                const preguntaActual = preguntas[indicePregunta];
                const opcionesHTML = preguntaActual.opciones.map((opcion, i) => `
                    <label>
                        <input type="radio" name="opcion-quiz" value="${i}">
                        <span>${opcion}</span>
                    </label>
                `).join('');
    
                contenidoDesafio.innerHTML = `
                    <p>${preguntaActual.pregunta}</p>
                    <div class="quiz-options">${opcionesHTML}</div>
                    <button id="responder-quiz">Responder</button>
                `;
    
                document.getElementById('responder-quiz').onclick = () => {
                    const opcionSeleccionada = document.querySelector('input[name="opcion-quiz"]:checked');
                    if (!opcionSeleccionada) {
                        mostrarNotificacion("Debes seleccionar una opción", "aviso");
                        return;
                    }
                    if (parseInt(opcionSeleccionada.value) === preguntaActual.indiceRespuestaCorrecta) {
                        respuestasCorrectas++;
                        mostrarNotificacion("¡Correcto!", "exito");
                    } else {
                        mostrarNotificacion(`Incorrecto. La respuesta es: ${preguntaActual.opciones[preguntaActual.indiceRespuestaCorrecta]}`, "error");
                    }
                    indicePregunta++;
                    setTimeout(presentarPregunta, 1200);
                };
            } else {
                mostrarResultado(respuestasCorrectas, preguntas.length, "Quiz");
            }
        }
        presentarPregunta();
    }

    function iniciarDesafioAdivinarPalabra() {
        const listaDePalabras = datosDeTodosLosDesafios.adivinaLaPalabra;
        const desafioActual = listaDePalabras[Math.floor(Math.random() * listaDePalabras.length)];
        const { palabraSecreta, pistas, intentosMaximos } = desafioActual;
        let intentos = 0;

        function iniciarIntento() {
            if (intentos < intentosMaximos) {
                contenidoDesafio.innerHTML = `
                    <p>Adivina la palabra. Tienes ${intentosMaximos - intentos} intentos.</p>
                    <p><strong>Pista:</strong> ${pistas[intentos]}</p>
                    <input type="text" id="intento-usuario" placeholder="Tu intento">
                    <button id="adivinar">Adivinar</button>
                `;
                document.getElementById('adivinar').onclick = () => {
                    const intento = document.getElementById('intento-usuario').value.toUpperCase();
                    if (intento === palabraSecreta) {
                        mostrarResultado(1, 1, "Adivina la Palabra");
                    } else {
                        intentos++;
                        mostrarNotificacion("Incorrecto, ¡inténtalo de nuevo!", "error");
                        if (intentos < intentosMaximos) {
                            setTimeout(iniciarIntento, 1500);
                        } else {
                             setTimeout(() => {
                                mostrarNotificacion(`Se acabaron los intentos. La palabra era ${palabraSecreta}`, "error");
                                setTimeout(() => mostrarResultado(0, 1, "Adivina la Palabra"), 1500);
                            }, 1500);
                        }
                    }
                };
            } 
        }
        iniciarIntento();
    }
    
    function mostrarReporte() {
        navegarHacia('reporte');
        const reporteContenido = document.getElementById('reporte-final-contenido');
        
        if (puntajesDeSesion.length === 0) {
            reporteContenido.innerHTML = `<h3>Reporte de ${usuarioActual}</h3><p>No completaste ningún desafío en esta sesión. ¡Juega una ronda para ver tu reporte!</p>`;
            return;
        }

        let totalAciertos = 0;
        let totalPosibles = 0;
        
        for(const puntaje of puntajesDeSesion) {
            totalAciertos += puntaje.puntaje;
            totalPosibles += puntaje.total;
        }

        const listaResultadosHTML = puntajesDeSesion.map(p => `<li>${p.desafio}: ${p.puntaje}/${p.total}</li>`).join('');

        reporteContenido.innerHTML = `
            <h3>Reporte de ${usuarioActual}</h3>
            <p>Aquí está tu resumen de esta sesión:</p>
            <ul>${listaResultadosHTML}</ul>
            <hr>
            <p><strong>Puntaje Total de la Sesión: ${totalAciertos} de ${totalPosibles} correctas.</strong></p>
        `;
    }


    botonLimpiarHistorial.addEventListener('click', () => {
     
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Esto borrará todo el historial de puntajes permanentemente!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, ¡bórralo!',
            cancelButtonText: 'Cancelar'
        }).then((resultado) => {
            if (resultado.isConfirmed) {
                localStorage.removeItem('edukidsScores');
                mostrarPuntajes();
                mostrarNotificacion("Historial borrado con éxito", "exito");
            }
        });
    });

    botonesDelMenu.forEach(boton => {
        boton.addEventListener('click', (evento) => {
            const idDesafio = evento.target.dataset.challenge;
            ejecutarDesafio(idDesafio);
        });
    });
    
    botonVolverMenu.addEventListener('click', () => navegarHacia('menu'));
    
    botonFinalizarSesion.addEventListener('click', mostrarReporte);
    
    botonJugarOtraVez.addEventListener('click', () => {
        puntajesDeSesion = [];
        navegarHacia('menu');
    });

   
    iniciarAplicacion();
});
