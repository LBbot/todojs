let parsedArray = [];


function clearList() {
    "use strict";
    // removes each ".js-box" FROM THE DOM
    const listOfBoxes = document.querySelectorAll(".js-box");
    listOfBoxes.forEach(function (element) {
        element.remove();
    });
}


function populateList() {
    "use strict";
    // Checks IF it should display empty list message, 2nd condition stops a single delete not triggering it
    if (localStorage.Todolist !== undefined && localStorage.Todolist.length !== 2) {
        parsedArray = JSON.parse(localStorage.Todolist);
        // ALTERNATIVELY: parsedArray = JSON.parse(localStorage.getItem(localStorage.key(0)));

        for (let i = 0; i < parsedArray.length; i += 1) {
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

            // Selects the UP icon, gives it the event listener and function
            const moveUpIcon = listElement.querySelector(".upbutton");
            moveUpIcon.addEventListener("click", moveUpFunc);

            // Selects the DOWN icon, gives it the event listener and function
            const moveDownIcon = listElement.querySelector(".downbutton");
            moveDownIcon.addEventListener("click", moveDownFunc);

            // Selects the delete icon, gives it the event listener and delete function
            const deleteIcon = listElement.querySelector(".deletebutton");
            deleteIcon.addEventListener("click", deleteFunc);

            // Check if ticked
            if (parsedArray[i].ticked === true) {
                box.classList.add("box--ticked");
                const buttonsToTick = box.childNodes[2];
                buttonsToTick.classList.add("buttons--ticked");
            }

            // Adds the finished box to the UL
            const list = document.querySelector(".js-ul");
            list.appendChild(listElement);
            list.appendChild(listTemplate);
        }
    // Empty list message
    } else if (document.querySelector(".box--hidden") !== null) {
        const hiddenbox = document.querySelector(".box--hidden");
        hiddenbox.classList.remove("box--hidden");
    }
}


function tickSwitch(evt) {
    "use strict";
    const singleBox = evt.target;

    let newBooleanState = true;
    if (singleBox.classList.contains("box--ticked")) {
        newBooleanState = false;
    }

    // If is a workaround to stop this being accidentally triggered by the delete button
    if (singleBox.childNodes[0] !== undefined) {
        const listContent = singleBox.childNodes[0].innerHTML; // finds the contents of <li> element
        for (let i = 0; i < parsedArray.length; i += 1) {
            if (parsedArray[i].note === listContent) {
                parsedArray[i].ticked = newBooleanState;
            }
        }
        localStorage.setItem("Todolist", JSON.stringify(parsedArray));
        clearList();
        populateList();
    }
}


function addItem() {
    "use strict";
    const inputItem = document.querySelector(".myInput").value;
    const inputTrimmed = inputItem.trim(); // Removes whitespace

    // Checks if blank input
    if (inputTrimmed !== "") {
        // Blocks duplication
        for (let i = 0; i < parsedArray.length; i += 1) {
            if (parsedArray[i].note === inputTrimmed) {
                const hiddenbox = document.querySelector(".error");

                hiddenbox.innerHTML
                = "<i class=\"fas fa-exclamation-triangle\"></i> You already have that item on your list.";

                if (document.querySelector(".error--hidden") !== null) {
                    hiddenbox.classList.remove("error--hidden");
                }
                return;
            }
        }

        // Checks if list is full
        if (parsedArray.length < 10) {
            parsedArray.push({"note": inputTrimmed, "ticked": false});
            localStorage.setItem("Todolist", JSON.stringify(parsedArray));
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
const submitButton = document.querySelector(".js-submit");
submitButton.addEventListener("click", addItem);


function checkHideError() {
    "use strict";
    // Hides the error box if it's there.
    if (document.querySelector(".error") !== null) {
        const hiddenbox = document.querySelector(".error");
        hiddenbox.innerHTML = "";
        hiddenbox.classList.add("error--hidden");
    }
}


function clearFunc() {
    "use strict";
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
    "use strict";
    const deleteIcon = evt.target;
    // Gets the <li> element content
    const listContent = deleteIcon.parentNode.parentNode.parentNode.childNodes[0].innerHTML;
    for (let i = 0; i < parsedArray.length; i += 1) {
        if (parsedArray[i].note === listContent) {
            if (window.confirm("Are you sure you want to delete this item?")) {
                parsedArray.splice(i, 1);
            }
        }
    }
    localStorage.setItem("Todolist", JSON.stringify(parsedArray));
    checkHideError();
    clearList();
    populateList();
}


function moveUpFunc(evt) {
    "use strict";
    const moveIcon = evt.target;
    // Gets the <li> element content
    const listContent = moveIcon.parentNode.parentNode.parentNode.childNodes[0].innerHTML;
    for (let i = 0; i < parsedArray.length; i += 1) {
        const previous = i - 1;
        if (parsedArray[i].note === listContent && previous !== -1) {
            const temp = parsedArray[previous];
            parsedArray[previous] = parsedArray[i];
            parsedArray[i] = temp;
        }
    }
    localStorage.setItem("Todolist", JSON.stringify(parsedArray));
    checkHideError();
    clearList();
    populateList();
}

function moveDownFunc(evt) {
    "use strict";
    const moveIcon = evt.target;
    // Gets the <li> element content
    const listContent = moveIcon.parentNode.parentNode.parentNode.childNodes[0].innerHTML;
    for (let i = 0; i < parsedArray.length; i += 1) {
        const next = i + 1;
        if (parsedArray[i].note === listContent && next < parsedArray.length) {
            const temp = parsedArray[next];
            parsedArray[next] = parsedArray[i];
            parsedArray[i] = temp;
            break;
        }
    }
    localStorage.setItem("Todolist", JSON.stringify(parsedArray));
    checkHideError();
    clearList();
    populateList();
}


populateList();
