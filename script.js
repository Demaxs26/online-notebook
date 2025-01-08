/** @type {HTMLAnchorElement}*/

const drawButton = document.getElementById("drawButton");
const canvas = document.getElementById("canvas");
const colorPanel = document.getElementById("colorpanel");
const widthselector = document.getElementById("lineWidth");
const butonTelecharger = document.getElementById("telechargerImage");
const butonPickColor = document.getElementById("pickButton");

let liste_point = []
let ctx = canvas.getContext("2d");
ctx.lineWidth = 125;
ctx.lineCap = "round";
ctx.strokeStyle = 'rgb(0,0,0';



const telecharger  = (e) =>{
    let image = ctx.createImageData(100, 100);
    console.log(image);
    let imagecanva = ctx.getImageData(0,0,100,100);
    console.log(imagecanva);
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



const updatecolor = (color) =>{
    ctx.strokeStyle = color;
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


const draw  = (event) =>{
    dot(event);
            addEventListener("mousemove", movemouse);
            canvas.addEventListener("mouseup",(event) => {
                removeEventListener("mousemove",movemouse);
                liste_point = [];
            });
};
drawButton.addEventListener("click" , function(){
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