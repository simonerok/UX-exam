'use strict';

/****************************************  FETCH DATA FROM API TO BROWSE BY CATEGORY CARDS ************************************************/

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

// Use Promise.all to fetch all the meals using more API calls
Promise.all(promises)
    .then(meals => {
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
            const categoryIcon = cardClone.querySelector('.card_category_icon span'); 

            cardImg.src = meal.strMealThumb;
            cardTitle.textContent = meal.strMeal;
            cardCategory.textContent = meal.strCategory;
            cardArea.textContent = "Cuisine: " + meal.strArea;
            youtubeLink.href = meal.strYoutube;
            youtubeLink.textContent = 'Watch on YouTube';
            categoryIcon.textContent = meal.strCategory.charAt(0); // First letter of the category

            mealContainer.appendChild(cardClone);
        });
    })
    .catch(error => console.error('Error:', error));




/****************************************  FILTER FUNCTIONALITY (filter by category) ************************************************/

const select = document.querySelector('#filter_btn');
const template = document.querySelector('#template_card');
const container = document.querySelector('#meal_container');

/* fetch data based on the selected "category" in the filter button */
select.addEventListener('change', async function() {
    const category = select.value;

    // Fetch data from the API by category
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    const data = await response.json();

    // Clear the html to be able to place new data
    container.innerHTML = '';

    // Create a new card for each meal
    const mealPromises = data.meals.map(async meal => {
        // Fetch additional data for the meal
        const mealResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
        const mealData = await mealResponse.json();
        const detailedMeal = mealData.meals[0];

        // Clone the template
        const clone = template.content.cloneNode(true);

        // Populate the clone with data
        clone.querySelector('.card_img').src = detailedMeal.strMealThumb;
        clone.querySelector('.card_title').textContent = detailedMeal.strMeal;
        clone.querySelector('.card_category').textContent = category;
        clone.querySelector('.card_category_icon span').textContent = category.charAt(0);

        // Select cardArea and youtubeLink within the clone
        const cardArea = clone.querySelector('.card_area');
        const youtubeLink = clone.querySelector('.card_youtube');

        if (cardArea) {
            cardArea.textContent = "Cuisine: " + detailedMeal.strArea;
        }

        if (youtubeLink) {
            if (detailedMeal.strYoutube) {
                youtubeLink.href = detailedMeal.strYoutube;
                youtubeLink.textContent = 'Watch on YouTube';
            } else {
                youtubeLink.textContent = 'No YouTube guide available';
            }
        }

        // Append the clone to the container
        container.appendChild(clone);
    });

    // Wait for all meals to be fetched and cards to be created to get all the information
    await Promise.all(mealPromises);
});

 /****************************************  SEARCH BAR FUNCTIONALITY (fetching a meal by name lamb etc) ************************************************/
// Select the search input and button from the DOM
const searchInput = document.querySelector('#search_input');
const searchButton = document.querySelector('#search_button');

// Select the section where the meals will be displayed
const section = document.querySelector('#meal_of_the_day_container');

// Select the card template
const cardContainer = document.querySelector('#section_1_card');

// Select the h2 element
const heading = document.querySelector('#meal_of_th_day');

// Add an event listener to the search button
searchButton.addEventListener('click', async function(e) {
  // Prevent the form from submitting
  e.preventDefault();

  // Get the value of the search input
  const searchTerm = searchInput.value;

  // Fetch the meals from the API
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
  const data = await response.json();

  // Check if any meals were found
  if (data.meals === null) {
    section.textContent = 'No meals found. try to seach for a name of the meal or a meal ingredient.';
    return;
  }

  // Clear the previous search results
  section.innerHTML = '';

  // Change the text of the h2 element
  heading.textContent = 'Meals you can try:';

  // Create a card for each meal
  data.meals.slice(0, 6).forEach(meal => {
    // Clone the card template
    const card = cardContainer.content.cloneNode(true);

    // Get the elements in the card
    const img = card.querySelector('.card_img');
    const title = card.querySelector('.card_title');
    const description = card.querySelector('.card_description');
    const categoryIcon = card.querySelector('.card_category_icon span');
    const category = card.querySelector('.card_category');

    // Set the properties of the elements
    img.src = meal.strMealThumb;
    img.alt = meal.strMeal;
    title.textContent = meal.strMeal;
    description.textContent = meal.strInstructions;
    categoryIcon.textContent = meal.strCategory.charAt(0); // First letter of the category
    category.textContent = meal.strCategory;

    // Append the card to the section
    section.appendChild(card);
  });
});

/****************************************  FETCH RANDOM MEAL FOR MEAL OF THE DAY CARD ************************************************/
/* select the html element and ensure taht the con tainer can be cloned multiple times  */
const cardTemplate = document.querySelector('#section_1_card').content.cloneNode(true);

async function mealOfTheDay() {
  // Fetch a random meal
  const meal = await fetchRandomMeal();
  console.log(meal); // Log the meal to the console

  // Clone the card template
  const card = cardTemplate.cloneNode(true);

  // Get the elements in the card
  const img = card.querySelector('.card_img');
  const title = card.querySelector('.card_title');
  const description = card.querySelector('.card_description');
  const favIcon = card.querySelector('.btn_fav img');
  const categoryIcon = card.querySelector('.card_category_icon');
  const category = card.querySelector('.card_category');

  // Set the properties of the elements
  img.src = meal.strMealThumb;
  img.alt = meal.strMeal;
  title.textContent = meal.strMeal;
  description.textContent = meal.strInstructions;
  favIcon.src = '../heart-no-fill.svg';
  favIcon.alt = 'favorite Icon';
  categoryIcon.textContent = meal.strCategory.charAt(0); // First letter of the category
  category.textContent = meal.strCategory;

  // Append the card to the meal of the day container
  const mealOfTheDayContainer = document.querySelector('#meal_of_the_day_container');
  console.log(mealOfTheDayContainer); // Log the container to the console
  mealOfTheDayContainer.appendChild(card);
}

// Call the function
mealOfTheDay();

 
