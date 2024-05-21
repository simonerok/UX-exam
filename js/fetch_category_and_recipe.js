'use strict';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';
const recipesSection = document.getElementById('recipes');
const ingredientSelect = document.getElementById('ingredient-select');


// ******************************************************************************* BREAKFAST


// Custom list for the ingredient filter
const ingredients = ['Eggs', 'Oats', 'Berries', 'Bananas', 'Milk'];

// Populate the ingredient select dropdown
function populateSelect(selectElement, options) {
    selectElement.innerHTML = '<option value="">Select</option>';
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.toLowerCase().replace(' ', '_');
        optionElement.textContent = option;
        selectElement.appendChild(optionElement);
    });
}

// Populate the ingredient select dropdown with options
populateSelect(ingredientSelect, ingredients);

// Fetch and display breakfast recipes
async function fetchRecipes(ingredient = '') {
    recipesSection.innerHTML = '';  // Clear previous results
    try {
        const url = API_BASE_URL + 'filter.php?c=Breakfast';
        const response = await fetch(url);
        const data = await response.json();
        
        if (ingredient) {
            const filteredRecipes = await filterByIngredient(data.meals, ingredient);
            displayRecipes(filteredRecipes);
        } else {
            displayRecipes(data.meals);
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}

// Fetch and filter recipes by ingredient
async function filterByIngredient(recipes, ingredient) {
    const filteredRecipes = [];
    for (const recipe of recipes) {
        const response = await fetch(API_BASE_URL + 'lookup.php?i=' + recipe.idMeal);
        const data = await response.json();
        const meal = data.meals[0];
        const ingredientsList = getIngredientsList(meal);
        if (ingredientsList.some(ing => ing.includes(ingredient))) {
            filteredRecipes.push(meal);
        }
    }
    return filteredRecipes;
}

// Get ingredients list from a recipe
function getIngredientsList(meal) {
    const ingredientsList = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            ingredientsList.push(ingredient.toLowerCase());
        }
    }
    return ingredientsList;
}

// Display recipes in the recipes section
function displayRecipes(recipes) {
    if (recipes && recipes.length > 0) {
        recipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');
            recipeCard.innerHTML = `
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <h3>${recipe.strMeal}</h3>
                <i class="far fa-heart" data-id="${recipe.idMeal}"></i>
            `;
            recipesSection.appendChild(recipeCard);
        });
        addFavouriteListeners();
        initializeFavourites();
    } else {
        recipesSection.innerHTML = '<p>No recipes found.</p>';
    }
}

// Event listener for ingredient select change
ingredientSelect.addEventListener('change', (event) => {
    const selectedIngredient = event.target.value;
    fetchRecipes(selectedIngredient);
});

// Initial fetch of breakfast recipes
fetchRecipes();

// Add event listeners to heart icons
function addFavouriteListeners() {
    const hearts = document.querySelectorAll('.fa-heart');
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

// Initialize favorites from sessionStorage
function initializeFavourites() {
    const favourites = JSON.parse(sessionStorage.getItem('favourites')) || [];
    favourites.forEach(recipeId => {
        const heart = document.querySelector(`.fa-heart[data-id="${recipeId}"]`);
        if (heart) {
            heart.classList.remove('far');
            heart.classList.add('fas');
        }
    });
}





// ******************************************************************************* LUNCH
// ******************************************************************************* DINNER
// ******************************************************************************* DESSERT
