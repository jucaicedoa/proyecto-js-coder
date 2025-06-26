//Ingresar respuesta usuario desafio1
function pedirRespuestas(secuencia, mensaje) {
  alert(mensaje);
  let respuestas = [];

  for (let i = 0; i < secuencia.length; i++) {
    let respuesta = prompt("Escribe el elemento número " + (i + 1));
    //Agrego respuesta a Array respuestas
    respuestas.push(respuesta);
  }

  return respuestas;
}
//verificar respuesta usuario desafio1
function verificarRespuestas(secuencia, respuestas) {
  let acertoTodo = true;

  for (let i = 0; i < secuencia.length; i++) {
    //Verifico si cada posición i del Array resouestas es igual a cada posición i del Array secuencia
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
  //pedirRespuestas retorna un Array que asigno a la variable respuestas
  let respuestas = pedirRespuestas(secuencia, mensaje);
  //funcion verificarRespuestas
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
  //Array de Arrays con operaciones, la primera posición con un String y la segunda con un entero
  const operaciones = [
    ["3 + 4", 7],
    ["10 - 2", 8],
    ["5 * 2", 10]
  ];

  let respuestasCorrectas = 0;

  for (let i = 0; i < operaciones.length; i++) {
    //Recorro el Array de Arrays primero itero sobre los Arrays con i e ingreso a la posición 0 de cada uno
    let pregunta = operaciones[i][0];
    //Recorro el Array de Arrays itererando sobre los Arrays con i e ingreso a la posición 1 dde cada uno
    let resultadoEsperado = operaciones[i][1];

    if (hacerPregunta(pregunta, resultadoEsperado)) {
      respuestasCorrectas++;
    }
  }
//Función mostrarResultado
  mostrarResultado(respuestasCorrectas, operaciones.length);
}

//Preguntas Quiz desafio3
function hacerPreguntaQuiz(pregunta, opciones, respuestaCorrecta) {
  let mensaje = pregunta + "\n";
  for (let i = 0; i < opciones.length; i++) {
    //Voy recorriendo el Array de preguntas con el Array de opciones de respuesta
    mensaje = mensaje + (i + 1) + ". " + opciones[i] + "\n";
  }

  let respuesta = parseInt(prompt(mensaje));

  if (respuesta === respuestaCorrecta) {
    alert("¡Correcto!");
    return true;
  } else {
    //Ingreso al Array opciones para verificar respuesta
    alert("Incorrecto. La respuesta era: " + opciones[respuestaCorrecta - 1]);
    return false;
  }
}
//Desafío 3
function desafio3() {
  //Arrays
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
//Con el ciclo for recorro de la función hacerPreguntaQuiz cada uno de los parámetros de entrada que son Arrays en sus posiciones i
  for (let i = 0; i < preguntas.length; i++) {
    if (hacerPreguntaQuiz(preguntas[i], opciones[i], respuestasCorrectas[i])) {
      aciertos++;
    }
  }
  //Función mostrarResultado
  mostrarResultado(aciertos, preguntas.length);
}

//Desafío 4
function desafio4(){
  let palabraSecreta = "Gato";
  let intentos = 3;
  let adivino = false;

  alert("Adivina la palabra secreta. Tienes " + intentos + " intentos.");
  //Recorro con un ciclo for basado en la cantidad de intentos
  for (let i = 0; i < intentos; i++) {

    if(i===0){
      alert("Pista 1: Es un animal doméstico.");
    }
    if (i === 1) {
      alert("Pista 2: Es un animal que maúlla.");
    }
    if (i === 2) {
      alert("Pista 3: Le gusta cazar ratones.");
    }

    let intentoUsuario = prompt("Intento " + (i+1) + ": ¿Cuál es la palabra?");
    if (intentoUsuario === palabraSecreta) {
      alert("¡Correcto! Adivinaste la palabra.");
      adivino = true;
      //El break permite que al encontrar la palabra se salga del ciclo sea cual sea el intento
      break;
    } else {
      alert("Incorrecto.");
    }
  }

  if (!adivino) {
    alert("No lograste adivinar. La palabra era: " + palabraSecreta);
  }

  console.log("Palabra secreta:", palabraSecreta);
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
