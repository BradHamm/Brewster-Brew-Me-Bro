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
  
    var cardDiv = document.createElement('div');
    cardDiv.classList.add('tile', 'is-vertical', 'is-12', 'is-warning', 'is-parent');
  
    // Create and append elements for brewery name, type, and address
    var breweryName = document.createElement('h2');
    breweryName.textContent = data.name;
    cardDiv.appendChild(breweryName);
  
    var breweryType = document.createElement('p');
    breweryType.textContent = data.type;
    cardDiv.appendChild(breweryType);
  
    var breweryAddress = document.createElement('p');
    breweryAddress.textContent = data.address;
    cardDiv.appendChild(breweryAddress);
  
    // Append the card to the container
    container.appendChild(cardDiv);
  }