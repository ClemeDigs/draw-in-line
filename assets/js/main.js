//Méthode pour vérifier si l'utilisateur trace dans les lettre : Le canvas a une opacité de 0, donc si l'utilisateur se trouve sur un pixel opaque, il a perdu


//Selectionner le canvas
var canvas = document.querySelector('canvas');
//Sélectionner le bouton clear
var btnClear = document.querySelector('.btn-clear');
//Sélectionner la modale et les messages
var modale = document.querySelector('.modale');
var rules = document.querySelector('.rules');
var lost = document.querySelector('.lost');
var win = document.querySelector('.win');
var btnClose = document.querySelectorAll('.btn-close');

//Définir le contexte
var context = canvas.getContext('2d');
//Définir la variable mousedown (quand le clic est pressé) à faux
var mousedown = false;
//Définir les points de vases de X et Y à rien
var oldXAxis = null;
var oldYAXis = null;
//Définir la variable pixel, égal à rien
var pixels = null;
//Définir la variable letterPixel, qui contient le nombre de pixel dans la lettre
var letterPixels = null;

function showRules() {
    modale.classList.remove('hidden');
    rules.classList.remove('hidden');
}

//Fermeture de la modale
btnClose.forEach(btn => {
    btn.addEventListener('click', () => {
        modale.classList.add('hidden');
        win.classList.add('hidden');
        lost.classList.add('hidden');
        rules.classList.add('hidden');
    })
})

//Fonction qui définit la largeur de la ligne, l'arrondi et la couleur, la police, et appelle la fonction drawLetter pour dessiner une lettre, puis met à jour la valeur de pixel et la valeur de letterPixels 
function setupCanvas() {
    context.lineWidth = 20;
    context.lineCap = 'round';
    context.strokeStyle = 'black';
    context.font = 'bold 300px Quicksand'
    context.fillStyle = 'red';
    context.BaseLine = 'middle';
    drawLetter('R');
    pixels = context.getImageData (0, 0, canvas.width, canvas.height);
    letterPixels = getPixelAmount(255, 0, 0);
}

//Fonction qui prend en paramètre une lettre. D'abord centre la lettre en prenant en compte la largeur et la hauteur de la lettre, puis remplit la lettre avec la méthode fillText qui prend en paramètre la lettre, le centre X et le centre Y
function drawLetter(letter) {
    var centerXAxis = (canvas.width - context.measureText(letter).width) / 2;
    var centerYAxis = (canvas.height + context.measureText(letter).width) / 2;
    context.fillText(letter, centerXAxis, centerYAxis)
}

function showError(){
    mousedown = false;
    modale.classList.remove('hidden');
    lost.classList.remove('hidden');
    clearCanvas();
    setupCanvas();
}

function pixelCompare() {
    if (letterPixels / getPixelAmount(0, 0, 0) < 0.148) {
        modale.classList.remove('hidden');
        win.classList.remove('hidden');
    }
}


//Fonction qui change la valeur de l'état du clic (Quand le clic est activé, il le reconnait par l'évènement)
function onMouseDown(ev) {
    mousedown = true;
    ev.preventDefault();
}

//Fonction qui, à l'inverse, change l'état du clic quand le clic n'est pas activé puis execute la fonction pixelCompare quand l'utilisateur a fini de cliquer
function onMouseUp(ev) {
    mousedown = false;
    pixelCompare();
    ev.preventDefault();
}

//Fonction qui s'applique par l'évènement quand la souris bouge : définit une variable qui entre la position sur les axes X et Y de l'utilisateur puis si le clic est activé, appelle la fonction paint
function onMouseMove(ev) {
    var xAxis = ev.clientX;
    var yAxis = ev.clientY;
    if (mousedown) {
        paint(xAxis, yAxis);
    }
}

//La fonction paint prend en paramètre la position sur les axes. Commence le tracé, si le tracé est pas commencé, partir des positions "old" (à null de base, sinon définies plus tard dans la fonction), tracer le trait, ajouter la bordure, terminer le tracé et redéfinir les variables des positions sur les axes
function paint(xAxis, yAxis) {
    var color = getPixelColor(xAxis,yAxis);
    //Si a (alpha, opacité) = 0 alors cela signifie que l'utilisateur est en dehors de la lettre
    if (color.a === 0) {
        showError();
    } else {
    context.beginPath();
    if (oldXAxis > 0 && oldYAxis > 0) {
        context.moveTo(oldXAxis, oldYAxis);
    }
}
    context.lineTo(xAxis, yAxis);
    context.stroke();
    context.closePath();
    oldXAxis = xAxis;
    oldYAxis = yAxis;
}

//Fonction qui prend en compte la valeur des pixels (Un peu compliquée, prise sur google)
function getPixelColor(xAxis, yAxis) {
    var index = ((yAxis * (pixels.width * 4)) + (xAxis * 4));
    return {
        r: pixels.data[index],
        g: pixels.data[index + 1],
        b: pixels.data[index + 2],
        a: pixels.data[index + 3]
    };
}

//Fonction qui calcule le nombre de pixels qui seront colorés par l'utilisateur (Un peu compliquée, prise sur google)
function getPixelAmount(r, g, b) {
    var pixels = context.getImageData(0, 0, canvas.width, canvas.height);
    var all = pixels.data.length;
    var amount = 0;
    for (i = 0; i < all; i += 4) {
        if (pixels.data[i] === r &&
            pixels.data[i + 1] === g &&
            pixels.data[i + 2] === b) {
            amount++;
        }
    }
    return amount;

}

//Fonction pour effacer les valeurs du canvas et réinitialiser les positions X et Y
function clearCanvas() {
    oldXAxis = null;
    oldYAxis = null;
    context.clearRect(0, 0, canvas.width, canvas.height);
}

//Montrer les r`gles du jeu au chargement de la page
showRules();

//Appel de la fonction de mise en place du Canvas
setupCanvas();

//Ecoute des évènements souris avec clic enfoncé, souris sans clic enfoncé, souris qui bouge et appelle les fonctions correspondantes
canvas.addEventListener('mousedown', onMouseDown, false);
canvas.addEventListener('mouseup', onMouseUp, false);
canvas.addEventListener('mousemove', onMouseMove, false);

//Ecoute l'évènement au clic du bouton Clear
btnClear.addEventListener('click', () => {
    clearCanvas();
    setupCanvas();
});
