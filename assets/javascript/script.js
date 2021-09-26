const APIKey = "161f2b3a5369b4da1f6021ae020649ac";
const urlAPI = "https://api.openweathermap.org/data/2.5/weather?q=";
const oneCallAPI = "https://api.openweathermap.org/data/2.5/onecall?lat=";

var cityNameInput = document.querySelector(".search-city");
var submitButton = document.querySelector("#button");
var searchHistory = document.querySelector(".recent-search");
var cityWeather = document.querySelector(".weather-info");
var citySummary = document.querySelector(".city-summary");
var tempInfo = document.querySelector(".temperature-info");
var cardsArray = document.querySelectorAll(".card");
var citiesArray = [];

function getCityWeather() {

    var cityName = cityNameInput.value; //Get input from user
    if(cityName === ""){
        alert("Please input a valid city");
        return;
    }
    citiesArray.push(cityName); //Add city to recently views
    localStorage.setItem("cities",JSON.stringify(citiesArray)); //Save city on local storage

    displayLastCity();
    var linkRequest = urlAPI + cityName + "&appid=" + APIKey + "&units=metric";

    //Clear previous content
    clearValues();

    fetch(linkRequest)
    .then(function(response){
        return response.json();
    })
    .then(function(data){

        //Display date next to city name
        var dateCalendar = new Date(data.dt*1000);

        //Display name of the city
        var cityNameAndDate = document.createElement("h3");
        cityNameAndDate.textContent = data.name + ", " + data.sys.country + ". " + dateCalendar.toLocaleDateString();
        citySummary.prepend(cityNameAndDate);

        //Get Icon from API
        var weatherIconCode = data.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/wn/" + weatherIconCode + "@2x.png";

        //Display icon next to name
        var weatherIcon = document.createElement("img");
        weatherIcon.setAttribute("src",iconURL);
        citySummary.appendChild(weatherIcon);        

        //Create elements to show weather info
        var cityTemp = document.createElement("li");
        var cityWind = document.createElement("li");
        var cityHumidity = document.createElement("li");
        var cityUV = document.createElement("li");

        //Display weather info
        cityTemp.textContent = "Temperature: " + data.main.temp + "°C";
        tempInfo.appendChild(cityTemp);
        cityWind.textContent = "Wind: " + data.wind.speed + "km/h";
        tempInfo.appendChild(cityWind);
        cityHumidity.textContent = "Humidity: " + data.main.humidity + "%";
        tempInfo.appendChild(cityHumidity);

        //Get UV index from One Call API
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        getCityUV(lat, lon);
    })
}

//Function to get UV index using API
function getCityUV(lat, lon){
    var oneCallURL = oneCallAPI + lat + "&lon=" + lon + "&units=metric&appid=" + APIKey;

    fetch(oneCallURL)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        var indexUV = document.createElement("li");
        indexUV.textContent = "UV Index: ";
        var UVpar = document.createElement("p");
        UVpar.textContent = data.current.uvi;

        setUVIndexColor(UVpar);

        indexUV.appendChild(UVpar);
        tempInfo.appendChild(indexUV);

        //As we need the same API we get forecast from here
        getForecast(data);
    })
};

//Set UV Index color
function setUVIndexColor(UVpar) {
    if(UVpar.textContent < 2){
        UVpar.style.backgroundColor = "green";
    }else if(UVpar.textContent < 5){
        UVpar.style.backgroundColor = "yellow";
        UVpar.style.color = "black";
    }else if(UVpar.textContent < 7){
        UVpar.style.backgroundColor = "orange";
    }else if(UVpar.textContent < 10){
        UVpar.style.backgroundColor = "red";
    }else{
        UVpar.style.backgroundColor = "purple";
    }
}

