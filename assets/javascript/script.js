const APIKey = "161f2b3a5369b4da1f6021ae020649ac";
const urlAPI = "https://api.openweathermap.org/data/2.5/weather?q=";
const oneCallAPI = "https://api.openweathermap.org/data/2.5/onecall?lat=";

var cityNameInput = document.querySelector(".search-city");
var submitButton = document.querySelector("#button");
var cityWeather = document.querySelector(".weather-info");
var citySummary = document.querySelector(".city-summary");
var tempInfo = document.querySelector(".temperature-info");
var cardsArray = document.querySelectorAll(".card");

function getCityWeather() {

    var cityName = cityNameInput.value; //Get input from user
    var linkRequest = urlAPI + cityName + "&appid=" + APIKey + "&units=metric";
    console.log(linkRequest);

    fetch(linkRequest)
    .then(function(response){
        return response.json();
    })
    .then(function(data){

        //Display name of the city
        var cityName = document.createElement("h3");
        cityName.textContent = data.name + ", " + data.sys.country;
        citySummary.prepend(cityName);

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

function getCityUV(lat, lon){
    var oneCallURL = oneCallAPI + lat + "&lon=" + lon + "&appid=" + APIKey;

    fetch(oneCallURL)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        var indexUV = document.createElement("li");
        indexUV.textContent = "UV Index: " + data.current.uvi;
        tempInfo.appendChild(indexUV);
    })
};

submitButton.addEventListener("click", getCityWeather);