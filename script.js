var uid = new ShortUniqueId();
const addBtn=document.querySelector(".add-btn");
const modalCont=document.querySelector(".modal-cont");
const allPriorityColors=document.querySelectorAll(".priority-color");
let colors=['lightpink','lightgreen','lightblue','black'];
let modalPriorityColor=colors[colors.length - 1];//black
// console.log(modalPriorityColor);
let textAreaCont=document.querySelector(".textarea-cont");
const mainCont=document.querySelector(".main-cont");
let ticketsArr=[];
let toolBoxColors = document.querySelectorAll(".color");//navbar colors



//to open a closed modal container
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

//to remove and add active class from each priority color of modal container
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

//to generate and display a ticket
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

//function to create a new ticket
function createTicket(ticketColor,data,ticketId){
    let id=ticketId || uid();
    let ticketCont=document.createElement("div");
    ticketCont.setAttribute("class","ticket-cont");
    ticketCont.innerHTML=`        
    <div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id"></div>
    <div class="task-area">${data}</div>
    `;

    mainCont.appendChild(ticketCont);

    //if ticket is being created for the first time , then ticketId would be undefined
    if(!ticketId){
        console.log("inside");
        ticketsArr.push(
            {
                ticketColor,
                data,
                ticketId:id
            }
        );
        localStorage.setItem("tickets",JSON.stringify(ticketsArr));
    }
};

//get alltickets from local Storage
if(localStorage.getItem("tickets")){
    ticketsArr=JSON.parse(localStorage.getItem("tickets"));
    ticketsArr.forEach(function(ticketObj){
        createTicket(ticketObj.ticketColor,ticketObj.data,ticketObj.ticketId);
    })
}


//filter tickets on the basis of ticketColor
for(let i=0;i<toolBoxColors.length;i++){
    toolBoxColors[i].addEventListener("click",function(e){
        let currToolBoxColor=toolBoxColors[i].classList[0];
        let filteredTickets=ticketsArr.filter(function(ticketObj){
            return ticketObj.ticketColor==currToolBoxColor;
        });

        //remove all the tickets
        let allTickets=document.querySelectorAll(".ticket-cont");
        for(let i=0;i<allTickets.length;i++){
            allTickets[i].remove();
        }

        filteredTickets.forEach(function(ticketObj){
            createTicket(ticketObj.ticketColor,ticketObj.data,ticketObj.ticketId);
        });
    });

    //to display all the tickets of all colors on double clicking
    toolBoxColors[i].addEventListener("dblclick",function(){
        //remove all the color specific tickets
        let allTickets=document.querySelectorAll(".ticket-cont");
        for(let i=0;i<allTickets.length;i++){
            allTickets[i].remove();
        }

        //display all Tickets
        ticketsArr.forEach(function(ticketObj){
            createTicket(ticketObj.ticketColor,ticketObj.data,ticketObj.ticketId);
        });
    });
}








