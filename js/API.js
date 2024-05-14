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
      const response = await fetch("http://www.themealdb.com/api/json/v1/1/" + params);
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









