
'use strict';

const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";
// Function to get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
async function fetchData(url) {
    try {
        const response = await fetch(BASE_URL + url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}
 
 
async function fetchMealsByCategory(category) {
    const data = await fetchData(`filter.php?c=${category}`);
    const meals = data.meals;
    if (meals) {
        displayMeals(meals, category);
    }
}
function displayMeals(meals, category) {
    const container = document.getElementById('meals-container');
    container.innerHTML = ''; // Clear previous meals
    const categoryTitle = document.createElement('h2');
    categoryTitle.textContent = `Meals in ${category} Category`;
    container.appendChild(categoryTitle);
    const mealsGrid = document.createElement('div');
    mealsGrid.className = 'meals-grid';
    meals.forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.className = 'meal-card';
        const mealImg = document.createElement('img');
        mealImg.src = meal.strMealThumb;
        mealImg.alt = meal.strMeal;
        const mealTitle = document.createElement('h3');
        mealTitle.textContent = meal.strMeal;
        mealCard.appendChild(mealImg);
        mealCard.appendChild(mealTitle);
        mealsGrid.appendChild(mealCard);
        // Add click event to redirect to meal.html
        mealCard.addEventListener('click', () => {
            window.location.href = `recipe.html?mealId=${meal.idMeal}`;
        });
    });
    container.appendChild(mealsGrid);
 
    
}
 
 
 
// Get category from URL and fetch meals
document.addEventListener('DOMContentLoaded', () => {
    const category = getUrlParameter('category');
    if (category) {
        fetchMealsByCategory(category);
    }
});
 