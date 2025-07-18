const seccionMenu = document.getElementById('menu-seccion');
const seccionDesafio = document.getElementById('seccion-desafio');
const challengeTitle = document.getElementById('desafio-titulo');
const contenidoDesafio = document.getElementById('contenido-desafio');
const challengeResult = document.getElementById('challenge-result'); 
const scoreLista = document.getElementById('score-lista');
const botonVolverMenu = document.getElementById('btn-volver-menu');
const botonLimpiarScore = document.getElementById('btn-limpiar-score');
const menuBotones = document.querySelectorAll('.menu-opciones button[data-challenge]');


/**
 * Guardar  puntaje en localStorage.
 * @param {string} NombreDesafio - Nombre del desafío.
 * @param {number} score - Puntaje obtenido.
 * @param {number} total - Total posible.
 */
function GuardarScore(NombreDesafio, score, total) {
    const scores = JSON.parse(localStorage.getItem('edukidsScores')) || [];
    const nuevoScore = {
        challenge: NombreDesafio,
        score: score,
        total: total,
        date: new Date().toLocaleString()
    };
    scores.push(nuevoScore);
    localStorage.setItem('edukidsScores', JSON.stringify(scores));
}

/**
 * Mostrar los puntajes guardados en localStorage.
 */
function mostrarScores() {
    scoreLista.innerHTML = '';
    const scores = JSON.parse(localStorage.getItem('edukidsScores')) || [];
    if (scores.length === 0) {
        scoreList.innerHTML = '<li>No hay puntajes guardados aún.</li>';
        return;
    }
    //últimos puntajes se ven primero
    const reversaScores = [...scores].reverse();
    reversaScores.forEach(s => {
        const listaItems = document.createElement('li');
        listaItems.textContent = `${s.date} - ${s.challenge}: ${s.score}/${s.total}`;
        scoreLista.appendChild(listaItems);
    });
}

/**
 * Mostrar el resultado de un desafío y vuelve al menú principal.
 * Se muestra un alert para el feedback inmediato y luego se regresa al menú donde están los puntajes.
 * @param {number} aciertos - Número de respuestas correctas.
 * @param {number} total - Número total de preguntas/elementos.
 * @param {string} NombreDesafio - Nombre del desafío.
 */
function mostrarResultado(aciertos, total, NombreDesafio) {
    let message;
    if (aciertos === total) {
        message = `¡Excelente! Respondiste todo correctamente en ${NombreDesafio}.`;
    } else {
        message = `Acertaste ${aciertos} de ${total} en ${NombreDesafio}. ¡Sigue practicando!`;
    }
    alert(message); // Feedback 

    GuardarScore(NombreDesafio, aciertos, total);
    mostrarScores(); // Actualizar lista de puntajes en el menú

    // Regresar al menú principal
    seccionDesafio.style.display = 'none';
    seccionMenu.style.display = 'block';
}
/**
 * Ejecutar un desafío.
 * Ocultar el menú, mostrar la sección del desafío.
 * @param {string} title - Título del desafío.
 * @param {Function} FuncionDesafio - La función del desafío a ejecutar.
 */
const ejecutarDesafio = (title, FuncionDesafio) => {
    seccionMenu.style.display = 'none'; // Ocultar el menú principal
    seccionDesafio.style.display = 'block'; // Mostrar sección del desafío
    challengeTitle.textContent = title;
    contenidoDesafio.innerHTML = ''; // Limpiar contenido anterior
    contenidoDesafio.classList.add('active-challenge-content');
    FuncionDesafio(); // Ejecutae desafío
};

//Clases para Desafíos (Objetos) y Lógica de Desafíos
//Representa una pregunta de tipo Quiz.
 
class PreguntaQuiz {
    constructor(pregunta, opciones, indexarRespuestaCorrecta) {
        this.pregunta = pregunta;
        this.opciones = opciones;
        this.indexarRespuestaCorrecta = indexarRespuestaCorrecta; 
    }

    isCorrect(userAnswer) {
        return parseInt(userAnswer) === this.indexarRespuestaCorrecta;
    }

    getCorrectOptionText() {
        return this.opciones[this.indexarRespuestaCorrecta - 1];
    }
}

