// ⏰Feature #1
// Display the current date and time using JavaScript

function displayTimeAndDay(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  let currentDay = date.getDay();
  let hours = date.getHours();
  let minutes = date.getMinutes();

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  dateElement.innerHTML = `${days[currentDay]}, ${hours}:${minutes}`;
}

let dateElement = document.querySelector("#day-plus-time");
let currentTime = new Date();
displayTimeAndDay(currentTime);

// Funtion that handles the city update,  weather update, temp / wind etc

function updateWeather(response) {
  document.querySelector(".city").innerHTML = response.data.name;
  newTemperature = Math.round(response.data.main.temp);
  let oldTemperature = document.querySelector(".temp");
  oldTemperature.innerHTML = `${newTemperature}`;
  celsiusTemperature = response.data.main.temp;
  // -> short code is
  // document.querySelector(".temp").innerHTML = Math.round(response.data.main.temp)
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].description;
  getForecast(response.data.coord);
}

// update weather icon for clear sky day and night due to strange pixels in image of API icons
function updateIcon(response) {
  let icon = response.data.condition.icon;
  let iconElement = document.querySelector("#icon");

  if (icon === "clear-sky-day") {
    iconElement.setAttribute("src", "images/sunny.png");
    iconElement.setAttribute("alt", "Clear-sky-day");
    iconElement.setAttribute("alt", "Clear-sky-day");
    iconElement.style.width = "110px";
    iconElement.style.height = "110px";
    iconElement.style.marginTop = "15px";
  } else if (icon === "clear-sky-night") {
    iconElement.setAttribute("src", "images/clear-sky-night-3.png");
    iconElement.setAttribute("alt", "Clear-sky-night");
    iconElement.style.width = "110px";
    iconElement.style.height = "110px";
    iconElement.style.marginTop = "15px";
  } else {
    iconElement.setAttribute(
      "src",
      `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${icon}.png`
    );
    iconElement.setAttribute("alt", icon);
    iconElement.style.width = "170px";
    iconElement.style.height = "170px";
  }
}

// When searching for a city (i.e. Paris), display the city name on the page after the user submits the form.
function search(city) {
  const ownApiKey = "33d1903aae9a8dd9cb119a9d70a09d9d";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${ownApiKey}&units=metric`;
  const apiKey = "1386aafaa966aa68e4520o87btc31531";
  let apiUrlSheCodes = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(updateWeather);
  axios.get(apiUrlSheCodes).then(updateIcon);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  search(city);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

// When clicking on Celsius link, it should convert the temperature to Fahrenheit. When clicking on Celsius, it should convert it back to Celsius.

function convertFahrenheit(event) {
  event.preventDefault;
  let temperatureElement = document.querySelector(".temp");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
  // remove the active class from the celcius temp and add active to fahrenheit
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}

function convertCelcius(event) {
  event.preventDefault;
  let temperatureElement = document.querySelector(".temp");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  // add the active class to the celcius temp and remove active from fahrenheit
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
}

let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", convertFahrenheit);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", convertCelcius);

// get location

function getLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  // const apiKey = "f81614abe2395d5dfecd45b9298041de";
  const ownApiKey = "33d1903aae9a8dd9cb119a9d70a09d9d";

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${ownApiKey}&units=metric`;

  axios.get(apiUrl).then(updateWeather);
}

function searchUserLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getLocation);
}

let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", searchUserLocation);

// display forecast

function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
        <div class="col">
            <div class="weather-forecast-day">${formatForecastDay(
              forecastDay.time
            )}</div>
              <div class="icon">
              <img 
                src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                  forecastDay.condition.icon
                }.png" 
                alt="${forecastDay.condition.icon}" 
                width=42 
              />
              
              </div>
                <div class="weather-forecast-temp">
                  <span class="weather-forecast-temp-max">${Math.round(
                    forecastDay.temperature.maximum
                  )}°</span>  
                  <span class="weather-forecast-temp-min">${Math.round(
                    forecastDay.temperature.minimum
                  )}° </span>
                </div>
        </div>
    `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "1386aafaa966aa68e4520o87btc31531";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.lon}&lat=${coordinates.lat}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

// initial submit / search for city

search("San Francisco");
