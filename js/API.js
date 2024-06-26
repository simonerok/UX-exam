'use strict';
 const API_KEY = "1";


// Search meal by name
const SEARCH_MEAL_BY_NAME_URL = "search.php?s=Arrabiata";

// List all meals by first letter
const LIST_ALL_MEALS_BY_FIRST_LETTER = "search.php?f=a";

// Lookup full meal details by id
const LOOKUP_FULL_MEAIL_DETAILS_BY_ID = "lookup.php?i=52772";

// Lookup a single random meal
const LOOKUP_SINGLE_RANDOM_MEAIL = "random.php";

// List all meal categories
const LIST_ALL_MEAL_CATEGORIES = "categories.php";

// List all Categories, Area, Ingredients
const LIST_ALL_CATEGORIES_AREA_INGREDIENTS = "list.php?c=list";

// Filter by main ingredient
const FILTER_BY_MAIN_INGREDIENT = "filter.php?i=chicken_breast";

// Filter by Category
const FILTER_BY_CATEGORY = "filter.php?c=Seafood";

// Filter by Area
const FILTER_BY_AREA= "filter.php?a=Canadian";





async function testApi(params) {
    try {
      const response = await fetch("https://www.themealdb.com/api/json/v1/1/" + params);
      if (response.ok) {
        const data = await response.json();

        console.log(data.meals);
        console.log('API Response:', data);
      } else {
        console.error('API request failed with status:', response.status);
      }
    } catch (error) {
      console.error('API request failed with error:', error);
    }
  }

  testApi(FILTER_BY_AREA);










  /* ------------- CAROUSEL CODE ---------------- */
let random_recipes = [];
/*template for cards for the carousel*/
const card_template = document.getElementById('card_template');
/*destination for the cards*/
const destination = document.querySelector(".recipes_carousel");
 
//const for prev and next buttons
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
 
//variable for det current index number in the array, start on 0 (as arrays do...)
let currentIndex = 0;
 
 
 
 
 
//function for getting random recipes and putting in array, the amount param controls how many recipes.
async function getRandomRecipes(amount) {
 
  for (let iteration = 0; iteration < amount; iteration++) {
 
 
    try {
      const response = await fetch("https://www.themealdb.com/api/json/v1/1/" + LOOKUP_SINGLE_RANDOM_MEAIL);
      if (response.ok) {
        const data = await response.json();
 
        let meal = (data.meals[0]);
        random_recipes.push(meal);
      } else {
        console.error('API request failed with status:', response.status);
      }
    } catch (error) {
      console.error('API request failed with error:', error);
    }
  }
 
  console.log(random_recipes);
  updateCards();
}
 
// calling random recipes, with a number
//beware the number is the amount of random, recipes that will be in the carousel(in the array)
//this is different from the amount of cards actively shown
getRandomRecipes(6);
 
 
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
  const dataIndex = i >= random_recipes.length ? i - random_recipes.length : i;
 
 //cloner template og laver variabler for de individuelle elementer
  const card_clone = card_template.content.cloneNode(true);
  const card_img = card_clone.querySelector('.carousel_card_img');
  const card_title = card_clone.querySelector('.card_title');
  const card_description = card_clone.querySelector('.card_description');
 
//indsætter data
  card_img.src = random_recipes[dataIndex].strMealThumb;
  card_title.textContent = random_recipes[dataIndex].strMeal;
  card_description.textContent = `${random_recipes[dataIndex].strCategory}, ${random_recipes[dataIndex].strArea}` ;
 
  destination.appendChild(card_clone);
}
 
}
 
 
//sets the amount of cards based on window width (1 for mobile, 2 for tablet, 3 for laptop)
function responsiveCardAmount() {
  let amountOfCards;
 
  if (window.innerWidth >= 1440) {
    amountOfCards = 4;
  }else if (window.innerWidth >= 1024) {
      amountOfCards = 3;
  } else if (window.innerWidth >= 768) {
      amountOfCards = 2;
  } else {
      amountOfCards = 1;
  }
 
  return amountOfCards;
}
 
 
// Media query listeners for the breakpoints for mobile, tablet and desktop
const biglaptop = window.matchMedia("(min-width: 1440px)");
const laptop = window.matchMedia("(min-width: 1024px)");
const tablet = window.matchMedia("(min-width: 768px)");
const mobile = window.matchMedia("(max-width: 767px)");
 
//To ensure the right amount will always be shown, as soon as the window matches our media breakpoint, update cards is called
// Adding on change event listeners to my media breakpoints
biglaptop.onchange = updateCards;
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
    const lastIndex = random_recipes.length - 1;
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
  const lastIndex = random_recipes.length - 1;
 
    currentIndex = currentIndex >= lastIndex ? 0 : currentIndex + 1;
    console.log("next clicked, current is: " + currentIndex);
    updateCards();
}