const search = document.getElementById('search'),
submit = document.getElementById('submit'),
random = document.getElementById('random'),
mealsElement = document.getElementById('meals'),
resultHeading = document.getElementById('result-heading'),
singleMealElement = document.getElementById('single-meal');

// Search for meal and fetch from API
function searchMeal(e) {
    e.preventDefault();

    // Clear single meal
    singleMealElement.innerHTML = '';

    // Get search item
    const searchTerm = search.value;

    // Check if empty
    if (searchTerm.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                resultHeading.innerHTML = `<h2>Search Results for '${searchTerm}':</h2>`

                if (data.meals === null) {
                    resultHeading.innerHTML = `<p>There are no search results. Please try another search term</p>`;
                } else {
                    mealsElement.innerHTML = data.meals.map(meal =>
                        `<div class="meal">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                            <div class="meal-info" data-mealID="${meal.idMeal}">
                                <h3>${meal.strMeal}</h3>
                            </div>
                        </div>`
                    ).join('');
                }

                // Clear search text
                search.value = '';
            });
    } else {
        alert('Please enter a search term');
    }
}

// Event listeners
submit.addEventListener('submit', searchMeal);
// Get individual meal info by id
function getMealById(mealId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDOM(meal);
        });
}

// Add meal to DOM
function addMealToDOM(meal) {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    singleMealElement.innerHTML = `<div class="single-meal">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="single-meal-info">
            ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
            ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
        </div>
        <div class="main">
            
            <h2>Ingredients</h2>
            <ul>
                ${ingredients
                  .map((ingredient) => `<li>${ingredient}</li>`)
                  .join("")}
            </ul>
            <p>${meal.strInstructions}</p>
        </div>
    </div>`;
    singleMealElement.scrollIntoView(true);
}

function getRandomMeal() {
    // Clear meals and heading
    mealsElement.innerHTML = '';
    resultHeading.innerHTML = '';

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDOM(meal);
        });
}
// Wrap every letter in a span
var textWrapper = document.querySelector('.ml2');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
//animation
anime.timeline({loop: true})
  .add({
    targets: '.ml2 .letter',
    scale: [4,1],
    opacity: [0,1],
    translateZ: 0,
    easing: "easeOutExpo",
    duration: 1800,
    delay: (el, i) => 70*i
  }).add({
    targets: '.ml2',
    opacity: 0,
    duration: 3000,
    easing: "easeOutExpo",
    delay:2000
  });

// Event listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);
mealsElement.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });
    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealById(mealID);
    }
});

