'use strict';
 const API_KEY = "1";


// Search meal by name
const SEARCH_MEAL_BY_NAME_URL = "search.php?s=Arrabiata";

// List all meals by first letter
const LIST_ALL_MEALS_BY_FIRST_LETTER = "search.php?f=a";

// Lookup full meal details by id
const LOOKUP_FULL_MEAIL_DETAILS_BY_ID = "lookup.php?i=52772";

// Lookup a single random meal
const LOOKUP_SINGLE_RANDOM_MEAIL = "random.php";

// List all meal categories
const LIST_ALL_MEAL_CATEGORIES = "categories.php";

// List all Categories, Area, Ingredients
const LIST_ALL_CATEGORIES_AREA_INGREDIENTS = "list.php?c=list";

// Filter by main ingredient
const FILTER_BY_MAIN_INGREDIENT = "filter.php?i=chicken_breast";

// Filter by Category
const FILTER_BY_CATEGORY = "filter.php?c=Seafood";

// Filter by Area
const FILTER_BY_AREA= "filter.php?a=Canadian";





async function testApi(params) {
    try {
      const response = await fetch("https://www.themealdb.com/api/json/v1/1/" + params);
      if (response.ok) {
        const data = await response.json();

        console.log(data.meals);
        console.log('API Response:', data);
      } else {
        console.error('API request failed with status:', response.status);
      }
    } catch (error) {
      console.error('API request failed with error:', error);
    }
  }

  testApi(FILTER_BY_AREA);




// FETCH DATA TO THE UI CARDS FRONTPAGE (fetching a random meal)

fetch('https://www.themealdb.com/api/json/v1/1/random.php')
  .then(response => response.json())
  .then(data => {
    // the needed data for title, img and description
    const meal = data.meals[0];
    const mealName = meal.strMeal;
    const mealDescription = meal.strInstructions;
    const mealImage = meal.strMealThumb;

    // Select the UI card elements
    const cardImg = document.querySelector('.card_img');
    const cardTitle = document.querySelector('.card_title');
    const cardDescription = document.querySelector('.card_description');

    // replacing the hardcoded values with the fetched data
    cardImg.src = mealImage;
    cardTitle.textContent = mealName;
    cardDescription.textContent = mealDescription;
  })
  .catch(error => console.error('Error:', error));



//  SEARCH BAR FUNCTIONALITY (fetching a meal by name lamb etc)
const searchButton = document.querySelector('.search_box');
const searchInput = document.querySelector('input');


searchButton.addEventListener('click', function() {
  // Get the value of the input field
  const searchTerm = searchInput.value;

  // Make a request to the API
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
    .then(response => response.json())
    .then(data => {

  // Check if any meals were found
      if (data.meals === null) {
        // Create a new paragraph element
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Sorry, no meals found, try to search by an ingredient or the title of the meal you wish to see!';
        errorMessage.style.color = 'red';

        // Select the error container from the html
        const errorContainer = document.querySelector('.error_container');

        searchInput.addEventListener('blur', function() {
        // Select the error container
        const errorContainer = document.querySelector('.error_container');

        // Remove the error message
        errorContainer.innerHTML = '';

        // Clear the input field
          searchInput.value = '';
          });

        // Add the error message to the container
        errorContainer.appendChild(errorMessage);
        return;
      }

      // Extract the data
      const meal = data.meals[0];
      const mealName = meal.strMeal;
      const mealDescription = meal.strInstructions;
      const mealImage = meal.strMealThumb;

      // Select the elements
      const cardImg = document.querySelector('.card_img');
      const cardTitle = document.querySelector('.card_title');
      const cardDescription = document.querySelector('.card_description');

      // Replace the hardcoded values
      cardImg.src = mealImage;
      cardTitle.textContent = mealName;
      cardDescription.textContent = mealDescription;
      
    })
    .catch(error => console.error('Error:', error));
});


