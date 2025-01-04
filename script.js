/** @type {HTMLAnchorElement}*/

const drawButton = document.getElementById("drawButton");
const canvas = document.getElementById("canvas");


let liste_point = []
let ctx = canvas.getContext("2d");
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
const movemouse  = (e) => {
    liste_point.push([e.clientX-10, e.clientY])
    ctx.fillStyle = "rgb(0,0,0)"
    if (liste_point.length > 2){
        fillgap()
    }
}

drawButton.addEventListener("click" , function(){
    
    canvas.addEventListener("pointerdown",
        (event) => {
            addEventListener("mousemove", movemouse);
            canvas.addEventListener("mouseup",(event) => {
                removeEventListener("mousemove",movemouse)
                liste_point = []
            })
        })
    })
    