// Desafío 1: Memoria
function desafio1() {
    const secuencia = ['A', 'F', 'G', 'D'];
    const tiempoMemorizacion = 3000; //3 segundos

    // Mostrar secuencia a memorizar
    contenidoDesafio.innerHTML = `
        <p>Memoriza esta secuencia:</p>
        <div class="sequence-display"><strong>${secuencia.join('')}</strong></div>
        <p>¡Prepárate para recordar!</p>
    `;

    //setTimeout para borrar la secuencia y mostrar el campo de entrada
    setTimeout(() => {
        contenidoDesafio.innerHTML = `
            <p>Escribe la secuencia que memorizaste:</p>
            <input type="text" id="secuencia-usuario" placeholder="Ej: OFJD">
            <button id="verificar-desafio1">Verificar</button>
        `;

        const verificarDesafio = document.getElementById('verificar-desafio1');
        if (verificarDesafio) {
            verificarDesafio.onclick = () => {
                const respuestaUsuario = document.getElementById('secuencia-usuario').value.toUpperCase().split('');
                let acertoTodo = true;

                if (respuestaUsuario.length !== secuencia.length) {
                    acertoTodo = false;
                } else {
                    for (let i = 0; i < secuencia.length; i++) {
                        if (respuestaUsuario[i] !== secuencia[i]) {
                            acertoTodo = false;
                            break;
                        }
                    }
                }

                if (acertoTodo) {
                    mostrarResultado(1, 1, "Memoria"); // 1 acierto de 1 posible
                } else {
                    mostrarResultado(0, 1, "Memoria"); // 0 aciertos de 1 posible
                }
            };
        }
    }, tiempoMemorizacion);
}

// Desafío 2: Operaciones
async function desafio2() {
    const operaciones = [
        { pregunta: "3 + 4", resultadoEsperado: 7 },
        { pregunta: "10 - 2", resultadoEsperado: 8 },
        { pregunta: "5 * 2", resultadoEsperado: 10 }
    ];

    let currentQuestionIndex = 0;
    let contadorRespuestasCorrectas = 0;

    const iniciarPregunta = () => {
        if (currentQuestionIndex < operaciones.length) {
            const op = operaciones[currentQuestionIndex];
            contenidoDesafio.innerHTML = `
                <p>Resuelve: <strong>${op.pregunta}</strong></p>
                <input type="number" id="respuesta-usuario" placeholder="Tu respuesta">
                <button id="submit-desafio2">Responder</button>
            `;

            document.getElementById('submit-desafio2').onclick = () => {
                const respuestaUsuario = parseInt(document.getElementById('respuesta-usuario').value);
                if (respuestaUsuario === op.resultadoEsperado) {
                    contadorRespuestasCorrectas++;
                    alert("¡Correcto!");
                } else {
                    alert(`Incorrecto. La respuesta era: ${op.resultadoEsperado}`);
                }
                currentQuestionIndex++;
                iniciarPregunta(); // siguiente pregunta
            };
        } else {
            // Todas las preguntas respondidas
            mostrarResultado(contadorRespuestasCorrectas, operaciones.length, "Operaciones");
        }
    };
    iniciarPregunta(); // Inicia el desafío
}

