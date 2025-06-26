function desafio1(){
alert("Desafío 1")
}

function desafio2(){
alert("Desafío 2")
    
}

function desafio3(){
alert("Desafío 3")
    
}

function desafio4(){
alert("Desafío 4")
    
}

let menu = parseInt(prompt("\nBienvenido a Edukids \n 1-Memoria \n 2-Operaciones \n 3-Quiz  \n 4- Adivina la palabra\n 5-Salir\n"))
while(menu!==5){
    switch(menu){
        case 1:
            desafio1()
            break
        case 2:
            desafio2()
            break
        case 3:
            desafio3()
            break
        case 4:
            desafio4()
            break
        default:
            alert("Opción incorrecta")
    }
     menu = parseInt(prompt("\nBienvenido a Edukids \n 1-Memoria \n 2-Operaciones \n 3-Quiz  \n 4- Adivina la palabra\n 5-Salir\n"))

}