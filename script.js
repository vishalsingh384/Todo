var uid = new ShortUniqueId();
const addBtn=document.querySelector(".add-btn");
const modalCont=document.querySelector(".modal-cont");
modalCont.style.display="none";
const allPriorityColors=document.querySelectorAll(".priority-color");
let colors=['lightpink','lightgreen','lightblue','black'];
let modalPriorityColor=colors[colors.length - 1];//black
// console.log(modalPriorityColor);
let textAreaCont=document.querySelector(".textarea-cont");
const mainCont=document.querySelector(".main-cont");
let ticketsArr=[];
let toolBoxColors = document.querySelectorAll(".color");//navbar colors
let removeBtn = document.querySelector(".remove-btn");



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
    <div class="ticket-id">#${id}</div>
    <div class="task-area">${data}</div>
    <div class="lock-on">
        <i class="fa-solid fa-lock"></i>
    </div> 
    `;

    mainCont.appendChild(ticketCont);
    handleRemoval(ticketCont,id);
    handleColor(ticketCont,id);
    handleLock(ticketCont,id);

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

//get alltickets from local Storage(in case of refresh); to make the data persist
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
        let filteredTickets=ticketsArr.filter(function(ticketObj){//filter-> Returns the elements of an array that meet the condition specified in a callback function.
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

//lock and unlock
function handleLock(ticket,id){
    let lockIcon=ticket.querySelector(".fa-solid");
    lockIcon.addEventListener("click",function(){
        let ticketTextArea=ticket.querySelector(".task-area");
        // console.log(ticketTextArea.innerText);
        if(lockIcon.classList[1]=="fa-lock-open"){
            let indexOfTicket=getTicketIdx(id);
            ticketsArr[indexOfTicket].data=ticketTextArea.innerText;
            localStorage.setItem("tickets",JSON.stringify(ticketsArr));
            ticketTextArea.setAttribute("contenteditable","false");
            lockIcon.classList.remove("fa-lock-open");
            lockIcon.classList.add("fa-lock");
        }else{
            ticketTextArea.setAttribute("contenteditable","true");
            lockIcon.classList.remove("fa-lock");
            lockIcon.classList.add("fa-lock-open");
        }
        // console.log(ticketTextArea);
    });
}

//on clicking removeBtn, make color red and make color white in clicking again
let removeBtnActive=false;
removeBtn.addEventListener("click",function(){
    if(removeBtnActive){
        removeBtn.style.color="white";
    }else{
        removeBtn.style.color="red";
    }

    removeBtnActive=!removeBtnActive;
});

//remove tickets
function handleRemoval(ticket,id){
    ticket.addEventListener("click",function(e){
        let ticketTextArea=ticket.querySelector(".fa-solid");
        //agar lock hai to return kar jaayega(No deletion possible)
        if(ticketTextArea.classList[1]=="fa-lock"){
            return;
        }
        if(removeBtnActive==false){
            return;
        }
        //agar icon pe click kar rahe to delete nahi karna
        if(e.target.classList[0]=="fa-solid"){
            return;
        }
        //local storage remove
        //->get idx of the ticket to be deleted
        let idx=getTicketIdx(id);
        //splice-> Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements
        ticketsArr.splice(idx,1);

        //removed from browser storage and set updated arr
        localStorage.setItem("tickets",JSON.stringify(ticketsArr));

        //remove from frontEnd
        ticket.remove();
    });
}

//get ticket Index
function getTicketIdx(ticketId){
    //Returns the INDEX of the first element in the array where predicate is true, and -1 otherwise.
    let ticketIdx=ticketsArr.findIndex(function(ticketObj){
        return ticketObj.ticketId==ticketId;
    });
    return ticketIdx;
}

//change strip colors
function handleColor(ticket,id){
    let ticketColorStrip=ticket.querySelector(".ticket-color");//ticket color class of the ticket
    ticketColorStrip.addEventListener("click",function(){
        let currTicketColor=ticketColorStrip.classList[1];//current ticket color
        // ['lightpink','lightgreen','lightblue','black']
        let currTicketColorIdx=colors.indexOf(currTicketColor);//indexOf-> Returns the index of the first occurrence of a value in an array, or -1 if it is not present.
        let newTicketColorIdx=currTicketColorIdx + 1;
        newTicketColorIdx=newTicketColorIdx % colors.length;
        // console.log(newTicketColorIdx);
        let newTicketColor=colors[newTicketColorIdx];

        //Using classList is a convenient alternative to accessing an element's list of classes as a space-delimited string via element.className.
        ticketColorStrip.classList.remove(currTicketColor);
        ticketColorStrip.classList.add(newTicketColor);

        //local storage update
        let curIndx=getTicketIdx(id);
        ticketsArr[curIndx].ticketColor=newTicketColor;
        localStorage.setItem("tickets",JSON.stringify(ticketsArr));

    });
}




