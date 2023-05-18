//

var searchButton = document.getElementById('searchButton');
document.addEventListener('DOMContentLoaded', function () {
  var saveButton = document.getElementById('saveBtn')
  if (saveButton) {
    saveButton.addEventListener('click', saveBrewery)
  }
  //event listener for when the page is rendered
  var savedRating = localStorage.getItem('rating') //sets savedRating to previously stored ranks for breweries
  if (savedRating) {
    //so long as the rating does not return null... (if a value exists)
    setRating(savedRating) //set the rating to whatever it is locally.
  } //otherwise, just load normally
})

//

// Form submission with brewery info retrived from the OpenBreweryAPI:

function formSubmit (event) {
  //event listener for the formSubmit button
  event.preventDefault()
  //Prevents default submission.

  var brewName = document.getElementById('breweryName').value //grabs all values within the user input fields to be stored
  var brewType = document.getElementById('breweryType').value
  var brewAddress = document.getElementById('brewAddress').value
  var userDescrip = document.getElementById('userDescription').value

  var brewRatingInfo = {
    //remember this object for when we need to call it from local memory
    //rating: localStorage.getItem('rating'),
    brewName: brewName,
    brewType: brewType,
    brewAddress: brewAddress,
    userDescrip: userDescrip
  }

  localStorage.setItem('brewRatingInfo', JSON.stringify(brewRatingInfo)) //stringifes the object brewRatingInfo and stores it locally.

  localStorage.removeItem('rating') //no need for rating if it's stored within the brewRatingInfo object - Removed.

  console.log(brewRatingInfo) //testing to see if the form data was submitted correctly into local storage.

  document.getElementById('breweryForm').reset() //resets the form, so they can revise their review if they want to.

  //include some kind of pop-up window telling the user that their form has been submitted
}

function searchBreweries () {
  var searchInput = document.getElementById('searchBrew').value // Taking in user input for the brewery name.

  var apiUrl =
    'https://api.openbrewerydb.org/v1/breweries/autocomplete?query=' +
    searchInput
  console.log(apiUrl)

  // Fetching data from the OpenBreweryAPI
  fetch(apiUrl)
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      if (data.length > 0) {
        var breweryId = data[0].id // Targets only the *first* result in the object list
        specifyBreweries(breweryId, searchInput) // Fetches additional data given the ID of the brewery
          .then(function (additionalData) {
            displayBreweries(additionalData) // Passes through all data for the brewery so it can be assigned to IDs in the card.
          })
          .catch(function (error) {
            console.log('Error:', error)
          })
      } else {
        console.log('No breweries found for the search input:', searchInput)
      }
    })
    .catch(function (error) {
      console.log('Error:', error)
    })
}

function specifyBreweries (data) {
  //takes OPDB ids for Breweries (returned in the Search Breweries() autocomplete search) and returns the remainder of the information such as type and location.
  var brewApi = `https://api.openbrewerydb.org/v1/breweries/${data}`

  return fetch(brewApi)
    .then(function (response) {
      return response.json() // Parse the response as JSON
    })
    .catch(function (error) {
      console.log('Error:', error)
    })
}

//

//Displaying the brewery (eventually brewer*ies*) to the user via the output container
function displayBreweries (brewery) {
  var breweryName = brewery.name
  var breweryType = brewery.brewery_type
  var breweryAddress = brewery.address_1

  var breweryName = brewery.name;
  var breweryType = brewery.brewery_type;
  var breweryAddress = brewery.address_1;

  document.getElementById('breweryName').textContent = "Brewery Name: " + breweryName;
  document.getElementById('breweryType').textContent = "Type of Brewery: " + breweryType.toUpperCase();
  document.getElementById('brewAddress').textContent = "Brewery Address: " + breweryAddress;
  document.getElementById('placeholderTitle').textContent = "Cheers!";
  //document.getElementById('userDescription').textContent = userDescription;
}

function createSaveButton () {
  //creates a save button for each id
  var saveButton = document.createElement('button')
  saveButton.innerText = 'Save'
  saveButton.addEventListener('click', saveBrewery)
  document.getElementById('saveBtn').appendChild(saveButton)
}

// Save the brewery information locally and append it to individualized cards
function saveBrewery() {
  var breweryName = document.getElementById('breweryName').textContent;
  var breweryType = document.getElementById('breweryType').textContent;
  var breweryAddress = document.getElementById('brewAddress').textContent;

  var breweryInfo = {
    //organizes all information into an object so the specific values (breweryInfo.breweryName) can be targeted later
    name: breweryName,
    type: breweryType,
    address: breweryAddress
  }

  var savedBreweries = localStorage.getItem('savedBreweries')
  
  if (breweryName !== 'Brewery Name') { // user can't save empty to favorites
    if (savedBreweries) {
      var breweries = JSON.parse(savedBreweries)
      breweries.push(breweryInfo)
      localStorage.setItem('savedBreweries', JSON.stringify(breweries))
    } else {
      localStorage.setItem('savedBreweries', JSON.stringify([breweryInfo])); //if no array currently exists for breweryInfo, create one.
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll('.navbar-burger'),
    0
  )

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach(el => {
      el.addEventListener('click', () => {
        // Get the target from the "data-target" attribute
        const target = el.dataset.target
        const $target = document.getElementById(target)

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active')
        $target.classList.toggle('is-active')
      })
    })
  }
})

//brewerySubmit.addEventListener("click", formSubmit); //event listener for the form's submit button.
if (searchButton) {
  searchButton.addEventListener('click', searchBreweries) //event listener for the home page's search button.
}
