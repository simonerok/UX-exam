'use strict';
 
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
        console.log("test");  
        return meal;
    } catch (error) {
        console.error('Error:', error);
    }
}
 
// Create an array of promises in order to laod 6 meals
const promises = Array.from({length: 6}, () => fetchMealFrontpage());
 
// Use Promise.all to fetch all the meals using more API calls
Promise.all(promises)
    .then(meals => {
        // Get the template and the meal container
        const mealContainer = document.querySelector('#meal_container');
        const templateCard = document.querySelector('#template_card');
 
        // For each meal
        meals.forEach(meal => {
            const cardClone = templateCard.content.cloneNode(true);
 
            const cardImg = cardClone.querySelector('.card_img');
            const cardTitle = cardClone.querySelector('.card_title');
            const cardCategory = cardClone.querySelector('.card_category');
            const cardArea = cardClone.querySelector('.card_area');
            const youtubeLink = cardClone.querySelector('.card_youtube');
            const categoryIcon = cardClone.querySelector('.card_category_icon span');
 
            cardImg.src = meal.strMealThumb;
            cardTitle.textContent = meal.strMeal;
            cardCategory.textContent = meal.strCategory;
            cardArea.textContent = "Cuisine: " + meal.strArea;
            youtubeLink.href = meal.strYoutube;
            youtubeLink.textContent = 'Watch on YouTube';
            categoryIcon.textContent = meal.strCategory.charAt(0); // First letter of the category

       

            mealContainer.appendChild(cardClone);
        });
    })
    .catch(error => console.error('Error:', error));
 

 /****************************************  SEARCH BAR FUNCTIONALITY (fetching a meal by name lamb etc) ************************************************/
// Select the search input and button from the DOM
const searchInput = document.querySelector('#search_input');
const searchButton = document.querySelector('#search_button');
 
// Select the section where the meals will be displayed
const section = document.querySelector('#meal_of_the_day_container');
 
// Select the card template
const cardContainer = document.querySelector('#section_1_card');
 
// Select the h2 element
const heading = document.querySelector('#meal_of_th_day');
 
// Add an event listener to the search button
searchButton.addEventListener('click', async function(e) {
  // Prevent the form from submitting
  e.preventDefault();
 
  // Get the value of the search input
  const searchTerm = searchInput.value;
 
  // Fetch the meals from the API
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
  const data = await response.json();
 
  // Check if any meals were found
  if (data.meals === null) {
    section.textContent = 'No meals found. try to seach for a name of the meal or a meal ingredient.';
    return;
  }
 
  // Clear the previous search results
  section.innerHTML = '';
 
  // Change the text of the h2 element
  heading.textContent = 'Meals you can try:';
 
  // Create a card for each meal
  data.meals.slice(0, 6).forEach(meal => {
    // Clone the card template
    const card = cardContainer.content.cloneNode(true);
 
    // Get the elements in the card
    const img = card.querySelector('.card_img');
    const title = card.querySelector('.card_title');
    const description = card.querySelector('.card_description');
    const categoryIcon = card.querySelector('.card_category_icon span');
    const category = card.querySelector('.card_category');
 
    // Set the properties of the elements
    img.src = meal.strMealThumb;
    img.alt = meal.strMeal;
    title.textContent = meal.strMeal;
    description.textContent = meal.strInstructions;
    categoryIcon.textContent = meal.strCategory.charAt(0); // First letter of the category
    category.textContent = meal.strCategory;
 
    // Get the card container in the cloned template
const mealCard = card.querySelector('.card_container');

    // If mealCard exists, add an event listener and send the id with
    if (mealCard) {
        mealCard.addEventListener('click', function() {
            console.log("clicked", meal.idMeal);
            window.location.href = `recipe.html?id=${meal.idMeal}`;
        });
    }
    // Append the card to the section
    section.appendChild(card);
  });
});
 
/****************************************  FETCH RANDOM MEAL FOR MEAL OF THE DAY CARD ************************************************/
/* select the html element and ensure taht the con tainer can be cloned multiple times  */
const cardTemplate = document.querySelector('#section_1_card').content.cloneNode(true);
 
async function mealOfTheDay() {
  // Fetch a random meal
  const meal = await fetchRandomMeal();
  console.log(meal); // Log the meal to the console
 
  // Clone the card template
  const card = cardTemplate.cloneNode(true);
 
  // Get the elements in the card
  const img = card.querySelector('.card_img');
  const title = card.querySelector('.card_title');
  const description = card.querySelector('.card_description');
  const favIcon = card.querySelector('.btn_fav img');
  const categoryIcon = card.querySelector('.card_category_icon');
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

// If cardContainer exists, add an event listener and send the id with
if (cardContainer) {
    cardContainer.addEventListener('click', function() {
        console.log("clicked", meal.idMeal);
        window.location.href = `recipe.html?id=${meal.idMeal}`;
    });
}

  // Append the card to the meal of the day container
  const mealOfTheDayContainer = document.querySelector('#meal_of_the_day_container');
  console.log(mealOfTheDayContainer); // Log the container to the console
  mealOfTheDayContainer.appendChild(card);
}
 
// Call the function
mealOfTheDay();



/* ------------- CAROUSEL CODE ---------------- */
let carouselMeals = [];
/*template for cards for the carousel*/
const carouselTemplate = document.getElementById('carousel_card_template');
/*destination for the cards*/
const destination = document.querySelector(".recipes_carousel");
 
//const for prev and next buttons
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
 
//variable for det current index number in the array, start on 0 (as arrays do...)
let currentIndex = 0;
 
 
 
 
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
 
