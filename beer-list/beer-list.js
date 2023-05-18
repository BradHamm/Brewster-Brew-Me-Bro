function saveBeerLocally(beerData) {
    // Retrieve the existing saved beers from local storage
    const savedBeers = getSavedBeers();
  
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
  
    savedBeers.forEach(function (beer) {
      const card = addBeer(beer);
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
  
    var apiUrl = 'https://api.punkapi.com/v2/beers?beer_name=' + formattedInput + '&page=1&per_page=10';
  
    fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
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

  function addBeer(favBeer) {
    const articleEl = document.createElement('article');
    articleEl.classList.add('tile', 'is-child', 'notification', 'is-warning');
  
    const pEl = document.createElement('p');
    pEl.classList.add('title');
    pEl.textContent = favBeer.name; // Use API for True Suffix
    articleEl.append(pEl);
  
    const abvEl = document.createElement('p');
    abvEl.classList.add('subtitle');
    abvEl.textContent = `ABV: ${favBeer.abv}`;
    articleEl.append(abvEl);
  
    const taglineEl = document.createElement('p');
    taglineEl.classList.add('subtitle');
    taglineEl.textContent = favBeer.tagline;
    articleEl.append(taglineEl);
  
    const textareaEl = document.createElement('textarea');
    textareaEl.classList.add('textarea', 'is-success', 'is-focused');
    articleEl.append(textareaEl);
  
    const divEl = document.createElement('div');
    divEl.classList.add('block');
    articleEl.append(divEl);
  
    const buttonEl = document.createElement('button');
    buttonEl.classList.add('button', 'is-success');
    buttonEl.textContent = 'Save';
    buttonEl.addEventListener('click', function () {
      const notes = textareaEl.value;
      saveBeerLocally({ ...favBeer, notes });
    });
    articleEl.append(buttonEl);
  
    const divParentEl = document.createElement('div');
    divParentEl.classList.add('tile', 'is-4', 'is-warning', 'is-parent');
    divParentEl.append(articleEl);
  
   return divParentEl;  }

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


