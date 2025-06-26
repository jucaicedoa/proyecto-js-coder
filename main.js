//Ingresar respuesta usuario desafio1
function pedirRespuestas(secuencia, mensaje) {
  alert(mensaje);
  let respuestas = [];

  for (let i = 0; i < secuencia.length; i++) {
    let respuesta = prompt("Escribe el elemento número " + (i + 1));
    respuestas.push(respuesta);
  }

  return respuestas;
}
//verificar respuesta usuario desafio1
function verificarRespuestas(secuencia, respuestas) {
  let acertoTodo = true;

  for (let i = 0; i < secuencia.length; i++) {
    if (respuestas[i] !== secuencia[i]) {
      acertoTodo = false;
    }
  }

  if (acertoTodo) {
    alert("¡Muy bien! Memorizaste la secuencia correctamente.");
  } else {
    alert("Lo siento, esa no era la secuencia correcta.");
  }

  console.log("Original:", secuencia);
  console.log("Usuario:", respuestas);
}

//Desafío 1
function desafio1(){
  let secuencia = ['A', 'F', 'G', 'D'];
  let mensaje = "Memoriza esta secuencia:\n" + secuencia.join('');
  let respuestas = pedirRespuestas(secuencia, mensaje);
  verificarRespuestas(secuencia, respuestas);
}

//Preguntas desafio2
function hacerPregunta(pregunta, resultadoEsperado) {
  let respuesta = parseInt(prompt("Resuelve: " + pregunta));
  if (respuesta === resultadoEsperado) {
    alert("¡Correcto!");
    return true;
  } else {
    alert("Incorrecto. La respuesta era: " + resultadoEsperado);
    return false;
  }
}
//mostrar resultado desafios
function mostrarResultado(aciertos, total) {
  if (aciertos === total) {
    alert("¡Excelente! Respondiste todo correctamente.");
  } else {
    alert("Acertaste " + aciertos + " de " + total + ". ¡Sigue practicando!");
  }

  console.log("Total correctas:", aciertos);
}

//Desafío 2
function desafio2() {
  const operaciones = [
    ["3 + 4", 7],
    ["10 - 2", 8],
    ["5 * 2", 10]
  ];

  let respuestasCorrectas = 0;

  for (let i = 0; i < operaciones.length; i++) {
    let pregunta = operaciones[i][0];
    let resultadoEsperado = operaciones[i][1];

    if (hacerPregunta(pregunta, resultadoEsperado)) {
      respuestasCorrectas++;
    }
  }

  mostrarResultado(respuestasCorrectas, operaciones.length);
}

//Preguntas Quiz desafio3
function hacerPreguntaQuiz(pregunta, opciones, respuestaCorrecta) {
  let mensaje = pregunta + "\n";
  for (let i = 0; i < opciones.length; i++) {
    mensaje = mensaje + (i + 1) + ". " + opciones[i] + "\n";
  }

  let respuesta = parseInt(prompt(mensaje));

  if (respuesta === respuestaCorrecta) {
    alert("¡Correcto!");
    return true;
  } else {
    alert("Incorrecto. La respuesta era: " + opciones[respuestaCorrecta - 1]);
    return false;
  }
}
//Desafío 3
function desafio3() {
  let preguntas = [
    "¿Cuál de estos animales es un mamífero?",
    "¿Qué animal pone huevos?",
    "¿Cuál de estos animales puede volar?"
  ];

  let opciones = [
    ["Tiburón", "Delfín", "Pingüino"],
    ["Perro", "Gato", "Gallina"],
    ["Murciélago", "Elefante", "Canguro"]
  ];

  let respuestasCorrectas = [2, 3, 1];

  let aciertos = 0;

  for (let i = 0; i < preguntas.length; i++) {
    if (hacerPreguntaQuiz(preguntas[i], opciones[i], respuestasCorrectas[i])) {
      aciertos++;
    }
  }

  mostrarResultado(aciertos, preguntas.length);
}

//Desafío 4
function desafio4(){
alert("Desafío 4")
    
}

//Menu principal
let menu;
do{
  menu = parseInt(prompt("\nBienvenido a Edukids \n 1-Memoria \n 2-Operaciones \n 3-Quiz  \n 4- Adivina la palabra\n 5-Salir\n"));

    switch(menu){
        case 1:
            desafio1();
            break;
        case 2:
            desafio2();
            break;
        case 3:
            desafio3();
            break;
        case 4:
            desafio4();
            break;
        
        case 5: 
            alert("Hasta luego");
            break;

        default:
            alert("Opción incorrecta");
    }
}while(menu!==5)
