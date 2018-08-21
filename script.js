// Set as empty on pageload, populated by parsing localStorage in populateList() at bottom of file
let parsedArray = [];


if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        "use strict";
        navigator.serviceWorker.register("/sw.js").then(function (registration) {
            // Registration was successful
            console.log("ServiceWorker registration successful with scope: ", registration.scope);
        }, function (err) {
            // registration failed :(
            console.log("ServiceWorker registration failed: ", err);
        });
    });
} else {
    console.log("Can't Service Work in this browser apparently.");
}


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
    // console.log(localStorage.Todolist); // for debugging

    // Checks IF it should NOT display empty list message. On a fresh session or after CLEAR, this will be undefined.
    // If last item is manually deleted this will be empty array (as a string)
    if (localStorage.Todolist !== undefined && localStorage.Todolist !== "[]") {
        parsedArray = JSON.parse(localStorage.Todolist);

        // Hide the empty list messsage because todo list has things in
        const hiddenbox = document.querySelector(".emptybox");
        hiddenbox.classList.add("box--hidden");

        for (let i = 0; i < parsedArray.length; i += 1) {
            if (parsedArray[i] !== null) { // Is this check necessary?
                // Selects template, and clones it
                const listTemplate = document.querySelector(".js-list-template");
                const listElement = listTemplate.content.cloneNode(true);

                // Selects empty li, sets input as text node (which sanitises) and appends it in
                const emptyLi = listElement.querySelector(".note");
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
                // Check if first item on list so we can hide the up button
                if (i === 0) {
                    moveUpIcon.classList.add("button--hidden");
                }

                // Selects the DOWN icon, gives it the event listener and function
                const moveDownIcon = listElement.querySelector(".downbutton");
                moveDownIcon.addEventListener("click", moveFunc);
                moveDownIcon.setAttribute("data-number", i);
                // Check if last item on list so we can hide the down button
                if (i === parsedArray.length - 1) {
                    moveDownIcon.classList.add("button--hidden");
                }

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
        }
    // ELSE todo list is empty or non-existent so display empty list message
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

    // Check if the target has a title because the box doesn't. Buttons do and shouldn't be activated. Hacky but works.
    if (singleBox.getAttribute("title") === null) {
        // Changes the boolean in the array
        parsedArray[singleBox.getAttribute("data-number")].ticked = newBooleanState;
        // Sets it to the data and repopulates
        localStorage.setItem("Todolist", JSON.stringify(parsedArray));
        clearList();
        populateList();
    }
}


function addItem(e) {
    "use strict";
    // Prevent form submitting from refreshing the page
    e.preventDefault();

    const inputItem = document.querySelector(".myInput").value;
    const inputTrimmed = inputItem.trim(); // Removes whitespace
    // Checks if blank input
    if (inputTrimmed !== "") {
        // Checks if list is full
        if (parsedArray.length < 10) {
            // Actually adds to list and then sets to localStorage
            parsedArray.push({"note": inputTrimmed, "ticked": false});
            localStorage.setItem("Todolist", JSON.stringify(parsedArray));

            // Clears the input box, and refocuses it on submit so you can continue typing
            document.querySelector(".myInput").value = "";
            document.querySelector(".myInput").focus();

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
    const moveIcon = evt.target;
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
    // Prevents undefined errors & misreading click that turns target item to null
    if (targetPosition !== undefined && parsedArray[number]) {
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
    const deleteIcon = evt.target;
    const number = deleteIcon.getAttribute("data-number");
    // Prep the item to show in the modal, sanitise it
    const quoteForList = document.querySelector(".quote");
    const inputValue = parsedArray[number].note;
    const textNodeInput = document.createTextNode(inputValue);
    quoteForList.innerHTML = ""; // Resets the quote so it doesn't add to old ones.
    quoteForList.appendChild(textNodeInput);

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
