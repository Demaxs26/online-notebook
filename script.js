/** @type {HTMLAnchorElement}*/

const drawButton = document.getElementById("drawButton");
const canvas = document.getElementById("canvas");



let ctx = canvas.getContext("2d");
/**
 * @param {} e 
 */
const movemouse  = (e) => {
    console.log(e);
    ctx.fillStyle = "rgb(0,0,0)"
    ctx.fillRect(e.clientX-10, e.clientY,2, 2);
}

drawButton.addEventListener("click" , function(){
    
    canvas.addEventListener("pointerdown",
        (event) => {
            
            console.log(event)
            addEventListener("mousemove", movemouse);
            canvas.addEventListener("mouseup",(event) => {
                removeEventListener("mousemove",movemouse)
            })
        })
    })
    