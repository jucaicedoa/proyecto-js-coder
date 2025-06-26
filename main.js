//Ingresar respuesta usuario
function pedirRespuestas(secuencia, mensaje) {
  alert(mensaje);
  let respuestas = [];

  for (let i = 0; i < secuencia.length; i++) {
    let respuesta = prompt("Escribe el elemento número " + (i + 1));
    respuestas.push(respuesta);
  }

  return respuestas;
}
//verificar respuesta usuario
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





//Desafío 2
function desafio2(){
alert("Desafío 2")
    
}


//Desafío 3
function desafio3(){
alert("Desafío 3")
    
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
