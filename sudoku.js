const facil = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
  ];
const intermig = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
  ];
const dificil = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
  ];

//Creem les variables
var timer;
var timerRestant;
var vides;
var numSeleccionat;
var quadreSeleccionat;
var selectDesactivat;

window.onload = function() {
    //Executar la funcio començarJoc quan es premi el buto
    id("començar").addEventListener("click", començarJoc);
    //Afegir event listener a cada numero en el contenidor de numeros
    for (let i = 0; i < id("numero-container").children.length; i++){
        id("numero-container").children[i].addEventListener("click", function() {
            //Si select no esta desactivat
            if (!selectDesactivat) {
                //Si el numero esta seleccionat
                if (this.classList.contains("selected")) {
                    //Llavors borrem la selecció
                    this.classList.remove("selected");
                    numSeleccionat = null;
                } else {
                    //Deseleccionar tots els altres numeros
                    for (let i = 0; i<9; i++) {
                        id("numero-container").children[i].classList.remove("selected");
                    }
                    //Al seleccionar s'actualitza la variable numSeleccionat
                    this.classList.add("selected");
                    numSeleccionat = this;
                    actualitzarMoviment();
                }
            }
        });
    }

}

function començarJoc() {
    //escollir la dificultat
    let taula;
    if (id("dif1").checked) taula = facil[0];
    else if (id("dif2").checked) taula = intermig[0];
    else taula = dificil[0];
    
    //Posar les vides a 3
    vides = 3;
    selectDesactivat = false;
    id("vides").textContent = "Vides Restants: "+vides;

    //Generar la taula segons la dificultat
    generarTaula(taula);
    //Començar comptador de temps
    començarComptador();
    //Mostrar el contanidor de numeros
    id("numero-container").classList.remove("hidden");
}

function començarComptador() {
    if (id("temps1").checked) timerRestant = 180;
    else if (id("temps2").checked) timerRestant = 300;
    else timerRestant = 600;

    id("comptador").textContent = timeConversion(timerRestant)
    timer = setInterval(function() {
        timerRestant --;
        if (timerRestant === 0) endGame();
        id("comptador").textContent = timeConversion(timerRestant);
    }, 1000)
}

//Conversio segons a una string de format MM:SS
function timeConversion(time) {
    let min = Math.floor(time / 60);
    if (min < 10) min = "0" + min;
    let seg = time % 60;
    if (seg < 10) seg = "0" + seg;
    return min + ":" + seg;
}


get_row = function(quadre) {
    return Math.floor(quadre/9);
}
get_col = function(quadre) {
    return quadre % 9;
}
get_square = function(quadre) {
    return Math.floor(get_row(quadre)/3)*3 + Math.floor(get_col(quadre)/3);
}

//add select to the row and column of selected square
function selectRowCol() {
    let row = get_row(quadreSeleccionat);
    let col = get_col(quadreSeleccionat);
    //add selected to the row
    for (let i = 0; i < 9; i++) {
        q(row*9+i).classList.add("selected");
    }
    //add selected to the column
    for (let i = 0; i < 9; i++) {
        q(col+i*9).classList.add("selected");
    }
}


function generarTaula(taula) {
    //Netejar les taules previes
    netejarTaules();
    //Let per incrementar les ids dels quadres
    let idCount = 0;
    //Creacio 81 quadres
    for (let i = 0; i < 81; i++) {
        let quadre = document.createElement("div");
        if (taula.charAt(i) != "-"){
            quadre.textContent = taula.charAt(i)
            document.createElement("input");
        } else {
            //Afegir event listener al quadre per saber si esta pulsat
            quadre.addEventListener("click", function() {
                //Si el seleccionament no esta desactivat
                if (!selectDesactivat) {
                    //Si el quadre ja esta seleccionat
                    if (quadre.classList.contains("selected")) {
                        //Llavors borrem la seleccio
                        quadre.classList.remove("selected");
                        quadreSeleccionat = null;
                    } else {
                        //Deseleccionar tots els altres quadres
                        for (let i = 0; i < 81; i++) {
                            qsa(".quadre")[i].classList.remove("selected");
                        }
                        //Afegir selecció i actualitzar la variable
                        quadre.classList.add("selected");
                        quadreSeleccionat = quadre;
                        actualitzarMoviment();
                    }
                    
                }
            })
        }
        //asignar id al quadre
        quadre.id = idCount;
        idCount ++;
        quadre.classList.add("quadre");
        if ((quadre.id > 17 && quadre.id < 27) || (quadre.id > 44 && quadre.id < 54)) {
            quadre.classList.add("bottomBorder");
        }
        if ((quadre.id + 1) % 9 == 3 || (quadre.id + 1) % 9 == 6) {
            quadre.classList.add("rightBorder");
        }

        //Afegir els quadres a la taula
        id("taula").appendChild(quadre);
    }
}

