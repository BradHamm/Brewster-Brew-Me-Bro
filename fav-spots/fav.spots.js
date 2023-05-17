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
  
  document.addEventListener('DOMContentLoaded', function () {
    renderSavedBreweries();
  });
  
  function saveBreweryLocally(breweryInfo) {
    var savedBreweries = localStorage.getItem('savedBreweries');
    var breweries = savedBreweries ? JSON.parse(savedBreweries) : [];
    breweries.push(breweryInfo);
    localStorage.setItem('savedBreweries', JSON.stringify(breweries));
  }
  
  function renderSavedBreweries() {
    var container = document.getElementById('favoriteBreweriesList');
    container.innerHTML = '';
  
    var savedBreweries = localStorage.getItem('savedBreweries');
    if (savedBreweries) {
      var breweries = JSON.parse(savedBreweries);
      breweries.forEach(function (breweryInfo) {
        appendBreweryCard(breweryInfo);
      });
    }
  }  

document.addEventListener('DOMContentLoaded', function () {
    renderSavedBreweries();
  });
  
  // Render the saved brewery information on the fav-spots.html page
  function renderSavedBreweries() {
    var savedBreweries = localStorage.getItem('savedBreweries');
    if (savedBreweries) {
      var breweries = JSON.parse(savedBreweries);
      breweries.forEach(function (breweryInfo) {
        appendBreweryCard(breweryInfo);
      });
    }
  }
  
  // Append a brewery card to the container with the specified class
  function appendBreweryCard(data) {
    console.log(data);
    var container = document.getElementById('favoriteBreweriesList');

    var outerCardDiv = document.createElement('div');
    outerCardDiv.classList.add('tile' , 'is-vertical' ,  'is-12' ,  'is-warning' ,  'is-parent');
  
    var cardDiv = document.createElement('section');
    cardDiv.classList.add('is-child' ,  'notification' ,  'is-warning');
  
    // Create and append elements for brewery name, type, and address
    var breweryName = document.createElement('p');
    breweryName.classList.add('title');
    breweryName.textContent = data.name;
    cardDiv.appendChild(breweryName);
  
    var breweryType = document.createElement('p');
    breweryType.classList.add('subtitle');
    breweryType.textContent = data.type;
    cardDiv.appendChild(breweryType);
  
    var breweryAddress = document.createElement('p');
    breweryAddress.classList.add('subtitle');
    breweryAddress.textContent = data.address;
    cardDiv.appendChild(breweryAddress);

    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function () {
    deleteBreweryCard(cardDiv, data);
    });
    cardDiv.appendChild(deleteButton);
  
    // Append the card to the container
    container.appendChild(cardDiv);
  }

  function deleteBreweryCard(cardDiv, savedBrewery) {
    var container = document.getElementById('favoriteBreweriesList');
    
    // Remove the card from the container
    container.removeChild(cardDiv);
  
    // Remove the saved brewery from local storage
    var savedBreweries = localStorage.getItem('savedBreweries');
    if (savedBreweries) {
      var breweries = JSON.parse(savedBreweries);
      var index = breweries.findIndex(function (brewery) {
        return brewery.name === savedBrewery.name && brewery.type === savedBrewery.type && brewery.address === savedBrewery.address;
      });
      if (index !== -1) {
        breweries.splice(index, 1);
        localStorage.setItem('savedBreweries', JSON.stringify(breweries));
      }
    }
  }

  document.getElementById('saveToList').addEventListener('click', function () {
    searchAndSaveBreweries();
  });