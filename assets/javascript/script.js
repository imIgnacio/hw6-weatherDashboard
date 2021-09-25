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

        //Get 5-day forecast
        getForecast();
    })
}

//Function to get UV index using API
function getCityUV(lat, lon){
    var oneCallURL = oneCallAPI + lat + "&lon=" + lon + "&appid=" + APIKey;

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

        getForecast(data);
    })
};

//Set UV Index color
function setUVIndexColor(UVpar) {
    if(UVpar.textContent < 2){
        UVpar.style.backgroundColor = "green";
    }else if(UVpar.textContent < 5){
        UVpar.style.backgroundColor = "yellow";
    }else if(UVpar.textContent < 7){
        UVpar.style.backgroundColor = "orange";
    }else if(UVpar.textContent < 10){
        UVpar.style.backgroundColor = "red";
    }else{
        UVpar.style.backgroundColor = "purple";
    }
}

//Get 5-day forecast TODO
function getForecast(lat, lon) {
    return;
}

//Remove children from city-summary and temperature-info
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
}



submitButton.addEventListener("click", getCityWeather);