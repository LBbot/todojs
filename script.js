// Set as empty on pageload, populated by parsing localStorage in populateList() at bottom of file
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

        for (let i = 0; i < parsedArray.length; i += 1) {
            // Checks if you've added a single item and hides the Empty box
            if (document.querySelector(".box") !== null) {
                const hiddenbox = document.querySelector(".box");
                hiddenbox.classList.add("box--hidden");
            }

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
            box.setAttribute("data-number", i);

            // Selects the UP icon, gives it the event listener and function
            const moveUpIcon = listElement.querySelector(".upbutton");
            moveUpIcon.addEventListener("click", moveFunc);
            moveUpIcon.setAttribute("data-number", i);

            // Selects the DOWN icon, gives it the event listener and function
            const moveDownIcon = listElement.querySelector(".downbutton");
            moveDownIcon.addEventListener("click", moveFunc);
            moveDownIcon.setAttribute("data-number", i);

            // Selects the delete icon, gives it the event listener and delete/modal function
            const deleteIcon = listElement.querySelector(".deletebutton");
            deleteIcon.addEventListener("click", summonModal);
            deleteIcon.setAttribute("data-number", i);

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

    // Set a boolean to avoid repeating in if/else
    let newBooleanState = true;
    if (singleBox.classList.contains("box--ticked")) {
        newBooleanState = false;
    }

    // This is a workaround to stop this being accidentally triggered by the delete button
    if (singleBox.childNodes[0] !== undefined) {
        // Changes the boolean in the array
        parsedArray[singleBox.getAttribute("data-number")].ticked = newBooleanState;
        // Sets it to the data and repopulates
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
        // Checks if list is full
        if (parsedArray.length < 10) {
            // Actually adds to list and then sets to localStorage
            parsedArray.push({"note": inputTrimmed, "ticked": false});
            localStorage.setItem("Todolist", JSON.stringify(parsedArray));
            hideError();
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


function hideError() {
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
    hideError();
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


function deleteFunc(number) {
    "use strict";
    parsedArray.splice(number, 1); // Actual deletion here
    localStorage.setItem("Todolist", JSON.stringify(parsedArray));
    hideError();
    clearList();
    populateList();
}


function moveFunc(evt) {
    "use strict";
    const moveIcon = evt.target.parentNode;
    const direction = moveIcon.classList.contains("upbutton") ? "up" : "down";
    const number = moveIcon.getAttribute("data-number");
    const previous = +number - +1;
    const next = +number + +1;
    let targetPosition;

    // Check direction and make sure you can't go up past index 0.
    if (direction === "up" && previous !== -1) {
        targetPosition = previous;
    // Check direction and make sure you can't go past the bottom of the list
    } else if (direction === "down" && next < parsedArray.length) {
        targetPosition = next;
    }

    if (targetPosition !== undefined) {
        const temp = parsedArray[targetPosition];
        parsedArray[targetPosition] = parsedArray[number];
        parsedArray[number] = temp;
    }

    localStorage.setItem("Todolist", JSON.stringify(parsedArray));
    hideError();
    clearList();
    populateList();
}


async function summonModal(evt) {
    "use strict";
    const deleteIcon = evt.target.parentNode;
    const number = deleteIcon.getAttribute("data-number");
    // Prep the item to show in the modal
    const quoteForList = document.querySelector(".quote");
    quoteForList.innerHTML = parsedArray[number].note;

    // Show modal
    const backgroundModal = document.querySelector(".myModal");
    const modalBox = document.querySelector(".modalContent");
    backgroundModal.classList.remove("myModal--hidden");

    const result = await new Promise((resolve) => {
        const yesButton = document.querySelector(".ok");
        const noButton = document.querySelector(".cancel");

        // Confirmation resolves the promise with true
        yesButton.addEventListener("click", () => {
            resolve(true);
        }, {once: true});

        // Click on cancel or background to resolve the promise returning false
        function resolveFalseFunction() {
            resolve(false);
        }
        noButton.addEventListener("click", resolveFalseFunction, {once: true});
        backgroundModal.addEventListener("click", resolveFalseFunction, {once: true});

        // Stops a click on the inner modal box from dismissing it
        modalBox.addEventListener("click", e => {
            e.stopPropagation();
        });
    });

    if (result) {
        deleteFunc(number);
    }
    backgroundModal.classList.add("myModal--hidden");
}


// Create list on pageload.
populateList();
