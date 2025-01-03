/** @type {HTMLAnchorElement}*/

const drawButton = document.getElementById("drawButton");
const canvas = document.getElementById("canvas");


/**
 * @param {} e 
 */


drawButton.addEventListener("click" , function(){
    let ctx = canvas.getContext("2d");
    canvas.addEventListener("pointerdown",
        (event) => {
            
            console.log(event)
            addEventListener("mousemove", (e) => {
                console.log(e);
                ctx.fillStyle = "rgb(0,0,0)"
                ctx.fillRect(e.clientX-10, e.clientY+175,2, 2);
            });
        })
    })