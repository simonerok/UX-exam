'use strict';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';
const favouritesSection = document.getElementById('favourites');

// Fetch favorite recipes from sessionStorage and display them
async function fetchFavouriteRecipes() {
    const favourites = JSON.parse(sessionStorage.getItem('favourites')) || [];
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
    if (recipes && recipes.length > 0) {
        recipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');
            recipeCard.innerHTML = `
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <h3>${recipe.strMeal}</h3>
                <i class="fas fa-heart" data-id="${recipe.idMeal}"></i> <!-- Ensure this class is 'fas' to show as filled heart -->
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
    const hearts = document.querySelectorAll('.fa-heart');
    hearts.forEach(heart => {
        heart.addEventListener('click', () => {
            const recipeId = heart.getAttribute('data-id');
            toggleFavourite(recipeId, heart);
            // Remove the recipe card if it's unfavorited
            if (!heart.classList.contains('fas')) {
                heart.parentElement.remove();
                if (favouritesSection.childElementCount === 0) {
                    favouritesSection.innerHTML = '<p>No favourite recipes found.</p>';
                }
            }
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

// Initial fetch of favourite recipes
fetchFavouriteRecipes();
