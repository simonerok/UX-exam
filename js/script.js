'use strict';



//logged user and logoout
const logout_btn = document.getElementById('logout');
//stores true/false whether a user is logged in
let isLoggedIn;

//gets the email of the logged in user from session storage
function getLoggedUser() {
    console.log("login test");
    let loggedUser = sessionStorage.getItem("userLogged");

    return loggedUser;
}

//returns true or false whether an user is logged in
function isLogged() {
    const loggedUser = getLoggedUser();

    if (loggedUser) {
        isLoggedIn = true;
        console.log(loggedUser + " is logged in");
        toggleLogoutButton()
    } else {
        isLoggedIn = false;
        console.log("no user is logged in");
    }
    return isLoggedIn;
}

//removes the email from session storage, and sets islogged to false
function logout() {
    console.log("logout");
    isLoggedIn = false;
    sessionStorage.removeItem("userLogged");
    toggleLogoutButton()
}



function toggleLogoutButton(){
    console.log("test");
    
if (isLoggedIn) {
    logout_btn.classList.remove("hidden");
    logout_btn.addEventListener("click", logout);
} else if (!isLoggedIn) {
    logout_btn.classList.add("hidden");
}
}

getLoggedUser();
isLogged();
toggleLogoutButton();

//Header//
// Lav variablen "btn", der henviser til ".toggle-btn"
const btn = document.querySelector(".toggle-btn");
// Lav variablen "menu", der henviser til ".main-menu"
const menu = document.querySelector(".main-menu");

// Lav funktionen "toggleMenu()" med følgende funktionalitet
function toggleMenu() {
    // a) toggle klassen "shown" på menu vha. classList.toggle
    menu.classList.toggle("shown");

    // b) lav variablen "menuShown", som siger, at menu-variablen indeholder klassen "shown" via classList.contains("")
    const menuShown = menu.classList.contains("shown");

    // c) spørg om "menuShown" i if-sætningen nedenfor (=> if (menuShown)), og udskift teksten
    if (menuShown) {
        console.log(menuShown); // se i konsollen
        // sæt btn.textContent til "Luk", hvis menuShown er "true"
        btn.textContent = "Luk";
    } else {
        console.log(menuShown); // se i konsollen
        // sæt btn.textContent til "Menu", hvis menuShown er "false"
        btn.textContent = "Menu";
    }
}
// "toggleMenu()" slutter her

// Tilføj et klik-event til "btn", der sætter toggleMenu-funktionen i gang
btn.addEventListener("click", toggleMenu);






// HANDLE THE FAVOURITES SCRIPT
const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';
const recipesSection = document.getElementById('recipes');
const ingredientSelect = document.getElementById('ingredient-select');

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

// Run this to ensure the hearts reflect the correct state
initializeFavourites();


