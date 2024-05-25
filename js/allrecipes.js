'use strict';

const BASE_URL2 = "https://www.themealdb.com/api/json/v1/1/";
 
async function fetchData(url) {
    try {
        const response = await fetch(BASE_URL2 + url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}
 
async function fetchCategories() {
    const data = await fetchData('categories.php');
    const categories = data.categories;
    if (categories) {
        populateCategories(categories);
    }
}
 
function populateCategories(categories) {
    const container = document.getElementById('categories-container');
    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
 
        const categoryImg = document.createElement('img');
        categoryImg.src = category.strCategoryThumb;
        categoryImg.alt = category.strCategory;
 
        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = category.strCategory;
 
        categoryCard.appendChild(categoryImg);
        categoryCard.appendChild(categoryTitle);
        container.appendChild(categoryCard);
 
        // Add click event listener to redirect to recipe.html
        categoryCard.addEventListener('click', () => {
            window.location.href = `meals.html?category=${category.strCategory}`;
        });
    });
}
 
// Fetch and display categories when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', fetchCategories);
 
 
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
 