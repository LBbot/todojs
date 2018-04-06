function clearList() {
    // removes each ".js-box" FROM THE DOM
    const listOfBoxes = document.querySelectorAll(".js-box"); 
    listOfBoxes.forEach(function(element) {
        element.remove();
    });
}


function populateList() {
    // Checks IF it should display empty list message, 2nd condition stops a single delete not triggering it
    if (localStorage.Todolist !== undefined && localStorage.Todolist.length !== 2) {
        parsedArray = JSON.parse(localStorage.Todolist);
        // ALTERNATIVELY: parsedArray = JSON.parse(localStorage.getItem(localStorage.key(0)));
        
        for (let i=0; i < parsedArray.length; i+=1) {
            // Checks if you've added a single item and hides the Empty box
            if (document.querySelector(".box") !== null) {
                const hiddenbox = document.querySelector(".box");
                hiddenbox.classList.add("box--hidden");
            }

            // DEBUGGING FLUFF TO BE COMMENTED IN AND OUT:
            // console.log(parsedArray);

            // Selects template, and clones it
            const listTemplate = document.querySelector(".js-list-template");
            const listElement = listTemplate.content.cloneNode(true);

            // Selects empty li, sets input as text node (which sanitises) and appends it in
            const emptyLi = listElement.querySelector(".notez");
            const inputValue = parsedArray[i].note;
            const textNodeInput = document.createTextNode(inputValue);
            emptyLi.appendChild(textNodeInput);
            
            // Selects the whole box and gives it the event listener and function for ticking it
            const box = listElement.querySelector(".js-box");
            box.addEventListener("click", tickSwitch);

            // Selects the delete icon, gives it the event listener and delete function
            const deleteIcon = listElement.querySelector(".deletebutton");
            deleteIcon.addEventListener("click", deleteFunc);

            // Check if ticked
            if (parsedArray[i].ticked === true) {
                box.classList.add("box--ticked");
            }

            // Adds the finished box to the UL
            const list = document.querySelector(".js-ul");
            list.appendChild(listElement);
            list.appendChild(listTemplate);
        }
    }
    else {
        // EMPTY LIST MESSAGE
        if (document.querySelector(".box--hidden") !== null) {
            const hiddenbox = document.querySelector(".box--hidden");
            hiddenbox.classList.remove("box--hidden");
        }
    }
}


function tickSwitch(evt) {
    const singleBox = evt.target;
    
    let newBooleanState = true;
    if (singleBox.classList.contains("box--ticked")) {
        newBooleanState = false;
    }

    // If is a workaround to stop this being accidentally triggered by the delete button
    if (singleBox.childNodes[0] !== undefined) {
        const listContent = singleBox.childNodes[0].innerHTML; // finds the contents of <li> element
        for (var i=0; i < parsedArray.length; i+=1) {
            if (parsedArray[i].note === listContent) {
                parsedArray[i].ticked = newBooleanState;
            }
        }
        localStorage.setItem('Todolist', JSON.stringify(parsedArray));
        clearList();
        populateList();
    } 
}


function addItem() {
    const inputty = document.querySelector(".myInput").value;
    const inputty_trimmed = inputty.trim(); // Removes whitespace

    // Checks if blank input
    if (inputty_trimmed !== "") {
        // Blocks duplication
        for (var i=0; i < parsedArray.length; i+=1) {
            if (parsedArray[i].note === inputty_trimmed) {
                const hiddenbox = document.querySelector(".error");
                hiddenbox.innerHTML = "<i class=\"fas fa-exclamation-triangle\"></i> You already have that item on your list.";
                if (document.querySelector(".error--hidden") !== null) {
                    hiddenbox.classList.remove("error--hidden");
                }
                return;
            }
        }
    
        // Checks if list is full
        if (parsedArray.length < 10) {
            parsedArray.push({"note": inputty_trimmed, "ticked": false});
            localStorage.setItem('Todolist', JSON.stringify(parsedArray));
            checkHideError();
            clearList();
            populateList();
        } else {
            const hiddenbox = document.querySelector(".error");
            hiddenbox.innerHTML = "<i class=\"fas fa-exclamation-triangle\"></i> You cannot add more than 10 items.";
            if (document.querySelector(".error--hidden") !== null) {
                hiddenbox.classList.remove("error--hidden");
            }
        }
    } else {
        const hiddenbox = document.querySelector(".error");
        hiddenbox.innerHTML = "<i class=\"fas fa-exclamation-triangle\"></i> You cannot enter a blank item.";
        if (document.querySelector(".error--hidden") !== null) {
            hiddenbox.classList.remove("error--hidden");
        }
    }
}


function checkHideError() {
    // Hides the error box if it's there.
    if (document.querySelector(".error") !== null) {
        const hiddenbox = document.querySelector(".error");
        hiddenbox.innerHTML = "";
        hiddenbox.classList.add("error--hidden");
    }
}


function clearFunc(evt) {
    // Clears error message if needed.
    checkHideError();
    // Removes from the DOM
    clearList();
    // Removes from localStorage
    localStorage.clear();
    parsedArray = [];
    // Ensures Empty message appears
    populateList();
}
const clearbutton = document.querySelector(".clearBox");
clearbutton.addEventListener("click", clearFunc);


function deleteFunc(evt) {
    const deleteIcon = evt.target;
    // Gets the <li> element content
    const listContent = deleteIcon.parentNode.parentNode.parentNode.childNodes[0].innerHTML;
    for (var i=0; i < parsedArray.length; i+=1) {
        if (parsedArray[i].note === listContent) {
            if (window.confirm("Are you sure you want to delete this item?")) {
                parsedArray.splice(i, 1);
            }
        }
    }
        localStorage.setItem('Todolist', JSON.stringify(parsedArray));
        checkHideError();
        clearList();
        populateList();
}


let parsedArray = [];
populateList();
