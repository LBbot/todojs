function clearList() {
    // removes each ".js-box" FROM THE DOM
    const listOfBoxes = document.querySelectorAll(".js-box"); 
    listOfBoxes.forEach(function(element) {
        element.remove();
    });
}

function populateList() {
    // Checks IF it should display empty list message
    if (localStorage.length > 0) {
        for (let i = localStorage.length - 1; i >= 0 ; i-=1 ) {

            // Checks if you've added a single item and hides the Empty box
            if (document.querySelector(".box") !== null) {
                const hiddenbox = document.querySelector(".box")
                hiddenbox.classList.add("box--hidden");
            }


            // DEBUGGING FLUFF TO BE COMMENTED IN AND OUT:
                // console.log(localStorage.getItem(localStorage.key(i)));
                // console.log(localStorage.length);
                console.log(localStorage);

            // Selects template, and clones it
            const listTemplate = document.querySelector(".js-list-template");
            const listElement = listTemplate.content.cloneNode(true);

            // Selects empty li, sets input as text node (which sanitises) and appends it in
            const emptyLi = listElement.querySelector(".notez");
            const inputValue = localStorage.getItem(localStorage.key(i));
            const textNodeInput = document.createTextNode(inputValue);
            emptyLi.appendChild(textNodeInput);
            
            // Selects the whole box and gives it the event listener and function for ticking it
            const box = listElement.querySelector(".js-box");
            box.addEventListener("click", tickSwitch);

            // Adds the finished box to the UL
            const list = document.querySelector(".js-ul");
            list.appendChild(listElement);
            list.appendChild(listTemplate);
        }
    }
    else {
        if (document.querySelector(".box--hidden") !== null) {
            const hiddenbox = document.querySelector(".box--hidden");
            hiddenbox.classList.remove("box--hidden");
        }
    }
}

    function tickSwitch(evt) {
        const singleBox = evt.target;
        if (singleBox.classList.contains("box--ticked")) {
            singleBox.classList.remove("box--ticked");
        } else {
            singleBox.classList.add("box--ticked");
        }
    }

    function addItem() {
        const inputty = document.querySelector(".myInput").value;
        const inputty_trimmed = inputty.trim(); // Removes whitespace
        if (inputty_trimmed !== "") {
            // const listTemplate = document.querySelector(".js-list-template");
            // const listElement = listTemplate.content.cloneNode(true);

            // // Selects empty li, sets input as text node (which sanitises) and appends it in
            // const emptyLi = listElement.querySelector(".notez");
            // const textNodeInput = document.createTextNode(inputty_trimmed);
            // emptyLi.appendChild(textNodeInput);
            
            // // Selects the whole box and gives it the event listener and function
            // const box = listElement.querySelector(".js-box");
            // box.addEventListener("click", tickSwitch);

            // const list = document.querySelector(".js-ul");
            // list.appendChild(listElement);
            // list.appendChild(listTemplate);
            localStorage.setItem(localStorage.length, inputty_trimmed);
            clearList();
            populateList();
        } else {
            console.log("Invalid input!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        }
    }

    function clearFunc(evt) {
        // Removes from the DOM
        clearList();
        // Removes from localStorage
        localStorage.clear();
        // Ensures Empty message appears
        populateList();
    }
    const clearbutton = document.querySelector(".clearBox");
    clearbutton.addEventListener("click", clearFunc);
    
        // this gets the list text, which IS the value on localstorage which might let you delete it, IF you can map the icon to the delete function, perhaps with evt?
    // const deletey = document.querySelector(".deletebutton").parentNode.parentNode.childNodes[0].innerHTML;
    // console.log(deletey);

    // function deleteFunc(numba) {
    //     localStorage.removeItem(numba);
    //     location.reload(); 
    // }
    // const deleter = document.querySelectorAll(".deletebutton");
    // deleter.addEventListener("click", deleteFunc());

    populateList();
    