function actualitzarMoviment() {
    //Si un quadre i un numero estan seleccionats
    if (quadreSeleccionat && numSeleccionat) {
        //Afegir el numero al quadre
        quadreSeleccionat.textContent = numSeleccionat.textContent;
        //Si el numero es correcte
        if (comprovar(quadreSeleccionat)) {

        //Deseleccionar el quadre i el numero
        quadreSeleccionat.classList.remove("selected");
        numSeleccionat.classList.remove("selected");
        //Buidar les variables
        quadreSeleccionat = null;
        numSeleccionat = null;
        //Comprovar si la taula s'ha completat
        if (comprovarCompleta()) {
            endGame();
        }
        //Si el numero es incorrecte
        }else {
            //Desactivar el seleccionament per 1 segon
            selectDesactivat = true;
            //Posem el quadre vermell
            quadreSeleccionat.classList.add("incorrect");
            setTimeout(function() {
                //Substraure una vida
                vides --;
                //Si no queden vides
                if (vides === 0) {
                    endGame();
                } else {
                    //Si queden vides
                    //Actualitzar el comptador de vides i el seu text
                    id("vides").textContent = "Vides Restants: "+vides;
                    //Reactivar el seleccionament del numeros i quadres
                    selectDesactivat = false;
            }
            //Reposar el quadre a blanc i eliminar el seleccionament
            quadreSeleccionat.classList.remove("incorrect");
            quadreSeleccionat.classList.remove("selected");
            numSeleccionat.classList.remove("selected");
            //Netejar els quadres i variables seleccionades
            quadreSeleccionat.textContent = "";
            quadreSeleccionat = null;
            numSeleccionat = null;
            },1000);
        }
    }
}

function comprovarCompleta() {
    let checkQuadres = qsa(".quadre");
    for (let i = 0; i < checkQuadres.length; i++) {
        if (checkQuadres[i].textContent === "") return false;
    }
    return true;
}

function endGame() {
    //Desactivar el seleccionament
    selectDesactivat = true;
    //Netejar el comptador
    clearInterval(timer);
    //Mostrar el missatge de fi de joc
    if (vides === 0 || timerRestant === 0) {
        id("vides").textContent = "Has perdut!";
    } else {
        id("vides").textContent = "Has guanyat!";
    }
    //Mostrar el missatge de fi de joc
    id("final-container").classList.remove("hidden");
}

function comprovar(quadre) {
    //Posar la solucio depenent de la dificultat
    let soluccio;
    if (id("dif1").checked) soluccio = facil[1];
    else if (id("dif2").checked) soluccio = intermig[1];
    else soluccio = dificil[1];
    //Si el numero es correcte
    if (quadre.textContent == soluccio.charAt(quadre.id)) {
        quadre.classList.add("correct");
        return true;
    } else {
        quadre.classList.add("incorrect");
        return false;
    }
}

function netejarTaules() {
    //Accedir a tots el quadres
    let quadres = qsa(".quadre");
    //Borrar cada quadre
    for (let i = 0; i < quadres.length; i++) {
        quadres[i].remove();
    }
    //Si hi ha un comptador el neteja
    if (timer) netejarTimer(timer);
    //Deseleccionar qualsevol numero
    for (let i = 0; i < id("numero-container").children.length; i++) {
        id("numero-container").children[i].classList.remove("selected");
    }
    //Netejar les variables seleccionades
    quadreSeleccionat = null;
    numSeleccionat = null;
}

//Funcions d'ajuda
function id(id) {
    return document.getElementById(id);
}

function qs(selector) {
    return document.querySelector(selector);
}

function qsa(selector) {
    return document.querySelectorAll(selector);
}