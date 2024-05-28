'use strict';
 
const BASE_URL2 = "https://www.themealdb.com/api/json/v1/1/";
 
 
async function fetchData(url) {
    try {
        const response = await fetch(BASE_URL2 + url);
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
/****************************************  GET ALL RECIPES ************************************************/
async function fetchAllRecipes(start, numMeals) {
    const allRecipesContainer = document.querySelector('#all_recipes_container');
   
    for (let i = start; i < start + numMeals; i++) {
        // Fetch a random meal
        const meal = await fetchRandomMeal();
        console.log(meal); // Log the meal to the console
 
        // Clone the card template
        const cardTemplate = document.querySelector('#section_1_card').content;
        const card = cardTemplate.cloneNode(true);
 
        // Get the elements in the card
        const img = card.querySelector('.card_img');
        const title = card.querySelector('.card_title');
        const description = card.querySelector('.card_description');
        const favIcon = card.querySelector('.btn_fav img');
        const categoryIcon = card.querySelector('.card_category_icon span');
        const category = card.querySelector('.card_category');
 
        // Set the properties of the elements
        img.src = meal.strMealThumb;
        img.alt = meal.strMeal;
        title.textContent = meal.strMeal;
        description.textContent = meal.strInstructions;
        favIcon.src = '../heart-no-fill.svg';
        favIcon.alt = 'favorite Icon';
        categoryIcon.textContent = meal.strCategory.charAt(0); // First letter of the category
        category.textContent = meal.strCategory;
 
        // Get the card container in the cloned template
        const cardContainer = card.querySelector('.card_container');
 
        // Add an event listener and send the id with
        cardContainer.addEventListener('click', function() {
            console.log("clicked", meal.idMeal);
            window.location.href = `recipe.html?id=${meal.idMeal}`;
            loadMealById(meal.idMeal);
        });
 
        // Append the card to the all recipes container
        allRecipesContainer.appendChild(card);
        console.log("fetching all recipes")
    }
}
/********************* LOAD MORE MEALS BUTTON ALL RECIPES ****************/
let numMealsLoaded = 6; // Start with 6 meals
 
// Fetch and display the initial meals
fetchAllRecipes(0, numMealsLoaded);
 
// Get the load more button
const loadMoreBtn = document.querySelector('.more_btn');
 
// Add an event listener to the button
loadMoreBtn.addEventListener('click', function() {
    fetchAllRecipes(numMealsLoaded, 2); // Fetch and display 2 new meals
    numMealsLoaded += 2; // Increase the number of meals by 2 each time u click the button
});
 
 
/****************************************  FILTER FUNCTIONALITY (filter by category) ************************************************/
 
 
    const select = document.querySelector('#filter_btn');
    const template = document.querySelector('#section_1_card');
    const container = document.querySelector('#meal_container');
    const moreBtn = document.querySelector('#more_btn_category');
 
    let mealsLoaded = 0; // Start with 0 meals
 
    // Set the default selected option to "Beef"
    select.value = 'Beef';
 
    // Function to fetch and display meals
    async function fetchMealsByCategory(category, start, count) {
        console.log(`Fetching ${count} meals of category ${category} starting from ${start}`);
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        const data = await response.json();
        /* clear the container if the start is 0 to be able to put fetched data in there */
        if (start === 0) {
            container.innerHTML = '';
        }
        /* turns a copy of meals array into a new array object  */
        const meals = data.meals.slice(start, start + count);
 
        const mealPromises = meals.map(async meal => {
            const mealResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
            const mealData = await mealResponse.json();
            const detailedMeal = mealData.meals[0];
            const clone = template.content.cloneNode(true);
 
            clone.querySelector('.card_img').src = detailedMeal.strMealThumb;
            clone.querySelector('.card_title').textContent = detailedMeal.strMeal;
            clone.querySelector('.card_category').textContent = category;
            clone.querySelector('.card_category_icon span').textContent = category.charAt(0);
            const cardArea = clone.querySelector('.card_cuisine');
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
                    youtubeLink.style.color = 'red';
                    youtubeLink.style.fontStyle = 'italic';
                }
            }
 
const mealCard = clone.querySelector('.card_container');
        mealCard.addEventListener('click', function() {
        console.log("clicked", meal.idMeal);
        window.location.href = `recipe.html?id=${meal.idMeal}`;
    });
 
        return clone;  
    });
 
        const clones = await Promise.all(mealPromises);
        clones.forEach(clone => container.appendChild(clone));
        mealsLoaded += count;
    }
 
    // Fetch and display the initial meals
    fetchMealsByCategory('Beef', 0, 6);
 
    // Add an event listener to the load more button
    moreBtn.addEventListener('click', function() {
    console.log("Load more button clicked");
    fetchMealsByCategory(select.value, mealsLoaded, 2);
});
 
    select.addEventListener('change', function() {
        numMealsLoaded = 0; // Reset the number of meals loaded
        fetchMealsByCategory(select.value, 0, 6); // Fetch and display the initial meals
    });
 