// Desafío 3: Quiz
async function desafio3() {
    const preguntasQuiz = [
        new PreguntaQuiz(
            "¿Cuál de estos animales es un mamífero?",
            ["Tiburón", "Delfín", "Pingüino"],
            2
        ),
        new PreguntaQuiz(
            "¿Qué animal pone huevos?",
            ["Perro", "Gato", "Gallina"],
            3
        ),
        new PreguntaQuiz(
            "¿Cuál de estos animales puede volar?",
            ["Murciélago", "Elefante", "Canguro"],
            1
        )
    ];

    let currentQuestionIndex = 0;
    let contadorRespuestasCorrectas = 0;

    const renderQuestion = () => {
        if (currentQuestionIndex < preguntasQuiz.length) {
            const q = preguntasQuiz[currentQuestionIndex];
            let optionsHtml = '';
            for (const [index, option] of q.opciones.entries()) {
                optionsHtml += `<label><input type="radio" name="quiz-option" value="${index + 1}"> ${index + 1}. ${option}</label><br>`;
            }

            contenidoDesafio.innerHTML = `
                <p>${q.pregunta}</p>
                ${optionsHtml}
                <button id="submit-desafio3">Responder</button>
            `;

            document.getElementById('submit-desafio3').onclick = () => {
                const selectedOption = document.querySelector('input[name="quiz-option"]:checked');
                if (selectedOption) {
                    const userAnswer = parseInt(selectedOption.value);
                    if (q.isCorrect(userAnswer)) {
                        contadorRespuestasCorrectas++;
                        alert("¡Correcto!");
                    } else {
                        alert(`Incorrecto. La respuesta era: ${q.getCorrectOptionText()}`);
                    }
                    currentQuestionIndex++;
                    renderQuestion();
                } else {
                    alert("Por favor, selecciona una opción.");
                }
            };
        } else {
            mostrarResultado(contadorRespuestasCorrectas, preguntasQuiz.length, "Quiz");
        }
    };
    renderQuestion(); // Iniciar el desafío
}

// Desafío 4: Adivina la palabra
function desafio4() {
    const palabraSecreta = "Gato";
    const intentosMaximos = 3;
    let intentosActuales = 0;
    let adivino = false;

    const pistas = [
        "Es un animal doméstico.",
        "Es un animal que maúlla.",
        "Le gusta cazar ratones."
    ];

    const iniciarDesafio = () => {
        if (intentosActuales < intentosMaximos && !adivino) {
            const pistaActual = pistas[intentosActuales];
            contenidoDesafio.innerHTML = `
                <p>Adivina la palabra secreta. Tienes ${intentosMaximos - intentosActuales} intentos restantes.</p>
                <p>Pista ${intentosActuales + 1}: ${pistaActual}</p>
                <input type="text" id="intento-usuario" placeholder="Tu intento">
                <button id="cargar-desafio4">Adivinar</button>
            `;

            document.getElementById('cargar-desafio4').onclick = () => {
                const intentoUsuario = document.getElementById('intento-usuario').value;
                if (intentoUsuario.toLowerCase() === palabraSecreta.toLowerCase()) {
                    alert("¡Correcto! Adivinaste la palabra.");
                    adivino = true;
                    mostrarResultado(1, 1, "Adivina la Palabra"); // 1 acierto de 1 posible
                } else {
                    alert("Incorrecto.");
                    intentosActuales++;
                    iniciarDesafio(); // Intenta de nuevo
                }
            };
        } else if (!adivino) {
            alert(`No lograste adivinar. La palabra era: ${palabraSecreta}`);
            mostrarResultado(0, 1, "Adivina la Palabra"); // 0 aciertos de 1 posible
        }
    };
    iniciarDesafio(); // Inicia el desafío
}

// Botones de menú
menuBotones.forEach(button => {
    button.addEventListener('click', (event) => {
        const idDesafio = event.target.dataset.challenge;
        switch (idDesafio) {
            case '1':
                ejecutarDesafio("Desafío de Memoria", desafio1);
                break;
            case '2':
                ejecutarDesafio("Desafío de Operaciones", desafio2);
                break;
            case '3':
                ejecutarDesafio("Desafío de Quiz", desafio3);
                break;
            case '4':
                ejecutarDesafio("Desafío Adivina la Palabra", desafio4);
                break;
            default:
                alert("Opción incorrecta");
        }
    });
});

// Botón para volver al menú desde el desafío en curso, si el usuario no lo termina
botonVolverMenu.addEventListener('click', () => {
    seccionDesafio.style.display = 'none';
    seccionMenu.style.display = 'block';
    mostrarScores(); 
});

// Botón para borrar puntaje de localStorage
botonLimpiarScore.addEventListener('click', () => {
    if (confirm("¿Estás seguro de que quieres borrar todos los puntajes guardados?")) {
        localStorage.removeItem('edukidsScores');
        alert("Puntajes borrados exitosamente.");
        mostrarScores();
    }
});

// Cargar puntajes al inicio
document.addEventListener('DOMContentLoaded', mostrarScores);
