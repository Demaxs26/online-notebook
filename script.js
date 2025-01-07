/** @type {HTMLAnchorElement}*/

const drawButton = document.getElementById("drawButton");
const canvas = document.getElementById("canvas");
const colorPanel = document.getElementById("colorpanel");
const widthselector = document.getElementById("lineWidth");
const butonTelecharger = document.getElementById("telechargerImage");
let liste_point = []
let ctx = canvas.getContext("2d");
ctx.lineWidth = 125;
ctx.lineCap = "round";
ctx.strokeStyle = '#ff0000';



const telecharger  = (e) =>{
    canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    window.location.href = canvas;
}

/**
 * @param {} e 
 */



function fillgap(){
    
    ctx.beginPath();
    ctx.moveTo(liste_point[0][0],liste_point[0][1])
    ctx.lineTo(liste_point[1][0],liste_point[1][1]);
    ctx.stroke();
    liste_point.shift()

}

function dot(e){
    ctx.beginPath();
    ctx.moveTo(e.clientX-10, e.clientY);
    ctx.lineTo(e.clientX-10, e.clientY);
    ctx.stroke();
    liste_point.shift()

}



const updatecolor = (e) =>{
    console.log(e.target.value);
    ctx.strokeStyle = e.target.value;
}

const updatewidth = () =>{
    ctx.lineWidth = widthselector.value;
}


const movemouse  = (e) => {
    liste_point.push([e.clientX-10, e.clientY])
    if (liste_point.length > 2){
        fillgap()
    }
    
}

drawButton.addEventListener("click" , function(){
    
    canvas.addEventListener("pointerdown",
        (event) => {
            dot(event)
            addEventListener("mousemove", movemouse);
            canvas.addEventListener("mouseup",(event) => {
                removeEventListener("mousemove",movemouse)
                liste_point = []
            })
        })
    })
    

colorPanel.addEventListener("change", updatecolor);
widthselector.addEventListener("change", updatewidth);
butonTelecharger.addEventListener("click", telecharger)