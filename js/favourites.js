'use strict';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';
const favouritesSection = document.getElementById('favourites');

// Fetch favorite recipes from localStorage and display them
async function fetchFavouriteRecipes() {
    const userData = sessionStorage.getItem("userLogged");
    const favourites = JSON.parse(localStorage.getItem(userData+'_favorites')) || [];
    if (favourites.length === 0) {
        favouritesSection.innerHTML = '<p>No favourite recipes found.</p>';
        return;
    }

    const favouriteRecipes = [];
    for (const recipeId of favourites) {
        const response = await fetch(API_BASE_URL + 'lookup.php?i=' + recipeId);
        const data = await response.json();
        favouriteRecipes.push(data.meals[0]);
    }
    displayRecipes(favouriteRecipes);
}

// Display recipes in the favourites section
function displayRecipes(recipes) {
    favouritesSection.innerHTML = ''; // Clear previous results
    if (recipes && recipes.length > 0) {
        recipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');
            recipeCard.innerHTML = `
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <h3>${recipe.strMeal}</h3>
                <p>${recipe.strInstructions.substring(0, 100)}...</p>
                <button class="btn_fav">
                    <i class="fas fa-heart" data-id="${recipe.idMeal}"></i>
                </button>
            `;
            favouritesSection.appendChild(recipeCard);
        });
        addFavouriteListeners();
    } else {
        favouritesSection.innerHTML = '<p>No favourite recipes found.</p>';
    }
}

// Add event listeners to heart icons in the favourites section
function addFavouriteListeners() {
    const hearts = document.querySelectorAll('.btn_fav > i');
    hearts.forEach(heart => {
        heart.addEventListener('click', () => {
            const recipeId = heart.getAttribute('data-id');
            toggleFavourite(recipeId, heart);
            // Remove the recipe card if it's unfavorited
            if (!heart.classList.contains('fas')) {
                heart.parentElement.parentElement.remove();
                if (favouritesSection.childElementCount === 0) {
                    favouritesSection.innerHTML = '<p>No favourite recipes found.</p>';
                }
            }
        });
    });
}

// Toggle favorite status and store in localStorage
function toggleFavourite(recipeId, heart) {
    const userData1 = sessionStorage.getItem("userLogged");
    let favourites = JSON.parse(localStorage.getItem(userData1+'_favorites')) || [];
    if (favourites.includes(recipeId)) {
        favourites = favourites.filter(id => id !== recipeId);
        heart.classList.remove('fas');
        heart.classList.add('far');
    } else {
        favourites.push(recipeId);
        heart.classList.remove('far');
        heart.classList.add('fas');
    }
    const userData = sessionStorage.getItem("userLogged");
    localStorage.setItem(userData+'_favorites', JSON.stringify(favourites));
}

// Initial fetch of favourite recipes
fetchFavouriteRecipes();
