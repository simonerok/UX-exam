'use strict';
 
/**************************** LOAD CLICKED MEAL RECIPE **************************/
async function loadMealById(id) {
    // Fetch the meal data
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    const meal = data.meals[0];
 
    // Get the template and clone it
    const template = document.querySelector('#template_recipe');
    const clone = template.content.cloneNode(true);
 
    // Get the elements in the cloned template
    const title = clone.querySelector('.title');
    const img = clone.querySelector('.img');
    const category = clone.querySelector('.category');
    const cuisine = clone.querySelector('.cuisine');
    const steps = clone.querySelector('.steps');
 
    // Set the properties of the elements
    title.textContent = meal.strMeal;
    img.src = meal.strMealThumb;
    img.alt = meal.strMeal;
    category.textContent = "Category: " + meal.strCategory;
    cuisine.textContent = "Cuisine: " + meal.strArea;
 
    // Split the instructions into steps and add each step as a list item
    const instructions = meal.strInstructions.split('.'); // Split by period
    instructions.forEach(instruction => {
        if (instruction.trim() !== '') { // Ignore empty strings
            const li = document.createElement('li');
            li.textContent = instruction;
            steps.appendChild(li);
        }
    });
 
    // Append the cloned template to the meal details section
    const mealDetails = document.querySelector('#meal-details');
    mealDetails.appendChild(clone);
}
 
// Get the meal ID from the URL and call the loadMealById function when the page is loaded
document.addEventListener('DOMContentLoaded', (event) => {
    const urlParams = new URLSearchParams(window.location.search);
    const mealId = urlParams.get('id');
    loadMealById(mealId);
});