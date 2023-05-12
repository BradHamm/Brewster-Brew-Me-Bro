//homePageNav = document.getElementById("homeNav");
//favBrews = document.getElementById("favBrewsNav");
//favDrinks = document.getElementById("favDrinksNav");
//aboutUsNav = getElementById("#aboutUsNav");


// NavBar navigation buttons - Will bring the user to the selected webpage when it's clicked on.

/*
favBrews.addEventListener("click", function () {
    document.location.href = "fav.spots.html";
    //load information locally for favorite breweries
});

favDrinks.addEventListener("click", function () {
    document.location.href = "beer-list.html";
    //load information locally for favorite beers 
})

aboutUsNav.addEventListener("click", function () {
    document.location.href = "about-us.html";
})

homePageNav.addEventListener("click", function () {
    document.location.href = "home-page.html";
})
*/

// Form submissions for user input on breweries

document.addEventListener("DOMContentLoaded", function () { //event listener for when the page is rendered
    var savedRating = localStorage.getItem("rating"); //sets savedRating to previously stored ranks for breweries 
    if (savedRating) { //so long as the rating does not return null... (if a value exists)
        setRating(savedRating); //set the rating to whatever it is locally.
    } //otherwise, just load normally
});

function rate(/*find a way, either through Id's or numbers to select the number of ratings in ascending order to pass */) { 
    localStorage.setItem("rating", rating);
    setRating(rating);
}

function setRating(rating) {
    var brews = document.getElementsByClassName("rates");

    for (var i = 0; i < brews.length; i++) {
        rates[i].innerHTML = "&#9734;"; //empty beer can initializing the rating system so the rating value can override it in the next for loop.
    }

    for (var i = 0; i < rating; i++) {
        rates[i].innerHTML = "&#9733;" //filled beer can representing locally stored rating from user
    }
}

// Form submission with brewery info retrived from the OpenBreweryAPI:

function formSubmit (event) { //create an event listener for the formSubmit button 
    event.preventDefault();
    //Prevents default submission.

    var brewName = document.getElementById("breweryName").value; //grabs all values within the user input fields to be stored
    var brewType = document.getElementById("breweryType").value; 
    var brewAddress = document.getElementById("brewAddress").value; 
    var userDescrip = document.getElementById("userDescription").value;

    var brewRatingInfo = { //remember this object for when we need to call it from local memory
        rating: localStorage.getItem("rating"),
        brewName: brewName,
        brewType: brewType,
        brewAddress: brewAddress,
        userDescrip: userDescrip,
    };

    localStorage.setItem("brewRatingInfo", JSON.stringify(brewRatingInfo)); //stringifes the object brewRatingInfo and stores it locally.

    localStorage.removeItem("rating"); //no need for rating if it's stored within the brewRatingInfo object - Removed.

    console.log(brewRatingInfo); //testing to see if the form data was submitted correctly into local storage.

    document.getElementById("breweryForm").reset(); //resets the form, so they can revise their review if they want to.

    //include some kind of pop-up window telling the user that their form has been submitted
}


brewerySubmit.addEventListener("click", formSubmit); //event listener for the form's submit button.


//#searchBrew = Text field for the user input 
//#searchButton = Search button 
//#brewOutput = Card that the output is being printed out to
//brewery name, address, type of brewery = info retrieved from the API
//personal ratings, yelp ratings and yelpReview

//Search button and search field for user input, accompanied by the function to display the information on a card:

// Function to handle the search request


function searchBreweries() {
  var searchInput = document.getElementById('searchBrew').value; //Taking in user input for the brewery name.

  // Will this run? Or do I need to convery SearchInput to a string?
  var apiUrl = 'https://api.openbrewerydb.org/v1/breweries/autocomplete?query=' + searchInput + '';

  // Fetching data from the OpenBreweryAPI
  fetch(apiUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      displayBreweries(data);
      addYelpData(  /*possibly pass through lat and long data for the specific location of the address?*/   );
    })
    .catch(function(error) {
      console.log('Error:', error);
    });
}

function addYelpData(   /* lat and long? */    ) {
  var yelpAPI = 'Yelp API link + query selector =' + /* lat and long? */;

  // Fetch data from the additional API
  fetch(yelpAPI)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      addYelpData(data);
    })
    .catch(function(error) {
      console.log('Error:', error);
    });
}

// Example function to assign the additional data to the user output card
function addYelpData(/*     Object to be passed through     */) {
  var yelpReview = /*   Review out of 5 stars from yelp    */;
  var yelpDescription = /*   Atmosphere description from yelp   */;

  // Assign the additional data to the respective elements on the user output card
  document.getElementById('yelpReview').textContent = yelpReview;
  document.getElementById('yelpDescription').textContent = yelpDescription;
}


//Displaying the brewery (eventually brewer*ies*) to the user via the output container
function displayBreweries(breweries) {
  breweries.forEach(function(    /* brewery.whatever from the API call - Consult docs. */   ) { 
    var breweryName = //name of brewery;
    var breweryType = //type of brewery;
    var breweryAddress =  //brewery address;
    var userDescription = //brewery description;

    // Assigning values to the Id's on the homepage's output card
    document.getElementById('breweryName').textContent = breweryName;
    document.getElementById('breweryType').textContent = breweryType;
    document.getElementById('brewAddress').textContent = breweryAddress;
    document.getElementById('userDescription').textContent = userDescription;
    document.getElementById('rating').textContent = rating;
  });
}

// Added event listener for the "Beer Me! Button on the home search page."
var searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', searchBreweries);