async function fetchMealCarousel() {
  try {
    const meal = await fetchRandomMeal();
    console.log("test");
    carouselMeals.push(meal);
  } catch (error) {
    console.error('Error:', error);
  }
}
 
// Create an array of mypromises in order to laod 8 meals for the carousel
//beware the number is the amount of random, recipes that will be in the carousel(in the array)
//this is different from the amount of cards actively shown
const mypromises = Array.from({ length: 8 }, () => fetchMealCarousel());
 
Promise.all(mypromises)
  .then(() =>{
    console.log(carouselMeals);
    updateCards();
  });
 
 
 
 
/*function responsible for updating the cards and appending the correct content to the destination*/
function updateCards() {
  console.log("updating cards");
 
  /*rydder destinationen, så det kan erstattes med det nye indhold*/
  destination.innerHTML = '';
 
  //uses the responsive function to determine amount of cards to show at a time
  const amountOfCards = responsiveCardAmount();
 
 
  /*for loop til loade cards ind , samt den korekte mængde cards baseret på variablen amount of cards.
   
     først sætttes variablen i lig med currentindex (variabel for index i arrayet, starter på 0)
     Så sikres at loopet kører de ønskede antal gange:
     så længe i er mindre end current index + amount of cards:
      eksempelvis hvis currentindex er 2, vil i også være 2, hvis amount of cards så er 3, vil den kører så længe i < 5,
      altså 3 gange, da den vil køre for i=2, i=3 og i=4, derfor kan man med amount of cards variablen styre hvor mange cards der skal vises
   
     i++ styrer bare at i's værdi stiger for vært loop, så det næste index i arrayet vælges.
   
     consten data index gemmer værdien af i og her sikres at hvis i bliver større end arrayets længde nulstilles det til 0,
     ved at trække længden af arrayet fra
     */
  for (let i = currentIndex; i < currentIndex + amountOfCards; i++) {
    const dataIndex = i >= carouselMeals.length ? i - carouselMeals.length : i;
 
    //cloner template og laver variabler for de individuelle elementer
    const cardClone = carouselTemplate.content.cloneNode(true);
    const cardImg = cardClone.querySelector('.carousel_card_img');
    const cardCategory = cardClone.querySelector('.card_category');
    const cardCategoryIcon = cardClone.querySelector('.card_category_icon');
    const cardTitle = cardClone.querySelector('.card_title');
    const cardArea = cardClone.querySelector('.card_area');
 
    //indsætter data
    cardImg.src = carouselMeals[dataIndex].strMealThumb;
    cardTitle.textContent = carouselMeals[dataIndex].strMeal;
    cardCategory.textContent = carouselMeals[dataIndex].strCategory;
    cardArea.textContent = `Cuisine: ${carouselMeals[dataIndex].strArea}`;
    cardCategoryIcon.textContent = carouselMeals[dataIndex].strCategory.charAt(0);
 
    // Get the card container in the cloned template
const mealCard = cardClone.querySelector('.carousel_card_container');

// If mealCard exists, add an event listener and send the id with
if (mealCard) {
    mealCard.addEventListener('click', function() {
        console.log("clicked", carouselMeals[dataIndex].idMeal);
        window.location.href = `recipe.html?id=${carouselMeals[dataIndex].idMeal}`;
    });
}

    destination.appendChild(cardClone);
  }
 
}
 
 
//sets the amount of cards based on window width (1 for mobile, 2 for tablet, 3 for laptop)
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
 
 
// Media query listeners for the breakpoints for mobile, tablet and desktop
const bigLaptop = window.matchMedia("(min-width: 1440px)");
const laptop = window.matchMedia("(min-width: 1024px)");
const tablet = window.matchMedia("(min-width: 768px)");
const mobile = window.matchMedia("(max-width: 767px)");
 
//To ensure the right amount will always be shown, as soon as the window matches our media breakpoint, update cards is called
// Adding on change event listeners to my media breakpoints
bigLaptop.onchange = updateCards;
laptop.onchange = updateCards;
tablet.onchange = updateCards;
mobile.onchange = updateCards;
 
 
 
 
// click event listener for previous button
prevButton.addEventListener('click', previousCard);
 
// Click event listener for next button
nextButton.addEventListener('click', nextCard);
 
//En conditional ternary operater - hvis current index er mindre en eller lig med nul:
//sker det første hvis det er true (så index bliver sat til last index i arrayet)
// det andet sker hvis det er false, så falder current index bare med 1
//dette sikrer at der loopes rundt tilbage til slutningen af arrayet
function previousCard() {
  // Denne const bruges fordi det sidste index i arrayet altid er en mindre end arrayets længde ( da array starter på 0)
  const lastIndex = carouselMeals.length - 1;
  currentIndex = currentIndex <= 0 ? lastIndex : currentIndex - 1;
  console.log("previous clicked, current is: " + currentIndex);
  updateCards();
}
 
//En conditional ternary - hvis current index overstiger det sidste index i arrayet:
//sker det første hvis det er true (så sættes current index til 0 for at komme frem til starten af array igen)
// det andet sker hvis det er false, så stiger current index bare med 1
//dette sikrer at der loopes rundt til starten af arrayet
function nextCard() {
  // Denne const bruges ford det sidste index i arrayet altid er en mindre end arrayets længde ( da array starter på 0)
  const lastIndex = carouselMeals.length - 1;
 
  currentIndex = currentIndex >= lastIndex ? 0 : currentIndex + 1;
  console.log("next clicked, current is: " + currentIndex);
  updateCards();
}