function addBeer(favBeer){
    const articleEl = document.createElement('article');
    articleEl.classList.add("tile" , "is-child" , "notification" , "is-warning");
    const pEl = document.createElement('p');
    pEl.classList.add("title");
    pEl.textContent=favBeer.name //Use API for True Suffix
    articleEl.append(pEl);
    const textareaEL = document.createElement("textarea");
    textareaEL.classList.add("textarea","is-success","is-focused");
    articleEl.append(textareaEL);
    const divBEl = document.createElement("div");
    divBEl.classList.add("block");
    articleEl.append(divBEl);
    const buttonEL = document.createElement("button");
    buttonEL.classList.add("button" , "is-succsess");
    articleEl.append(buttonEL);
    const divPEL = document.createElement("div");
    divPEL.classList.add("tile","is-4","is-warning","is-parent");
    divPEL.append(articleEl);
    const divAEl = document.createElement("div");
    divAEl.classList.add("tile","is-ancestor");
    divAEl.append(divPEL);
    }

    // if user hits enter key, also save to list
    document.getElementById('newBeer').addEventListener("keypress", function(event) {
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
            console.log('hit enter button')
            // Cancel the default action, if needed
            event.preventDefault();
            // TODO: place search beer function here
        }
    });