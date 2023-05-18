function searchAndSaveBreweries() {
    var searchInput = document.getElementById('searchBrew').value;
  
    var apiUrl =
      'https://api.openbrewerydb.org/v1/breweries/autocomplete?query=' +
      searchInput;
  
    fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.length > 0) {
          var breweryId = data[0].id;
          specifyBreweries(breweryId, searchInput)
            .then(function (additionalData) {
              saveBreweryLocally(additionalData); // Save the brewery locally
              renderSavedBreweries(); // Update the display
            })
            .catch(function (error) {
              console.log('Error:', error);
            });
        } else {
          console.log('No breweries found for the search input:', searchInput);
        }
      })
      .catch(function (error) {
        console.log('Error:', error);
      });
  }
  
//

  document.addEventListener('DOMContentLoaded', function () {
    renderSavedBreweries();
  });

//
  
  function saveBreweryLocally(breweryInfo) { //saves the information directly from the API call, contrary to home page
    var savedBreweries = localStorage.getItem('savedBreweries'); //gets the current array of "savedBreweries" from storage
    var breweries = savedBreweries ? JSON.parse(savedBreweries) : []; //ternary operator looks for a truthy value (not undefined, null or empty), checking if savedBreweries currently contains anything. If not, breweries is simply an empty array []. 

    var isDuplicate = breweries.some(function (brewery) { //.some checks if the information already exists within a locally stored object.
        return (
          brewery.name === breweryInfo.name &&
          brewery.type === breweryInfo.type &&
          brewery.address === breweryInfo.address
        ); //compares new brewery information to the information already stored locally
      });

      if (isDuplicate) { //if true console log error and return
        console.log('Duplicate brewery. Already saved locally.');
        return; // Exit the function without saving
      } //otherwise, continue to breweries.push

    breweries.push(breweryInfo); //pushes breweryInfo retireved from the API to the start of the breweries array.
    localStorage.setItem('savedBreweries', JSON.stringify(breweries)); //saves that information locally.
  }
  
//

function saveRatingLocally(index, rating) {
    var savedRatings = localStorage.getItem('savedRatings');
    var ratings = savedRatings ? JSON.parse(savedRatings) : {};
    ratings[index] = rating;
    localStorage.setItem('savedRatings', JSON.stringify(ratings));
  }

//

function setRating(index, rating) {
    var brews = document.querySelectorAll('.rates[data-index="' + index + '"] .star');
  
    for (var i = 0; i < brews.length; i++) {
      brews[i].innerHTML = '&#9734;'; // empty beer can initializing the rating system so the rating value can override it in the next for loop.
      brews[i].setAttribute('data-index', i); // add a data-index attribute to store the index of the card
      brews[i].addEventListener('click', rate);
    }
  
    for (var i = 0; i < rating; i++) {
        if (brews[i]) {
            brews[i].innerHTML = '🍺'; // filled beer can representing locally stored rating from user 🍺
        }
    }
  }
  
  function rate(event) {
    var rating = parseInt(event.target.getAttribute('data-index')) + 1; // get the index from the data-index attribute and increment it by 1
    var index = parseInt(event.target.getAttribute('data-index'));
    saveRatingLocally(index, rating);
    setRating(index, rating);
  }
//

  function renderSavedBreweries() {
    var container = document.getElementById('favoriteBreweriesList');
    container.innerHTML = '';
  
    var savedBreweries = localStorage.getItem('savedBreweries');
    if (savedBreweries) {
      var breweries = JSON.parse(savedBreweries);
      var savedRatings = localStorage.getItem('savedRatings');
      var ratings = savedRatings ? JSON.parse(savedRatings) : {};
      breweries.forEach(function (breweryInfo, index) { //itterating through the entire breweryInfo list, the index for each position in the array is also passed through so the ratings can be saved to the correct index.
        appendBreweryCard(breweryInfo, index);
        setRating(index, ratings[index]);
      });
    }
  }  

//
  
  // Append a brewery card to the container with the specified class
  function appendBreweryCard(data, index) {
    console.log(data);
    var container = document.getElementById('favoriteBreweriesList');
  
    var outerCardDiv = document.createElement('div');
    outerCardDiv.classList.add('tile', 'is-vertical', 'is-12', 'is-warning', 'is-parent');
  
    var cardDiv = document.createElement('section');
    cardDiv.classList.add('is-child', 'notification', 'is-warning');
  
    // Create and append elements for brewery name, type, and address
    var breweryName = document.createElement('p');
    breweryName.classList.add('title');
    breweryName.textContent = data.name;
    cardDiv.appendChild(breweryName);
  
    var breweryType = document.createElement('p');
    breweryType.classList.add('subtitle');
    breweryType.textContent = capitalizeFirstLetter(data.type || data.brewery_type); // Use data.brewery_type if data.type is undefined
    cardDiv.appendChild(breweryType);
  
    var breweryAddress = document.createElement('p');
    breweryAddress.classList.add('subtitle');
    breweryAddress.textContent = data.address || data.address_1; // Use data.address_1 if data.address is undefined
    cardDiv.appendChild(breweryAddress);
  
    var ratesDiv = document.createElement('div');
    ratesDiv.classList.add('rates');
    ratesDiv.dataset.index = index;
    
    for (var i = 1; i <= 5; i++) {
      var star = document.createElement('span');
      star.innerHTML = '&#9734;';
      star.classList.add('star');
      star.dataset.rating = i;
      star.dataset.index = index;
    
      star.addEventListener('click', (function (rating, index) {
        return function () {
          saveRatingLocally(index, rating);
          setRating(index, rating);
        };
      })(i, index));
    
      ratesDiv.appendChild(star);
    }

    cardDiv.appendChild(ratesDiv);

    var ratesDiv = document.createElement('div');
    ratesDiv.classList.add('rates');
    ratesDiv.dataset.index = index;

    cardDiv.appendChild(ratesDiv);
    cardDiv.appendChild(ratesDiv);

    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function () {
      deleteBreweryCard(cardDiv, data);
    });
    cardDiv.appendChild(deleteButton);
  
    // Append the card to the container
    container.appendChild(cardDiv);
  }

//

  //function capitalizes the first letter of the string passed, then adds that character to the string with the first character removed from the original string. Allows for capitalization of brewery type without directly changing how the information is parsed and stored locally. 
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

//

  function deleteBreweryCard(cardDiv, savedBrewery) {
    var container = document.getElementById('favoriteBreweriesList');
    
    // Remove the card from the container
    container.removeChild(cardDiv);
  
    // Remove the saved brewery from local storage
    var savedBreweries = localStorage.getItem('savedBreweries');
    if (savedBreweries) { //if there are saved Breweries in local storage...
      var breweries = JSON.parse(savedBreweries); //converts JSON string to a JS object...
      var index = breweries.findIndex(function (brewery) { //callback checks against each element in the array...
        return brewery.name === savedBrewery.name && brewery.type === savedBrewery.type && brewery.address === savedBrewery.address;
      });
      if (index !== -1) { //.findIndex() returns -1 if no match was found, otherwise .findIndex found a match for the information within the localStorage's brewery array.
        breweries.splice(index, 1); //removes the element at the "index" position, other parameter means only 1 was removed
        localStorage.setItem('savedBreweries', JSON.stringify(breweries)); //saves updated "breweries" array locally
      }
    }
  }

//

  document.getElementById('saveToList').addEventListener('click', function () {
    searchAndSaveBreweries();
  });