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
 
async function fetchAndDisplayMealDetails(mealId) {
    const data = await fetchData(`lookup.php?i=${mealId}`);
    const meal = data.meals[0];
    if (meal) {
        displayMealDetails(meal);
        updateBreadcrumbs(meal);
    }
}
 
function displayMealDetails(meal) {
    const template = document.querySelector('template');
    const section = document.querySelector('#meal-details');
    section.innerHTML = ''; // Clear previous content
 
    const clone = document.importNode(template.content, true);
 
    clone.querySelector('.title').textContent = meal.strMeal;
    clone.querySelector('.img').src = meal.strMealThumb;
    clone.querySelector('.category').textContent = `Category: ${meal.strCategory}`;
    clone.querySelector('.cuisine').textContent = `Area: ${meal.strArea}`;
 
    const steps = meal.strInstructions.split('\n').filter(step => step.trim() !== '');
    const stepsList = clone.querySelector('.steps');
    steps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        stepsList.appendChild(li);
    });
 
    section.appendChild(clone);
}
 
function updateBreadcrumbs(meal) {
    const breadcrumbs = document.getElementById('breadcrumbs');
    breadcrumbs.innerHTML = ''; // Clear previous breadcrumbs
 
    const homeLink = document.createElement('a');
    homeLink.href = 'allrecipes.html'; // Adjust the link to your home page
    homeLink.textContent = 'Meals';
    breadcrumbs.appendChild(homeLink);
 
    const separator1 = document.createTextNode(' > ');
    breadcrumbs.appendChild(separator1);
 
    const categoryLink = document.createElement('a');
    categoryLink.href = `meals.html?category=${meal.strCategory}`; // Link to category page
    categoryLink.textContent = meal.strCategory;
    breadcrumbs.appendChild(categoryLink);
 
    const separator2 = document.createTextNode(' > ');
    breadcrumbs.appendChild(separator2);
 
    const mealLink = document.createElement('span');
    mealLink.textContent = meal.strMeal;
    breadcrumbs.appendChild(mealLink);
}
 
// Get mealId from URL and fetch meal details
document.addEventListener('DOMContentLoaded', () => {
    const mealId = getUrlParameter('mealId');
    if (mealId) {
        fetchAndDisplayMealDetails(mealId);
    }
});
 
// Event listener for meal click
document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('meal-link')) {
        const mealId = event.target.dataset.mealId;
        await fetchAndDisplayMealDetails(mealId);
    }
});
 