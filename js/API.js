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


/****************************************  SOFIA KODE ************************************************/

const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";

async function fetchData(url) {
    try {
        const response = await fetch(BASE_URL + url);
        const data = await response.json();
        return data.meals;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchRandomMeal() {
    const meals = await fetchData('random.php');
    return meals[0];  // Return the first meal found in the array
}

async function fetchMealFrontpage() {
    try {
        const meal = await fetchRandomMeal();
        console.log("test");  
        return meal;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Create an array of promises in order to laod 6 meals
const promises = Array.from({length: 6}, () => fetchMealFrontpage());

// Use Promise.all to fetch all the meals concurrently
Promise.all(promises)
    .then(meals => {
      console.log("test2"); 
        // Get the template and the meal container
        const mealContainer = document.querySelector('#meal_container');
        const templateCard = document.querySelector('#template_card');

        // For each meal
        meals.forEach(meal => {
            const cardClone = templateCard.content.cloneNode(true);

            const cardImg = cardClone.querySelector('.card_img');
            const cardTitle = cardClone.querySelector('.card_title');
            const cardCategory = cardClone.querySelector('.card_category');
            const cardArea = cardClone.querySelector('.card_area');
            const youtubeLink = cardClone.querySelector('.card_youtube');

            cardImg.src = meal.strMealThumb;
            cardTitle.textContent = meal.strMeal;
            cardCategory.textContent = meal.strCategory;
            cardArea.textContent = "Cuisine: " + meal.strArea;
            youtubeLink.href = meal.strYoutube;
            youtubeLink.textContent = 'Watch on YouTube';

            mealContainer.appendChild(cardClone);
        });
    })
    .catch(error => console.error('Error:', error));




// SEARCH BAR FUNCTIONALITY (fetching a meal by name lamb etc)
const searchButton = document.querySelector('.search_box');
const searchInput = document.querySelector('input');

searchButton.addEventListener('click', async function() {
  const searchTerm = searchInput.value;
  let meals = await fetchData(`search.php?s=${searchTerm}`);

  // If no meals were found by name, try searching by ingredient
  if (!meals) {
    meals = await fetchData(`filter.php?i=${searchTerm}`);
  }

  // Select the error container and clear it
  const errorContainer = document.querySelector('.error_container');
  errorContainer.innerHTML = '';

  // If no meals were found, display an error message
  if (!meals) {
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'Sorry, no meals found. Try to search by an ingredient or the title of the meal you wish to see!';
    errorMessage.style.color = 'red';
    errorContainer.appendChild(errorMessage);
    return;
  }

  // Extract the data into the UI card
  const meal = meals[0];
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
});


