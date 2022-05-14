const addBtn=document.querySelector(".add-btn");
const modalCont=document.querySelector(".modal-cont");
const allPriorityColors=document.querySelectorAll(".priority-color");
let colors=['lightpink','lightgreen','lightblue','black'];
let modalPriorityColor=colors[colors.length - 1];//black
// console.log(modalPriorityColor);
let textAreaCont=document.querySelector(".textarea-cont");

const mainCont=document.querySelector(".main-cont");

let isModalPresent=false;
addBtn.addEventListener('click',function(){
    if(!isModalPresent){
        modalCont.style.display="flex";//modal add ho gaya screen pe
        // isModalPresent = true;
    }else{
        modalCont.style.display="none";
        // isModalPresent = false;
    }
    isModalPresent=!isModalPresent;//toggling effect
});

allPriorityColors.forEach(function(colorElement) {
    colorElement.addEventListener("click",function(){
        allPriorityColors.forEach(function(priorityColorElem){
            priorityColorElem.classList.remove("active");
        });
        colorElement.classList.add("active");
        modalPriorityColor=colorElement.classList[0];
        // break;
    });
});

modalCont.addEventListener("keydown",function(e){
    let key = e.key;
    if(key == "Shift"){
        console.log(modalPriorityColor);
        console.log(textAreaCont.value);//value ke bina html return karega
        createTicket(modalPriorityColor,textAreaCont.value);
        modalCont.style.display="none";
        isModalPresent=false;
        textAreaCont.value="";//waapas se jab open kare textArea ko to khaali rahe
        allPriorityColors.forEach(function(colorElem){
            colorElem.classList.remove("active");
        });
    }
});

function createTicket(modalPriorityColor,textAreaValue){
    let ticketCont=document.createElement("div");
    ticketCont.setAttribute("class","ticket-cont");
    ticketCont.innerHTML=`        
    <div class="ticket-color ${modalPriorityColor}"></div>
    <div class="ticket-id"></div>
    <div class="task-area">${textAreaValue}</div>
    `;

    mainCont.appendChild(ticketCont);
}


