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

    // notificaciones con TOASTIFY
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
    
    //Cargar datos e inicio apicación
    function iniciarAplicacion() {
        fetch('./data/desafios.json')
            .then(respuesta => {
            
                if (!respuesta.ok) {
            
                    throw new Error(`Error HTTP: ${respuesta.status}`);
                }
                // Si la respuesta es correcta, se convierte en JSON
                return respuesta.json();
            })
            .then(data => {
                // Datos en variable local
                datosDeTodosLosDesafios = data;
                
                // Iniciar aplicación 
                mostrarPuntajes();
                botonIniciar.addEventListener('click', iniciarSesion);
                inputNombreUsuario.addEventListener('keyup', (evento) => {
                    if (evento.key === 'Enter') iniciarSesion();
                });
            })
            .catch(error => {
          
                console.error("No se pudieron cargar los datos de los desafíos:", error);
                mostrarNotificacion("Error al cargar los juegos.", "error");
            })
            .finally(() => {
          
            console.log("Proceso de carga de datos finalizado.");
          
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

    // Desafíos

    function iniciarDesafioMemoria() {
    const RONDAS_DE_JUEGO = 3;
    let rondaActual = 0;
    let aciertos = 0;

    const desafiosMezclados = [...datosDeTodosLosDesafios.memoria].sort(() => 0.5 - Math.random());
    const desafiosParaLaPartida = desafiosMezclados.slice(0, RONDAS_DE_JUEGO);

    function jugarRonda() {
        if (rondaActual >= RONDAS_DE_JUEGO) {
            mostrarResultado(aciertos, RONDAS_DE_JUEGO, "Memoria");
            return;
        }

        const desafioActual = desafiosParaLaPartida[rondaActual];
        const { tipo, secuencia, tiempo } = desafioActual;

        let separador = (tipo === 'palabras' || tipo === 'colores' || tipo === 'formas') ? ' ' : '';
        let placeholder = (tipo === 'palabras' || tipo === 'colores' || tipo === 'formas') ? 'PALABRA1 PALABRA2' : 'ABCD';
        let instruccion = `Ronda ${rondaActual + 1} de ${RONDAS_DE_JUEGO}: Memoriza la secuencia de ${tipo}.`;
    
        contenidoDesafio.innerHTML = `
            <p>${instruccion}</p>
            <div class="sequence-display">${secuencia.join(separador)}</div>
            <p>¡Tienes ${tiempo / 1000} segundos!</p>
        `;

        setTimeout(() => {
            contenidoDesafio.innerHTML = `
                <p class="ronda-info">Ronda ${rondaActual + 1} de ${RONDAS_DE_JUEGO}</p>
                <p>Escribe la secuencia que memorizaste:</p>
                <input type="text" id="secuencia-usuario" placeholder="Ej: ${placeholder}" autocomplete="off">
                <button id="verificar-desafio">Verificar</button>
            `;

            document.getElementById('secuencia-usuario').focus();
            
            document.getElementById('verificar-desafio').onclick = () => {
                const inputUsuario = document.getElementById('secuencia-usuario').value.toUpperCase();
                const respuestaUsuario = (tipo === 'palabras' || tipo === 'colores' || tipo === 'formas') ? inputUsuario.split(' ') : inputUsuario.split('');
                const esCorrecto = JSON.stringify(respuestaUsuario) === JSON.stringify(secuencia);
                
                if (esCorrecto) {
                    aciertos++;
                    mostrarNotificacion("¡Correcto!", "exito");
                } else {
                    mostrarNotificacion("Incorrecto.", "error");
                }
                
                rondaActual++;
                
                setTimeout(jugarRonda, 1200); 
            };
        }, tiempo);
    }
    jugarRonda();
}

    function iniciarDesafioOperaciones() {
  
    const RONDAS_DE_JUEGO = 5;
    let rondaActual = 0;
    let aciertos = 0;

    const operacionesMezcladas = [...datosDeTodosLosDesafios.operaciones].sort(() => 0.5 - Math.random());
    const operacionesParaLaPartida = operacionesMezcladas.slice(0, RONDAS_DE_JUEGO);

    //controla pregunta
    function proximaPregunta() {
       
        if (rondaActual >= RONDAS_DE_JUEGO) {
            mostrarResultado(aciertos, RONDAS_DE_JUEGO, "Operaciones");
            return;
        }

        const op = operacionesParaLaPartida[rondaActual];
        
        contenidoDesafio.innerHTML = `
            <p class="ronda-info">Operación ${rondaActual + 1} de ${RONDAS_DE_JUEGO}</p>
            <p>Resuelve: <strong>${op.pregunta}</strong></p>
            <input type="number" id="respuesta-usuario" placeholder="Tu respuesta" autocomplete="off">
            <button id="responder">Responder</button>
        `;

        document.getElementById('respuesta-usuario').focus();

        document.getElementById('responder').onclick = () => {
            const respuesta = parseInt(document.getElementById('respuesta-usuario').value);
            if (respuesta === op.resultadoEsperado) {
                aciertos++;
                mostrarNotificacion("¡Correcto!", "exito");
            } else {
                mostrarNotificacion(`Incorrecto. La respuesta era ${op.resultadoEsperado}`, "error");
            }
            
            // siguiente pregunta
            rondaActual++;
            setTimeout(proximaPregunta, 1200);
        };
    }

    proximaPregunta();
}
    
    function iniciarDesafioQuiz() {
  
    const RONDAS_DE_JUEGO = 5;
    let rondaActual = 0;
    let aciertos = 0;

    const preguntasMezcladas = [...datosDeTodosLosDesafios.quiz].sort(() => 0.5 - Math.random());
    const preguntasParaLaPartida = preguntasMezcladas.slice(0, RONDAS_DE_JUEGO);

    
    function presentarPregunta() {
       
        if (rondaActual >= RONDAS_DE_JUEGO) {
            mostrarResultado(aciertos, RONDAS_DE_JUEGO, "Quiz");
            return;
        }

        const preguntaActual = preguntasParaLaPartida[rondaActual];
        const opcionesHTML = preguntaActual.opciones.map((opcion, i) => `
            <label>
                <input type="radio" name="opcion-quiz" value="${i}">
                <span>${opcion}</span>
            </label>
        `).join('');

        contenidoDesafio.innerHTML = `
            <p class="ronda-info">Pregunta ${rondaActual + 1} de ${RONDAS_DE_JUEGO}</p>
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
                aciertos++;
                mostrarNotificacion("¡Correcto!", "exito");
            } else {
                mostrarNotificacion(`Incorrecto. La respuesta es: ${preguntaActual.opciones[preguntaActual.indiceRespuestaCorrecta]}`, "error");
            }
            //siguiente ronda
            rondaActual++;
            setTimeout(presentarPregunta, 1200);
        };
    }

    presentarPregunta();
}

   function iniciarDesafioAdivinarPalabra() {
 
    const RONDAS_DE_JUEGO = 2;
    let rondaActual = 0;
    let aciertos = 0;

    const palabrasMezcladas = [...datosDeTodosLosDesafios.adivinaLaPalabra].sort(() => 0.5 - Math.random());
    const palabrasParaLaPartida = palabrasMezcladas.slice(0, RONDAS_DE_JUEGO);

    //Controla ronda
    function jugarRonda() {
 
        if (rondaActual >= RONDAS_DE_JUEGO) {
            mostrarResultado(aciertos, RONDAS_DE_JUEGO, "Adivina la Palabra");
            return;
        }

        const desafioActual = palabrasParaLaPartida[rondaActual];
        const { palabraSecreta, pistas, intentosMaximos } = desafioActual;
        let intentos = 0;
        //Controla intentos
        function iniciarIntento() {

            if (intentos < intentosMaximos) {
                contenidoDesafio.innerHTML = `
                    <p class="ronda-info">Palabra ${rondaActual + 1} de ${RONDAS_DE_JUEGO}</p>
                    <p>Adivina la palabra. Te quedan ${intentosMaximos - intentos} intentos.</p>
                    <p><strong>Pista:</strong> ${pistas[intentos]}</p>
                    <input type="text" id="intento-usuario" placeholder="Tu intento" autocomplete="off">
                    <button id="adivinar">Adivinar</button>
                `;

                document.getElementById('intento-usuario').focus();

                document.getElementById('adivinar').onclick = () => {
                    const intentoUsuario = document.getElementById('intento-usuario').value.toUpperCase();
                    
                    // Si el usuario adivina la palabra
                    if (intentoUsuario === palabraSecreta) {
                        aciertos++;
                        mostrarNotificacion("¡Correcto! Adivinaste la palabra.", "exito");
                        rondaActual++; 
                        setTimeout(jugarRonda, 1500); 
                    } else {
                        intentos++;
                        mostrarNotificacion("Incorrecto, ¡inténtalo de nuevo!", "error");
                        // siguiente pista
                        setTimeout(iniciarIntento, 1500); 
                    }
                };
            } else {
                // Si se acabaron los intentos
                mostrarNotificacion(`No adivinaste. La palabra era: ${palabraSecreta}`, "error");
                rondaActual++; // siguiente ronda sin sumar punto
                setTimeout(jugarRonda, 2000); // Empezamos la siguiente ronda
            }
        }

        iniciarIntento();
    }

    jugarRonda();
}
    
    function mostrarReporte() {
    navegarHacia('reporte');
    const reporteContenido = document.getElementById('reporte-final-contenido');
    
    if (puntajesDeSesion.length === 0) {
        reporteContenido.innerHTML = `
            <img src="./static/img/logo-edukids.ico" alt="logo edukids" />
            <h3>Reporte de ${usuarioActual}</h3>
            <p>No completaste ningún desafío en esta sesión. ¡Juega una ronda para ver tu reporte!</p>
        `;
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
        <img src="./static/img/logo-edukids.ico" alt="logo edukids" />
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
