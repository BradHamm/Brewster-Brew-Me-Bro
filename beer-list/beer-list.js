function saveBeerLocally(beerData) {
    const savedBeers = getSavedBeers(); //retrieves beers already saved to local storage

    const isDuplicate = savedBeers.some(function (beer) { //checks for duplicates to prevent redundancy 
        return beer.name === beerData.name;
      });
    
      if (isDuplicate) {
        console.log("Duplicate beer, you've had enough to drink."); ///prints out a humorous error message to the exhaulted "inspect element" users
        return; //exits the information without saving locally
      }
  
    //pushes the new beer information to the end of the array, all stored within the savedBeers object
    savedBeers.push({
      name: beerData.name,
      abv: beerData.abv,
      tagline: beerData.tagline
    });
  
    //saves the updated beer to local storage
    localStorage.setItem('savedBeers', JSON.stringify(savedBeers));
  }
  
  function renderSavedBeers() { //renders the saved beers upon the page loading (see line 41)
    const container = document.getElementById('beerList');
    container.innerHTML = ''; //clears the container before passing through any of the cards
  
    const savedBeers = getSavedBeers(); //retrieves the information for the cards from local storage 
  
    savedBeers.forEach(function (beer, index) { //the information for the beers and its index (where the description is stored) are, for each instance, passed through... 
        const card = addBeer(beer, index); //appended to the card which will return in its entirety...
        container.append(card); //and be appended to the beerList to be shown to the user.
    });
  }

  function getSavedBeers() {
    const savedBeersJSON = localStorage.getItem('savedBeers'); //targets instances of savedBeers within local storage
    return savedBeersJSON ? JSON.parse(savedBeersJSON) : []; //ternary operator, basically fancy if/if else statement. Returns empty array if value does no exist, if it does, run JSON.parse(savedBeersJSON). This is both to retrieve present information and create an empty array if one does not already exist, otherwise, we'd have to initialize it later.
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    renderSavedBeers();
  });
  
  var button = document.getElementById('fetchBeerButton');
  button.addEventListener('click', function () {
    
    var textarea = document.getElementById('newBeer');
    var userInput = textarea.value.trim();
    var formattedInput = userInput.replace(/ /g, '_'); // Replace spaces with underscores. / / represents a space, but adding g represents global, so it will replace all instances of it within the userInput
    console.log(formattedInput); //input has to be formatted with an underscore to comply with the Punk API.
  
    var apiUrl = 'https://api.punkapi.com/v2/beers?beer_name=' + formattedInput + '&page=1&per_page=1';
    console.log(apiUrl);
  
    fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        if (data.length > 0) { //redundant since we only chose the top result, but we'll keep it to improve on functionality in the future.
          var beerData = data[0]; //get the first result
          saveBeerLocally(beerData); //saves the beerData locally and gives it an index.
          renderSavedBeers(); //renders the beers on the page after the addition of the new beerData
        } else {
          console.log('No beers found for the search input:', userInput);
        }
      })
      .catch(function (error) {
        console.log('Error:', error);
      });
  });
  
  function addBeer(favBeer, index) { // Add index parameter here, so the cards match up with the 
    const articleEl = document.createElement('article');
    articleEl.classList.add('tile', 'is-child', 'notification', 'is-warning');
  
    const pEl = document.createElement('p');
    pEl.classList.add('title' , 'is-4');
    pEl.textContent = favBeer.name; //appends the beer name
    articleEl.append(pEl);
  
    const abvEl = document.createElement('p');
    abvEl.classList.add('subtitle');
    abvEl.textContent = `ABV: ${favBeer.abv}%`; //appends the ABV for the beer with added string information for "ABV: XX.X%, where X is the value from the Punk API"
    articleEl.append(abvEl);
  
    const taglineEl = document.createElement('p');
    taglineEl.classList.add('subtitle');
    taglineEl.textContent = favBeer.tagline; //the description of the beer provided to the user
    articleEl.append(taglineEl);
  
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete'; //the delete button to remove the card from the list - Also removed the beer from local storage and its userDescription index from the array.
    deleteButton.addEventListener('click', function () {
      deleteBeer(index);
    });
    articleEl.append(deleteButton);
  
    const textareaEl = document.createElement('textarea');
    textareaEl.classList.add('textarea', 'is-success', 'is-focused'); //text field for notes.
    textareaEl.value = getSavedBeerNotes(index); //if there exists a text entry already for that beer, given its position in the notes array, apply that value to the text.
    articleEl.append(textareaEl);
  
    // Create a div for the block
    const divEl = document.createElement('div');
    divEl.classList.add('block');
    articleEl.append(divEl);
  
    // Create a save button and add event listener
    const buttonEl = document.createElement('button');
    buttonEl.classList.add('button', 'is-success');
    buttonEl.textContent = 'Save';
    buttonEl.addEventListener('click', function () {
      const notes = textareaEl.value; //intakes the information in the textarea element and adds the notes to the specified index of the array (index passed through in addBeer());
      saveBeerNotesLocally(index, notes); //saves the notes locally by updating the text information at the given index.
    });
    articleEl.append(buttonEl); //appends the save button to the article element
  
    return articleEl; //returns all of the information to be appended within the savedBeers.foreach() function.
  }

  function saveBeerNotesLocally(index, notes) { //saves the notes for specific cards at their index, that way notes are retained for the specific breweries without having to tie them to the locally stored informaiton.
    const savedBeerNotes = getSavedBeerNotesArray();
    savedBeerNotes[index] = notes; //within the saved beer notes, //saves the beer to the given index within the array (savedBeerNotes)
    localStorage.setItem('savedBeerNotes', JSON.stringify(savedBeerNotes));
  }
  
  function getSavedBeerNotesArray() {
    const savedBeerNotesJSON = localStorage.getItem('savedBeerNotes');
    return savedBeerNotesJSON ? JSON.parse(savedBeerNotesJSON) : [];
  }
  
  function getSavedBeerNotes(index) {
    const savedBeerNotes = getSavedBeerNotesArray();
    return savedBeerNotes[index] || ''; //if there are no saved notes at that index, return an empty string to be placed in that section
  }


  function deleteBeer(index) { //removes the beer information *specifically* from local storage.
    //retrieves the list of savedBeers
    const savedBeers = getSavedBeers();
  
    //removes the beer at that specific index of the savedBeers array
    savedBeers.splice(index, 1);
  
    //stringifys the new array and places it into local storage
    localStorage.setItem('savedBeers', JSON.stringify(savedBeers));
  
    //passes the index so the description information can be deleted and the index info for all other cards can be updated. 
    updateBeerNoteIndexes(index); 
  
    //re-renders the page so the user can see their results
    renderSavedBeers();
  }
  
  function updateBeerNoteIndexes(deletedIndex) { //updates the array of notes for each beer, so it flows with deletion. (Only runs in instances of deleting, as adding an index wont mess with the other values)
    const savedBeerNotes = getSavedBeerNotesArray();
  
    savedBeerNotes.splice(deletedIndex, 1); //removes the note at deletedIndex - that way all of the notes match up correctly (index position = savedBeers array position)
  
    for (let i = deletedIndex; i < savedBeerNotes.length; i++) {
      const note = savedBeerNotes[i];
      if (note !== undefined) {
        note.index = note.index - 1; //update the indexes of the remaining notes by itterating in the for loop, by moving them all down by 1 value, that way the notes match up to the updated card positions.
      }
    }
  
    localStorage.setItem('savedBeerNotes', JSON.stringify(savedBeerNotes)); //saves the info to local storage
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


