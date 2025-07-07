/** @type {HTMLAnchorElement}*/

const drawButton = document.getElementById("drawButton");
const canvas = document.getElementById("canvas");
const colorPanel = document.getElementById("colorpanel");
const butonTelecharger = document.getElementById("telechargerImage");
const butonPickColor = document.getElementById("pickButton");
const butonSave = document.getElementById("saveButton");
const butonBack = document.getElementById("restoreButton");
const butonEraser = document.getElementById("eraser");
const butonBrush = document.getElementById("brush-button");
const wrapperBrush = document.querySelector(".wrapper-brush");
const lineWeightSlider = document.querySelectorAll(".lineWidth");
const lineWidthdisplay = document.querySelector(".lineWidthdisplay");
const textSave = document.querySelector(".text-save");
const cursor = document.querySelector(".custom-cursor");

const ratioX = canvas.clientWidth / canvas.width;
const ratioY = canvas.clientHeight / canvas.height;

let constSave = NaN
let liste_point = [];
let ctx = canvas.getContext("2d");
ctx.lineWidth = 125;
ctx.lineCap = "round";
ctx.strokeStyle = 'rgb(0,0,0';
let pileSave = [];
let recentChane = true;



sauvegarde = () => {
    let request = indexedDB.open("imageDB", 1);
    request.onsuccess = function (event) {
        const db = event.target.result;
        db.transaction(["images"])
        .objectStore("images")
        .get("image1").onsuccess = function (e) {
            ctx.putImageData(e.target.result.data, 0, 0)

        }
        
    };

    request.onerror = function (event) {
    }
    

};

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
    let request = indexedDB.open("imageDB", 1);
    request.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("images")) {
            db.createObjectStore("images", { keyPath: "id" });
        }
    };
    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("images", "readwrite");
        const store = transaction.objectStore("images");
        const imageBlobBD = { id: "image1", data: image};
        store.put(imageBlobBD);
        textSave.style.display = "block";
        setTimeout(() => {
            textSave.style.display = "none";
          }, 1000);
        
    };

    request.onerror = function () {
        console.error("Erreur d'ouverture de la base de données IndexedDB");
    };
};



/**
 * 
 * @param {pickEvent} event 
 */

const restore = () =>{
    if (pileSave.length != 0){
        if (recentChane){
            ctx.putImageData(pileSave.pop(),0,0)
        }
        ctx.putImageData(pileSave.pop(),0,0)
        recentChane = false
    }
    
}

const pick = (event) =>{
    x = event.clientX;
    y = event.clientY;
    console.log(x,y);
    let pixel = ctx.getImageData(x, y, 1, 1);
    console.log(pixel)
    let data = pixel.data;
    let color = `rgba(${data[0]},${data[1]},${data[2]})` //,${data[3]}
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
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY -rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y); //-10
    ctx.lineTo(x, y);
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

function updatewidth(range){
    const size = range.value;
    ctx.lineWidth = size;
    lineWidthdisplay.textContent = size;
    cursor.style.left = '50%';
    cursor.style.top = '50%';
    cursor.style.display = "block"
    cursor.style.width = size + "px";
    cursor.style.height = size + "px";
    
}

/**
 * 
 * @param {MouseEvent} e 
 */

const movemouse  = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY -rect.top;
    liste_point.push([x, y]) // -10
    if (liste_point.length > 2){
        fillgap()
    }
    
}

const unsavedot = () =>{
    ctx.putImageData(dotSave,0,0);
    dotSave = NaN
}

const erase = () =>{
    updatecolor("white");
    drawButton.click()
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
        pileSave.pop();
        pileSave.push(ctx.getImageData(0,0,1500,800));
    });
    dotSave === NaN ?NaN:pileSave.push(ctx.getImageData(0,0,1500,800));
    recentChane = true
};

const displayBrush = () =>{
    wrapperBrush.style.display = "flex";
    console.log("ok1");

}
const unDisplayBrush = () => {
    const timeOuotDelay = setTimeout(() => {
        wrapperBrush.style.display = "none";
        console.log("ok2");
        cursor.style.display = "none"
      }, 1000);
    wrapperBrush.addEventListener("mouseover",function(){
        clearTimeout(timeOuotDelay);
        console.log("time out delayed")
    },{once:true})

}




// Event listener

drawButton.addEventListener("click" , function(){
    pileSave.push(ctx.getImageData(0,0,1500,800));
    canvas.addEventListener("pointerdown",draw);
});
colorPanel.addEventListener("change", (e) =>{
    updatecolor(e.target.value);
});
// widthselector.forEach((item)=>{
//     item.addEventListener("change", updatewidth(item));
// });
lineWeightSlider[0].addEventListener("input",function(){updatewidth(lineWeightSlider[0])});
lineWeightSlider[1].addEventListener("input",function(){updatewidth(lineWeightSlider[1])});
lineWeightSlider[2].addEventListener("input",function(){updatewidth(lineWeightSlider[2])});
butonTelecharger.addEventListener("click", telecharger);
butonPickColor.addEventListener('click', function(){
    canvas.removeEventListener("pointerdown",draw);
    canvas.style.cursor = "copy";
    canvas.addEventListener("click",pick,{once:true});
    
});
butonSave.addEventListener("click",save);
butonBack.addEventListener("click",restore);
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'z') {
      restore();
    }
  });
butonEraser.addEventListener("click",erase);
butonBrush.addEventListener("click",displayBrush);
butonBrush.addEventListener("mouseout",unDisplayBrush)
wrapperBrush.addEventListener("mouseout",unDisplayBrush);

document.addEventListener("DOMContentLoaded",function(){
    
    cursor.style.width =  ctx.lineWidth+ "px";
    cursor.style.height = ctx.lineWidth+ "px";
    canvas.addEventListener("mousemove",function(e){
        cursor.style.left = e.clientX+1+'px';
        cursor.style.top = e.clientY+1+'px';
    })
})
canvas.addEventListener("mouseout",function(){
    cursor.style.display = "none"
})
canvas.addEventListener("mouseenter",function(){
    cursor.style.display = "block"
})
window.addEventListener("load", sauvegarde, false)






