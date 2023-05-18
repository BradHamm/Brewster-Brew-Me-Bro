function saveBeerLocally(beerData) {
    // Retrieve the existing saved beers from local storage
    const savedBeers = getSavedBeers();

    const isDuplicate = savedBeers.some(function (beer) {
        return beer.name === beerData.name;
      });
    
      if (isDuplicate) {
        console.log("Duplicate beer, you've had enough to drink."); //Maybe we can print this out to the screen instead of just console logging?
        return; // Exit the function without saving
      }
  
    // Add the new beer data to the saved beers array
    savedBeers.push({
      name: beerData.name,
      abv: beerData.abv,
      tagline: beerData.tagline
    });
  
    // Save the updated beers array to local storage
    localStorage.setItem('savedBeers', JSON.stringify(savedBeers));
  }
  
  function renderSavedBeers() {
    const container = document.getElementById('beerList');
    container.innerHTML = ''; // Clear the container before rendering
  
    const savedBeers = getSavedBeers();
  
    savedBeers.forEach(function (beer, index) {
      const card = addBeer(beer, index);
      container.append(card);
    });
  }

  function getSavedBeers() {
    const savedBeersJSON = localStorage.getItem('savedBeers');
    return savedBeersJSON ? JSON.parse(savedBeersJSON) : [];
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    renderSavedBeers();
  });
  
  var button = document.getElementById('fetchBeerButton');
  button.addEventListener('click', function () {
    
    var textarea = document.getElementById('newBeer');
    var userInput = textarea.value.trim();
    var formattedInput = userInput.replace(/ /g, '_'); // Replace spaces with underscores
    console.log(formattedInput);
  
    var apiUrl = 'https://api.punkapi.com/v2/beers?beer_name=' + formattedInput + '&page=1&per_page=1';
    console.log(apiUrl);
  
    fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        if (data.length > 0) {
          var beerData = data[0]; // Get the top result
          saveBeerLocally(beerData); // Save the beer locally
          renderSavedBeers(); // Update the display
        } else {
          console.log('No beers found for the search input:', userInput);
        }
      })
      .catch(function (error) {
        console.log('Error:', error);
      });
  });

  function renderSavedBeers() {
    const container = document.getElementById('beerList');
    container.innerHTML = ''; // Clear the container before rendering
  
    const savedBeers = getSavedBeers();
  
    savedBeers.forEach(function (beer, index) { // Add index parameter here
      const card = addBeer(beer, index); // Pass index here
      container.append(card);
    });
  }
  
  function addBeer(favBeer, index) { // Add index parameter here
    const articleEl = document.createElement('article');
    articleEl.classList.add('tile', 'is-child', 'notification', 'is-warning');
  
    // Create and append elements for beer name, abv, and tagline
    const pEl = document.createElement('p');
    pEl.classList.add('title' , 'is-4');
    pEl.textContent = favBeer.name;
    articleEl.append(pEl);
  
    const abvEl = document.createElement('p');
    abvEl.classList.add('subtitle');
    abvEl.textContent = `ABV: ${favBeer.abv}%`;
    articleEl.append(abvEl);
  
    const taglineEl = document.createElement('p');
    taglineEl.classList.add('subtitle');
    taglineEl.textContent = favBeer.tagline;
    articleEl.append(taglineEl);
  
    // Create a delete button and add event listener
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function () {
      deleteBeer(index);
    });
    articleEl.append(deleteButton);
  
    // Create a textarea for notes
    const textareaEl = document.createElement('textarea');
    textareaEl.classList.add('textarea', 'is-success', 'is-focused');
    textareaEl.value = getSavedBeerNotes(index); // Set the value from saved notes
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
      const notes = textareaEl.value;
      saveBeerNotesLocally(index, notes);
    });
    articleEl.append(buttonEl);
  
    return articleEl;
  }

  function saveBeerNotesLocally(index, notes) {
    const savedBeerNotes = getSavedBeerNotesArray();
    savedBeerNotes[index] = notes;
    localStorage.setItem('savedBeerNotes', JSON.stringify(savedBeerNotes));
  }
  
  function getSavedBeerNotesArray() {
    const savedBeerNotesJSON = localStorage.getItem('savedBeerNotes');
    return savedBeerNotesJSON ? JSON.parse(savedBeerNotesJSON) : [];
  }
  
  function getSavedBeerNotes(index) {
    const savedBeerNotes = getSavedBeerNotesArray();
    return savedBeerNotes[index] || '';
  }


  function deleteBeer(index) {
    // Retrieve the existing saved beers from local storage
    const savedBeers = getSavedBeers();
  
    // Remove the beer at the specified index
    savedBeers.splice(index, 1);
  
    // Save the updated beers array to local storage
    localStorage.setItem('savedBeers', JSON.stringify(savedBeers));
  
    // Update the indexes of the saved beer notes
    updateBeerNoteIndexes(index);
  
    // Re-render the saved beers
    renderSavedBeers();
  }
  
  function updateBeerNoteIndexes(deletedIndex) {
    const savedBeerNotes = getSavedBeerNotesArray();
  
    savedBeerNotes.splice(deletedIndex, 1); // Remove the note at deletedIndex
  
    for (let i = deletedIndex; i < savedBeerNotes.length; i++) {
      const note = savedBeerNotes[i];
      if (note !== undefined) {
        note.index = note.index - 1; // Update the indexes of the remaining notes
      }
    }
  
    localStorage.setItem('savedBeerNotes', JSON.stringify(savedBeerNotes));
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