//Get 5-day forecast
function getForecast(data) {
    //For loop to fill all cards
    for(var i=0; i<5; i++){
        //Display date
        var date = new Date(data.daily[i+1].dt*1000).toLocaleDateString();
        var dateElement = document.createElement("h5");
        dateElement.textContent = date;
        cardsArray[i].appendChild(dateElement);

        //Display weather icon
        var forecastImage = document.createElement("img");
        var forecastIcon = data.daily[i+1].weather[0].icon;
        var iconURL = "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png";
        forecastImage.setAttribute("src",iconURL);
        cardsArray[i].appendChild(forecastImage);

        //Display forecast info
        var forecastTemp = document.createElement("p");
        var forecasteWind = document.createElement("p");
        var forecastHumidity = document.createElement("p");

        forecastTemp.textContent = "Temp: " + data.daily[i+1].temp.day + "°C";
        forecasteWind.textContent = "Wind: " + data.daily[i+1].wind_speed + "Km/h";
        forecastHumidity.textContent = "Humidity: " + data.daily[i+1].humidity + "%";
        cardsArray[i].appendChild(forecastTemp);
        cardsArray[i].appendChild(forecasteWind);
        cardsArray[i].appendChild(forecastHumidity);
    }
}

//Remove information from current weather and forecast
function clearValues() {
    if(!citySummary.firstChild){
        return;
    }else{
        while(citySummary.firstChild){
            citySummary.removeChild(citySummary.firstChild);
        }
    }

    if(!tempInfo.firstChild){
        return;
    }else{
        while(tempInfo.firstChild){
            tempInfo.removeChild(tempInfo.firstChild);
        }
    }

    cardsArray.forEach(function(element, index){
        if(!element.firstChild){
            return;
        }else{
            while(element.firstChild){
                element.removeChild(element.firstChild);
            }
        }
    })
}

//Add last city to search history
function displayLastCity() {
    var lastCityAux = citiesArray[citiesArray.length -1];
    var lastCity = lastCityAux[0].toUpperCase() + lastCityAux.substring(1);
    var cityButton = document.createElement("input");
    cityButton.setAttribute("id","button");
    cityButton.setAttribute("type","submit");
    cityButton.setAttribute("value",lastCity);

    //Add button to search history
    searchHistory.appendChild(cityButton);
}

function getWeatherViewed(lastCity){
    var linkRequest = urlAPI + lastCity + "&appid=" + APIKey + "&units=metric";

    //Clear previous content
    clearValues();

    fetch(linkRequest)
    .then(function(response){
        return response.json();
    })
    .then(function(data){

        //Display date next to city name
        var dateCalendar = new Date(data.dt*1000);

        //Display name of the city
        var cityNameAndDate = document.createElement("h3");
        cityNameAndDate.textContent = data.name + ", " + data.sys.country + ". " + dateCalendar.toLocaleDateString();
        citySummary.prepend(cityNameAndDate);

        //Get Icon from API
        var weatherIconCode = data.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/wn/" + weatherIconCode + "@2x.png";

        //Display icon next to name
        var weatherIcon = document.createElement("img");
        weatherIcon.setAttribute("src",iconURL);
        citySummary.appendChild(weatherIcon);        

        //Create elements to show weather info
        var cityTemp = document.createElement("li");
        var cityWind = document.createElement("li");
        var cityHumidity = document.createElement("li");
        var cityUV = document.createElement("li");

        //Display weather info
        cityTemp.textContent = "Temperature: " + data.main.temp + "°C";
        tempInfo.appendChild(cityTemp);
        cityWind.textContent = "Wind: " + data.wind.speed + "km/h";
        tempInfo.appendChild(cityWind);
        cityHumidity.textContent = "Humidity: " + data.main.humidity + "%";
        tempInfo.appendChild(cityHumidity);

        //Get UV index from One Call API
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        getCityUV(lat, lon);
    })
}

//Display Sydney for Default
getWeatherViewed("sydney");

//Listener to display user city
submitButton.addEventListener("click", getCityWeather);

//Listener to display city viewed before
searchHistory.addEventListener('click', function(e) {
    e = e || window.event;
    var target = e.target;
    var city = target.getAttribute("value");
    getWeatherViewed(city);
}, false);
