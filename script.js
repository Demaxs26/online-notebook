/** @type {HTMLAnchorElement}*/

const drawButton = document.getElementById("drawButton");
const canvas = document.getElementById("canvas");
const colorPanel = document.getElementById("colorpanel");
const widthselector = document.getElementById("lineWidth");
const butonTelecharger = document.getElementById("telechargerImage");
const butonPickColor = document.getElementById("pickButton");
const butonSave = document.getElementById("saveButton");
const butonBack = document.getElementById("restoreButton");
const butonunBack = document.getElementById("UnrestoreButton");
let constSave = NaN
let liste_point = [];
let ctx = canvas.getContext("2d");
ctx.lineWidth = 125;
ctx.lineCap = "round";
ctx.strokeStyle = 'rgb(0,0,0';
let listeSave = [];
let pointerAdvancement = 0


/**
 * @param {ClickEvent} e 
 */

const telecharger  = (e) =>{
    let image = canvas.toDataURL();
    const lien = document.createElement('a');
    lien.href = image;
    lien.download = 'dessin.png';
    lien.click();
};

const save = () =>{
    const image = ctx.getImageData(0,0,1500,800);
    console.log(image);
    localStorage.setItem("draw", image);
    const draw = localStorage.getItem("draw");
    console.log(draw);
};


/**
 * 
 * @param {pickEvent} event 
 */

const restore = () =>{
    pointerAdvancement > 0 ? pointerAdvancement--:NaN;
    console.log(pointerAdvancement);
    changeState();
}

const unRestore = () =>{
    pointerAdvancement < listeSave.length ? pointerAdvancement++:NaN;
    changeState();
}



const changeState = () =>{
    console.log(listeSave.length, pointerAdvancement)
    ctx.putImageData(listeSave[pointerAdvancement-1], 0, 0);
}

const saveState = () =>{
    listeSave.push(ctx.getImageData(0,0,1500,800));
    console.log(pointerAdvancement);
    pointerAdvancement = pointerAdvancement + 1;
}

const pick = (event) =>{
    x = event.clientX;
    y = event.clientY;
    console.log(x,y);
    let pixel = ctx.getImageData(x, y, 1, 1);
    console.log(pixel)
    let data = pixel.data;
    let color = `rgba(${data[0]},${data[1]},${data[2]},${data[3]})`
    console.log(color)
    updatecolor(color);
    canvas.addEventListener("pointerdown",draw)
    canvas.style.cursor = "crosshair";
    colorPanel.value = color
}


function fillgap(){
    ctx.beginPath();
    ctx.moveTo(liste_point[0][0],liste_point[0][1])
    ctx.lineTo(liste_point[1][0],liste_point[1][1]);
    ctx.stroke();
    liste_point.shift()

}

/**
 * @param {PointerEvent} e 
 */

function dot(e){
    ctx.beginPath();
    ctx.moveTo(e.clientX-10, e.clientY);
    ctx.lineTo(e.clientX-10, e.clientY);
    ctx.stroke();
    liste_point.shift()

}

/**
 * 
 * @param {String} color 
 */

const updatecolor = (color) =>{
    ctx.strokeStyle = color;
}

const updatewidth = () =>{
    ctx.lineWidth = widthselector.value;
}

/**
 * 
 * @param {MouseEvent} e 
 */

const movemouse  = (e) => {
    
    liste_point.push([e.clientX-10, e.clientY])
    if (liste_point.length > 2){
        fillgap()
    }
    
}

const unsavedot = () =>{
    ctx.putImageData(dotSave,0,0);
    dotSave = NaN
}

/**
 * 
 * @param {PointerEvent} event 
 */

const draw  = (event) =>{
    dotSave = ctx.getImageData(0,0,1500,800)
    dot(event);
    addEventListener("mousemove", movemouse,unsavedot);
    canvas.addEventListener("mouseup",(event) => {
        removeEventListener("mousemove",movemouse);
        liste_point = [];
        listeSave.pop();
        pointerAdvancement = pointerAdvancement -1;
        saveState();
        
    });
    dotSave === NaN ?NaN:saveState();
    
};


// Event listener

drawButton.addEventListener("click" , function(){
    saveState();
    canvas.addEventListener("pointerdown",draw);
});
colorPanel.addEventListener("change", (e) =>{
    updatecolor(e.target.value);
});
widthselector.addEventListener("change", updatewidth);
butonTelecharger.addEventListener("click", telecharger);
butonPickColor.addEventListener('click', function(){
    canvas.removeEventListener("pointerdown",draw);
    canvas.style.cursor = "copy";
    canvas.addEventListener("click",pick,{once:true});
    
});
butonSave.addEventListener("click",save);
butonBack.addEventListener("click",restore);
butonunBack.addEventListener("click", unRestore);