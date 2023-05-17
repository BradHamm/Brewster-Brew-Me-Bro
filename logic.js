//TODOS:
//Find Icons for the brewery rating system or opt to leave them as stars.
//
//var brewerySubmit = document.getElementById('brewerySubmit');
var searchButton = document.getElementById('searchButton')

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('saveBtn').addEventListener('click', saveBrewery)
  //event listener for when the page is rendered
  var savedRating = localStorage.getItem('rating') //sets savedRating to previously stored ranks for breweries
  if (savedRating) {
    //so long as the rating does not return null... (if a value exists)
    setRating(savedRating) //set the rating to whatever it is locally.
  } //otherwise, just load normally
})

function rate (/*find a way, either through Id's or numbers to select the number of ratings in ascending order to pass */) {
  localStorage.setItem('rating', rating)
  setRating(rating)
}

function setRating (rating) {
  var brews = document.getElementsByClassName('rates')

  for (var i = 0; i < brews.length; i++) {
    rates[i].innerHTML = '&#9734;' //empty beer can initializing the rating system so the rating value can override it in the next for loop.
  }

  for (var i = 0; i < rating; i++) {
    rates[i].innerHTML = '&#9733;' //filled beer can representing locally stored rating from user 🍺
  }
}

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

/* function addYelpData (additionalData) {
  //since OPDB does the autocomplete for us, we can search by string without worrying about conflicts.
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer Y-WSh5eIkuMuDWMXfDNDaMpdAiGF8H2KVS2n0xly501T8K21AVbyvzq0oUM0OrAJ_VbYYP_cyiZMkprJ4a6-7b-rk3mho2po6NiAa2F41pvUOYOSJ1HbyTQ2IupiZHYx'
    }
  }
  console.log(additionalData);
  var name = additionalData.name;
  var address = additionalData.address_1;

  // Construct the URL for the fetch call
  var apiUrl = constructAdditionalApiUrl(name, address)

  fetch(apiUrl, options)
    .then(function (response) {
      return response.json() // Parse the response as JSON
    })
    .then(function (data) {
      assignYelpData(data)
    })
    .catch(function (error) {
      console.log('Error:', error)
    })
}
*/

/*
function constructAdditionalApiUrl (name, address) {
  //takes in name and address from OBDP fetch and replaces all spaces with %20 for url compliance, before returning the correct API for the Yelp fetch call.
  console.log(name);
  console.log(address);

  var nameArray = name.split(' ').join('%20')
  var addressArray = address.split(' ').join('%20')

  // Construct the URL with the formatted name and address
  var apiUrl =
    'https://api.yelp.com/v3/businesses/search?location=' +
    addressArray +
    '&term=' +
    nameArray +
    '&sort_by=best_match&limit=20'

  //console logging apiUrl for bug testing
  console.log(apiUrl)

  return apiUrl
}

*/

/*
function assignYelpData (yelpData) {
  var yelpReview = yelpData.buisinesses[0].rating
  var yelpDescription;
  document.getElementById('yelpReview').textContent =
    yelpReview + '/5 Starts from Yelp!'
    document.getElementById('yelpDescription').textContent = yelpDescription;
}
*/

//Displaying the brewery (eventually brewer*ies*) to the user via the output container
function displayBreweries (brewery) {
  var breweryName = brewery.name
  var breweryType = brewery.brewery_type
  var breweryAddress = brewery.address_1

  document.getElementById('breweryName').textContent =
    'Brewery Name: ' + breweryName
  document.getElementById('breweryType').textContent =
    'Type of Brewery: ' + breweryType.toUpperCase()
  document.getElementById('brewAddress').textContent =
    'Brewery Address: ' + breweryAddress
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
function saveBrewery () {
  var breweryName = document.getElementById('breweryName').textContent
  var breweryType = document.getElementById('breweryType').textContent
  var breweryAddress = document.getElementById('brewAddress').textContent

  var breweryInfo = {
    //organizes all information into an object so the specific values (breweryInfo.breweryName) can be targeted later
    name: breweryName,
    type: breweryType,
    address: breweryAddress
  }

  var savedBreweries = localStorage.getItem('savedBreweries')
  if (savedBreweries) {
    var breweries = JSON.parse(savedBreweries)
    breweries.push(breweryInfo)
    localStorage.setItem('savedBreweries', JSON.stringify(breweries))
  } else {
    localStorage.setItem('savedBreweries', JSON.stringify([breweryInfo]))
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
