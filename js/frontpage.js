'use strict';

import { getUserFavorites, toggleUserFavorite } from './utility.js';

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
        const mealContainer = document.querySelector('#meal_container');
        const templateCard = document.querySelector('#template_card');

        if (!mealContainer || !templateCard) {
            console.error('meal_container or template_card not found');
            return;
        }

        meals.forEach(meal => {
            const cardClone = templateCard.content.cloneNode(true);

            const cardImg = cardClone.querySelector('.card_img');
            const cardTitle = cardClone.querySelector('.card_title');
            const cardCategory = cardClone.querySelector('.card_category');
            const cardArea = cardClone.querySelector('.card_area');
            const youtubeLink = cardClone.querySelector('.card_youtube');
            const categoryIcon = cardClone.querySelector('.card_category_icon span');
            const favIcon = cardClone.querySelector('.btn_fav');

            if (!cardImg || !cardTitle || !cardCategory || !cardArea || !youtubeLink || !categoryIcon || !favIcon) {
                console.error('One or more elements not found in the cloned template card');
                return;
            }

            cardImg.src = meal.strMealThumb;
            cardTitle.textContent = meal.strMeal;
            cardCategory.textContent = meal.strCategory;
            cardArea.textContent = "Cuisine: " + meal.strArea;
            youtubeLink.href = meal.strYoutube;
            youtubeLink.textContent = 'Watch on YouTube';
            categoryIcon.textContent = meal.strCategory.charAt(0); // First letter of the category
            favIcon.setAttribute('data-id', meal.idMeal);

            const favourites = getUserFavorites();
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
const searchInput = document.querySelector('#search_input');
const searchButton = document.querySelector('#search_button');

const section = document.querySelector('#meal_of_the_day_container');
const cardContainer = document.querySelector('#section_1_card');
const heading = document.querySelector('#meal_of_th_day');

searchButton.addEventListener('click', async function (e) {
    e.preventDefault();
    const searchTerm = searchInput.value;
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
    const data = await response.json();

    if (data.meals === null) {
        section.textContent = 'No meals found. Try to search for a name of the meal or a meal ingredient.';
        return;
    }

    section.innerHTML = '';
    heading.textContent = 'Meals you can try:';

    data.meals.slice(0, 6).forEach(meal => {
        const card = cardContainer.content.cloneNode(true);

        const img = card.querySelector('.card_img');
        const title = card.querySelector('.card_title');
        const description = card.querySelector('.card_description');
        const categoryIcon = card.querySelector('.card_category_icon span');
        const category = card.querySelector('.card_category');
        const favIcon = card.querySelector('.btn_fav i');

        if (!img || !title || !description || !categoryIcon || !category || !favIcon) {
            console.error('One or more elements not found in the cloned search card template');
            return;
        }

        img.src = meal.strMealThumb;
        img.alt = meal.strMeal;
        title.textContent = meal.strMeal;
        description.textContent = meal.strInstructions;
        categoryIcon.textContent = meal.strCategory.charAt(0);
        category.textContent = meal.strCategory;
        favIcon.setAttribute('data-id', meal.idMeal);

        const favourites = getUserFavorites();
        if (favourites.includes(meal.idMeal)) {
            favIcon.classList.add('fas');
            favIcon.classList.remove('far');
        } else {
            favIcon.classList.add('far');
            favIcon.classList.remove('fas');
        }
        
        // Get the image in the cloned template
        const card_img = card.querySelector('.card_img');
        
        // If img exists, add an event listener and send the id with
        if (card_img) {
            card_img.addEventListener('click', function() {
                console.log("clicked", meal.idMeal);
                window.location.href = `recipe.html?id=${meal.idMeal}`;
            });
        }
            section.appendChild(card);
        });
    addFavouriteListeners();
});

/****************************************  FETCH RANDOM MEAL FOR MEAL OF THE DAY CARD ************************************************/

async function mealOfTheDay() {
    const meal = await fetchRandomMeal();

    const cardTemplate = document.querySelector('#section_1_card');
    if (!cardTemplate) {
        console.error('section_1_card template not found');
        return;
    }
    const card = cardTemplate.content.cloneNode(true);
    
    const img = card.querySelector('.card_img');
    const title = card.querySelector('.card_title');
    const description = card.querySelector('.card_description');
    const favIcon = card.querySelector('.btn_fav i');
    const categoryIcon = card.querySelector('.card_category_icon span');
    const category = card.querySelector('.card_category');
    
    if (!img || !title || !description || !favIcon || !categoryIcon || !category) {
        console.error('One or more elements not found in the cloned card template');
        return;
    }
    
    img.src = meal.strMealThumb;
    img.alt = meal.strMeal;
    title.textContent = meal.strMeal;
    description.textContent = meal.strInstructions;
    favIcon.setAttribute('data-id', meal.idMeal);
    categoryIcon.textContent = meal.strCategory.charAt(0);
    category.textContent = meal.strCategory;
    
    const favourites = getUserFavorites();
    if (favourites.includes(meal.idMeal)) {
        favIcon.classList.add('fas');
        favIcon.classList.remove('far');
    } else {
        favIcon.classList.add('far');
        favIcon.classList.remove('fas');
    }

    const mealOfTheDayContainer = document.querySelector('#meal_of_the_day_container');
    if (!mealOfTheDayContainer) {
        console.error('meal_of_the_day_container not found');
        return;
    }

    // Get the image in the cloned template
    const card_img = card.querySelector('.card_img');
    
    // If img exists, add an event listener and send the id with
    if (card_img) {
        card_img.addEventListener('click', function() {
            console.log("clicked", meal.idMeal);
            window.location.href = `recipe.html?id=${meal.idMeal}`;
        });
    }
    
    addFavouriteListeners();
    mealOfTheDayContainer.appendChild(card);
}

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
        const cardCategoryIcon = cardClone.querySelector('.card_category_icon span');
        const cardTitle = cardClone.querySelector('.card_title');
        const cardArea = cardClone.querySelector('.card_area');
        const favIcon = cardClone.querySelector('.btn_fav i');


        if (!cardImg) console.error('cardImg not found');
        if (!cardCategory) console.error('cardCategory not found');
        if (!cardCategoryIcon) console.error('cardCategoryIcon not found');
        if (!cardTitle) console.error('cardTitle not found');
        if (!cardArea) console.error('cardArea not found');
        if (!favIcon) console.error('favIcon not found');

        if (!cardImg || !cardCategory || !cardCategoryIcon || !cardTitle || !cardArea || !favIcon) {
            console.error('One or more elements not found in the cloned carousel card template');
        }

        
        cardImg.src = carouselMeals[dataIndex].strMealThumb;
        cardTitle.textContent = carouselMeals[dataIndex].strMeal;
        cardCategory.textContent = carouselMeals[dataIndex].strCategory;
        cardArea.textContent = `Cuisine: ${carouselMeals[dataIndex].strArea}`;
        cardCategoryIcon.textContent = carouselMeals[dataIndex].strCategory.charAt(0);
        favIcon.setAttribute('data-id', carouselMeals[dataIndex].idMeal);
        const favourites = getUserFavorites();
        if (favourites.includes(carouselMeals[dataIndex].idMeal)) {
            favIcon.classList.add('fas');
            favIcon.classList.remove('far');
        } else {
            favIcon.classList.add('far');
            favIcon.classList.remove('fas');
        }

        // Get the image in the cloned template
        const image_carousel_card = cardClone.querySelector('.carousel_card_img');
        
        // If cardImg exists, add an event listener and send the id with
        if (image_carousel_card) {
            image_carousel_card.addEventListener('click', function() {
                console.log("clicked", carouselMeals[dataIndex].idMeal);
                window.location.href = `recipe.html?id=${carouselMeals[dataIndex].idMeal}`;
            });
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

function addFavouriteListeners() {
    const hearts = document.querySelectorAll('.btn_fav i');
    hearts.forEach(heart => {
        heart.addEventListener('click', () => {
            const recipeId = heart.getAttribute('data-id');
            toggleUserFavorite(recipeId, heart);
        });
    });
}
