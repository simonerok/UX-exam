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
        return meal;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Create an array of promises in order to load 6 meals
const promises = Array.from({ length: 6 }, () => fetchMealFrontpage());

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
            const favIcon = cardClone.querySelector('.btn_fav i');

            cardImg.src = meal.strMealThumb;
            cardTitle.textContent = meal.strMeal;
            cardCategory.textContent = meal.strCategory;
            cardArea.textContent = "Cuisine: " + meal.strArea;
            youtubeLink.href = meal.strYoutube;
            youtubeLink.textContent = 'Watch on YouTube';
            categoryIcon.textContent = meal.strCategory.charAt(0); // First letter of the category
            favIcon.setAttribute('data-id', meal.idMeal);

            // Set favorite icon based on sessionStorage
            const favourites = JSON.parse(sessionStorage.getItem('favourites')) || [];
            if (favourites.includes(meal.idMeal)) {
                favIcon.classList.add('fas');
                favIcon.classList.remove('far');
            } else {
                favIcon.classList.add('far');
                favIcon.classList.remove('fas');
            }

            mealContainer.appendChild(cardClone);
        });
        addFavouriteListeners();
    })
    .catch(error => console.error('Error:', error));

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
searchButton.addEventListener('click', async function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get the value of the search input
    const searchTerm = searchInput.value;

    // Fetch the meals from the API
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
    const data = await response.json();

    // Check if any meals were found
    if (data.meals === null) {
        section.textContent = 'No meals found. Try to search for a name of the meal or a meal ingredient.';
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
        const favIcon = card.querySelector('.btn_fav i');

        // Set the properties of the elements
        img.src = meal.strMealThumb;
        img.alt = meal.strMeal;
        title.textContent = meal.strMeal;
        description.textContent = meal.strInstructions;
        categoryIcon.textContent = meal.strCategory.charAt(0); // First letter of the category
        category.textContent = meal.strCategory;
        favIcon.setAttribute('data-id', meal.idMeal);

        // Set favorite icon based on sessionStorage
        const favourites = JSON.parse(sessionStorage.getItem('favourites')) || [];
        if (favourites.includes(meal.idMeal)) {
            favIcon.classList.add('fas');
            favIcon.classList.remove('far');
        } else {
            favIcon.classList.add('far');
            favIcon.classList.remove('fas');
        }

        // Append the card to the section
        section.appendChild(card);
    });
    addFavouriteListeners();
});

/****************************************  FETCH RANDOM MEAL FOR MEAL OF THE DAY CARD ************************************************/
/* select the html element and ensure that the container can be cloned multiple times */
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
    const favIcon = card.querySelector('.btn_fav i');
    const categoryIcon = card.querySelector('.card_category_icon');
    const category = card.querySelector('.card_category');

    // Set the properties of the elements
    img.src = meal.strMealThumb;
    img.alt = meal.strMeal;
    title.textContent = meal.strMeal;
    description.textContent = meal.strInstructions;
    favIcon.setAttribute('data-id', meal.idMeal);
    categoryIcon.textContent = meal.strCategory.charAt(0); // First letter of the category
    category.textContent = meal.strCategory;

    // Set favorite icon based on sessionStorage
    const favourites = JSON.parse(sessionStorage.getItem('favourites')) || [];
    if (favourites.includes(meal.idMeal)) {
        favIcon.classList.add('fas');
        favIcon.classList.remove('far');
    } else {
        favIcon.classList.add('far');
        favIcon.classList.remove('fas');
    }

    // Append the card to the meal of the day container
    const mealOfTheDayContainer = document.querySelector('#meal_of_the_day_container');
    mealOfTheDayContainer.appendChild(card);
    addFavouriteListeners();
}

// Call the function
mealOfTheDay();

/* ------------- CAROUSEL CODE ---------------- */
let carouselMeals = [];
const carouselTemplate = document.getElementById('carousel_card_template');
const destination = document.querySelector(".recipes_carousel");
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
let currentIndex = 0;

