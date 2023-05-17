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
  
    // Append the card to the container
    container.appendChild(cardDiv);
  }