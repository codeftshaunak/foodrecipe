//Select Elements
const mealsElement = document.getElementById('meal');
const favcontain = document.getElementById('fav-contain');
const popMeal = document.getElementById('meal-popup');
const mealInfo = document.getElementById('meal-info');

const searchBtn = document.getElementById('search');
const searchTerm = document.getElementById('search-term');



//function call
rendomData();
fetchFavMeals();




// Featch Rendom Api From Website
async function rendomData() {
        const resp = await fetch(
                "https://www.themealdb.com/api/json/v1/1/random.php"
        );

        const respData = await resp.json();
        const rendomMeals = respData.meals[0];

        addMeal(rendomMeals, true);
}

//Get Data By Id
async function getMealById(id) {
        const resp = await fetch(
                "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
        );

        const respData = await resp.json();
        const getmeal = respData.meals[0];

        return getmeal;
}

//Get Data By Search
async function gatMealBySearch(term) {
        const resp = await fetch(
                "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
        );

        const respData = await resp.json();
        const meals = respData.meals;

        return meals;
}


function addMeal(mealData, rendom = false) {
        const meal = document.createElement('div');
        meal.classList.add('meals');
        meal.innerHTML = `              
                                ${rendom ? `<span class="random-recipe">Rendom Recipe</span>` : ""}
                               
                                <div class="meal">
                                <div class="meal-header">
                                        <img src=${mealData.strMealThumb}
                                        alt=${mealData.strMeal}>
                                </div>
                                <div class="meal-body">
                                <h4>${mealData.strMeal}</h4>
                                <button>
                                        <i class="fas fa-heart btn-fav"></i>
                                </button>
                                </div>
                         `




        const btn = meal.querySelector('.meal-body .btn-fav');
        console.log(btn);

        btn.addEventListener('click', () => {
                if (btn.classList.contains('active')) {
                        removeMealLS(mealData.idMeal);
                        btn.classList.remove('active')
                } else {
                        addMealLS(mealData.idMeal);
                        btn.classList.add('active')
                }
                fetchFavMeals();
        });

        //appendchild is doing something call replace one to another
        mealsElement.appendChild(meal);

        meal.addEventListener('click', () => {
                showMealData(mealData)
        });

}

function addMealLS(mealId) {
        const mealIds = getMealLS();
        localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function removeMealLS(mealId) {
        const mealIds = getMealLS();
        localStorage.setItem("mealIds", JSON.stringify(mealIds.filter((id) => id !== mealId)))
}

function getMealLS() {
        const lsMeal = JSON.parse(localStorage.getItem('mealIds'));
        return lsMeal === null ? [] : lsMeal;
}

//Get Meal By Id
async function fetchFavMeals() {
        favcontain.innerHTML = "";

        const mealIds = getMealLS();
        for (let i = 0; i < mealIds.length; i++) {
                const mealId = mealIds[i];
                getmeal = await getMealById(mealId);
                addMealFav(getmeal);
        }
}

function addMealFav(mealData) {
        const favMeal = document.createElement('li');

        favMeal.innerHTML = `
                                <div style="position:relative;">
                                        <img src="${mealData.strMealThumb}"
                                                alt="${mealData.strMeal}">
                                        <span>${mealData.strMeal}</span>
                                    <div><button class="clear"> <i class="fas fa-times-circle"></i></button></div>
                                </div>     
                           `
        const btn = favMeal.querySelector(".clear");
        btn.addEventListener('click', () => {
                removeMealLS(mealData.idMeal);
                fetchFavMeals();
        });


        favcontain.appendChild(favMeal);

}


function showMealData(mealData) {
        //clean it
        mealInfo.innerHTML = "";

        const showMeal = document.createElement('div');

        const indgradints = [];
        //Get ingradints and measure
        for (let i = 1; i <= 20; i++) {
                if ("strIngredient" + i) {
                        indgradints.push(
                                `${mealData["strIngredient"+i]}-${mealData["strMeasure"+i]}`
                        )
                } else {
                        break;
                }
        }
        let text = "<ul>";
        showMeal.innerHTML = `
                <div class="meal-header">
                        <button class="pop-close" id="meal-close" onClick="btnClose()"> <i class="fas fa-times-circle"></i></button>
                        <h1>${mealData.strMeal}</h1>
                        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
                        <p>
                               ${mealData.strInstructions}
                        </p>
                        <h3>Ingredient</h3>
                        
                        ${
                        indgradints.map((value) => {
                                text += "<li>" + value + "</li>";
                        })};
                        ${text += "</ul>"}
                </div>
                        `

        //Show The Popup
        popMeal.classList.remove('hidden');
        mealInfo.appendChild(showMeal);
}

searchBtn.addEventListener('click', async () => {
        mealsElement.innerHTML = "";
        const search = searchTerm.value;
        const meal = await gatMealBySearch(search);
        if (meal) {
                meal.forEach((value) => {
                        addMeal(value);
                });
        }
});

function btnClose() {
        popMeal.classList.add('hidden')
}