async function fetchMealCarousel() {
    try {
        const meal = await fetchRandomMeal();
        carouselMeals.push(meal);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Create an array of promises to load 8 meals for the carousel
const mypromises = Array.from({ length: 8 }, () => fetchMealCarousel());

Promise.all(mypromises)
    .then(() => {
        updateCards();
    });

function updateCards() {
    destination.innerHTML = '';
    const amountOfCards = responsiveCardAmount();

    for (let i = currentIndex; i < currentIndex + amountOfCards; i++) {
        const dataIndex = i >= carouselMeals.length ? i - carouselMeals.length : i;

        const cardClone = carouselTemplate.content.cloneNode(true);
        const cardImg = cardClone.querySelector('.carousel_card_img');
        const cardCategory = cardClone.querySelector('.card_category');
        const cardCategoryIcon = cardClone.querySelector('.card_category_icon');
        const cardTitle = cardClone.querySelector('.card_title');
        const cardArea = cardClone.querySelector('.card_area');
        const favIcon = cardClone.querySelector('.btn_fav i');

        cardImg.src = carouselMeals[dataIndex].strMealThumb;
        cardTitle.textContent = carouselMeals[dataIndex].strMeal;
        cardCategory.textContent = carouselMeals[dataIndex].strCategory;
        cardArea.textContent = `Cuisine: ${carouselMeals[dataIndex].strArea}`;
        cardCategoryIcon.textContent = carouselMeals[dataIndex].strCategory.charAt(0);
        favIcon.setAttribute('data-id', carouselMeals[dataIndex].idMeal);

        // Set favorite icon based on sessionStorage
        const favourites = JSON.parse(sessionStorage.getItem('favourites')) || [];
        if (favourites.includes(carouselMeals[dataIndex].idMeal)) {
            favIcon.classList.add('fas');
            favIcon.classList.remove('far');
        } else {
            favIcon.classList.add('far');
            favIcon.classList.remove('fas');
        }

        destination.appendChild(cardClone);
    }
    addFavouriteListeners();
}

function responsiveCardAmount() {
    let amountOfCards;
    if (window.innerWidth >= 1440) {
        amountOfCards = 4;
    } else if (window.innerWidth >= 1024) {
        amountOfCards = 3;
    } else if (window.innerWidth >= 768) {
        amountOfCards = 2;
    } else {
        amountOfCards = 1;
    }
    return amountOfCards;
}

const bigLaptop = window.matchMedia("(min-width: 1440px)");
const laptop = window.matchMedia("(min-width: 1024px)");
const tablet = window.matchMedia("(min-width: 768px)");
const mobile = window.matchMedia("(max-width: 767px)");

bigLaptop.onchange = updateCards;
laptop.onchange = updateCards;
tablet.onchange = updateCards;
mobile.onchange = updateCards;

prevButton.addEventListener('click', previousCard);
nextButton.addEventListener('click', nextCard);

function previousCard() {
    const lastIndex = carouselMeals.length - 1;
    currentIndex = currentIndex <= 0 ? lastIndex : currentIndex - 1;
    updateCards();
}

function nextCard() {
    const lastIndex = carouselMeals.length - 1;
    currentIndex = currentIndex >= lastIndex ? 0 : currentIndex + 1;
    updateCards();
}

// Add event listeners to heart icons
function addFavouriteListeners() {
    const hearts = document.querySelectorAll('.btn_fav i');
    hearts.forEach(heart => {
        heart.addEventListener('click', () => {
            const recipeId = heart.getAttribute('data-id');
            toggleFavourite(recipeId, heart);
        });
    });
}

// Toggle favorite status and store in sessionStorage
function toggleFavourite(recipeId, heart) {
    let favourites = JSON.parse(sessionStorage.getItem('favourites')) || [];
    if (favourites.includes(recipeId)) {
        favourites = favourites.filter(id => id !== recipeId);
        heart.classList.remove('fas');
        heart.classList.add('far');
    } else {
        favourites.push(recipeId);
        heart.classList.remove('far');
        heart.classList.add('fas');
    }
    sessionStorage.setItem('favourites', JSON.stringify(favourites));
}
