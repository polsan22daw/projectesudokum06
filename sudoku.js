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
var quadreSeleccionat;

window.onload = function() {
    //Executar la funcio començarJoc quan es premi el buto
    id("començar").addEventListener("click", començarJoc);
}

function començarJoc() {
    //escollir la dificultat
    let taula;
    if (id("dif1").checked) taula = facil[0];
    else if (id("dif2").checked) taula = intermig[0];
    else taula = dificil[0];
    
    //selectDesactivat = false;
    //Generar la taula segons la dificultat
    generarTaula(taula);
    //Mostrar el boto per comprovar
    id("chequeo").classList.remove("hidden");
}


function generarTaula(taula) {
    //Netejar les taules previes
    netejarTaules();
    //Let per incrementar les ids dels quadres
    let idCount = 0;
    //Creacio 81 quadres
    for (let i = 0; i < 81; i++) {
        let quadre = document.createElement("p");
        let texte = document.createElement("input");
        texte.setAttribute("type", "text");
        texte.setAttribute("maxlength", "1");
        quadre.appendChild(texte);
        if (taula.charAt(i) != "-"){
            quadre.textContent = taula.charAt(i)
            quadre.classList.add("quadreInic");
        } else {
            //Afegir select a la columna i fila del quadre seleccionat
            quadre.addEventListener("click", function() {
                //Si el quadra seleccionat es diferent al quadre actual
                if (quadreSeleccionat != quadre) {
                    deseleccionarColumnaFila(quadreSeleccionat);
                }
                if (quadreSeleccionat) quadreSeleccionat.classList.remove("quadreselected");
                quadreSeleccionat = quadre;
                quadre.classList.add("quadreselected");
                selectColumnaFila(quadre);
            });
            id("chequeo").addEventListener("click", function() {
                if (texte.value != "") {
                    if (comprovar(texte)) {
                        quadre.classList.add("correct");
                        quadre.classList.remove("incorrect");
                        //Cuando pase 1 segundo quitar el correct
                        setTimeout(function() {
                            quadre.classList.remove("correct");
                        }, 3000);
                        texte.disabled = true;
                        if (comprovarCompleta()) {
                            alert("Has guanyat");
                        }
                    } else {
                        quadre.classList.add("incorrect");
                    }
                } else {
                    quadre.classList.remove("incorrect");
                }
            });
        }
        //asignar id al quadre
        quadre.setAttribute("id", idCount);
        idCount++;
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

function selectColumnaFila(quadre) {
    //Seleccionar la columna i fila del quadre seleccionat
    let columna = quadre.id % 9;
    let fila = Math.floor(quadre.id / 9);
    for (let i = 0; i < 81; i++) {
        let quadreActual = id(i);
        if (quadreActual.id % 9 == columna || Math.floor(quadreActual.id / 9) == fila) {
            quadreActual.classList.add("selected");
        }
    }
    //Seleccionar quadres
    let filaInicial = Math.floor(fila / 3) * 3;
    let columnaInicial = Math.floor(columna / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            id((filaInicial + i) * 9 + columnaInicial + j).classList.add("selected");
        }
    }
}

function deseleccionarColumnaFila(quadre) {
    //Deseleccionar la columna i fila del quadre seleccionat
    for (let i = 0; i < 81; i++) {
        let quadreActual = id(i);
        quadreActual.classList.remove("selected");
    }
}

function comprovarCompleta() {
    let quadres = qsAll(".quadre");
    for (let i = 0; i < quadres.length; i++) {
        if (quadres[i].textContent == "") return false;
    }
    return true;
}

function comprovar(texte) {
    //Posar la solucio depenent de la dificultat
    let soluccio;
    if (id("dif1").checked) soluccio = facil[1];
    else if (id("dif2").checked) soluccio = intermig[1];
    else soluccio = dificil[1];
    //Si el numero es correcte
    if (texte.value == soluccio.charAt(texte.parentNode.id)) {
        console.log("Correcte");
        return true;
    }
    console.log("Incorrecte");
    return false;
}

function netejarTaules() {
    //Accedir a tots el quadres
    let quadres = qsa(".quadre");
    //Borrar cada quadre
    for (let i = 0; i < quadres.length; i++) {
        quadres[i].remove();
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