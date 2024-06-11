// Cache elements using selectElementById and querySelector
var cityInput = document.getElementById('city');
var weatherContainer = document.querySelector('#weatherContainer');
var weatherForm = document.getElementById('weatherForm');
var toggleTempBtn = document.getElementById('toggleTemp');
var loading = document.getElementById('loading');

var isCelsius = true;

// Register event listeners
weatherForm.addEventListener('submit', function(event) {
    event.preventDefault();
    getWeather();
});

toggleTempBtn.addEventListener('click', function() {
    isCelsius = !isCelsius;
    toggleTempBtn.textContent = isCelsius ? 'Switch to Fahrenheit' : 'Switch to Celsius';
    getWeather();
});

function getWeather() {
    var city = cityInput.value;
    loading.style.display = 'block';
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=0fbc3c9e8efa5aeb18d63e61451ecb35&units=${isCelsius ? 'metric' : 'imperial'}`)
        .then(response => response.json())
        .then(data => {
            // Create new divs for weather info and forecast
            var weatherInfo = document.createElement('div');
            weatherInfo.className = 'weatherInfo';
            var forecast = document.createElement('div');
            forecast.className = 'forecast';

            // Create elements using createElement
            var cityP = document.createElement('p');
            cityP.textContent = `City: ${data.name}`;
            var tempP = document.createElement('p');
            tempP.textContent = `Temperature: ${data.main.temp.toFixed(1)}°${isCelsius ? 'C' : 'F'}`;

            // Use appendChild to add new elements to the DOM
            weatherInfo.appendChild(cityP);
            weatherInfo.appendChild(tempP);

            // Modify the style of an element
            weatherInfo.style.display = 'block';
            loading.style.display = 'none';

            weatherContainer.appendChild(weatherInfo);
            weatherContainer.appendChild(forecast);

            getForecast(city, forecast);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function getForecast(city, forecastDiv) {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=0fbc3c9e8efa5aeb18d63e61451ecb35&units=${isCelsius ? 'metric' : 'imperial'}`)
        .then(response => response.json())
        .then(data => {
            // Create elements using createElement
            var forecastTitle = document.createElement('h2');
            forecastTitle.textContent = '5-Day Forecast:';
            forecastDiv.appendChild(forecastTitle);

            for (var i = 0; i < data.list.length; i += 8) {
                var day = data.list[i];
                var dayDiv = document.createElement('div');
                var dateP = document.createElement('p');
                dateP.textContent = new Date(day.dt_txt).toLocaleDateString();
                var tempP = document.createElement('p');
                tempP.textContent = `Temperature: ${day.main.temp.toFixed(1)}°${isCelsius ? 'C' : 'F'}`;
                var iconImg = document.createElement('img');
                iconImg.src = `http://openweathermap.org/img/w/${day.weather[0].icon}.png`;
                iconImg.alt = day.weather[0].description;
                dayDiv.appendChild(dateP);
                dayDiv.appendChild(tempP);
                dayDiv.appendChild(iconImg);
                forecastDiv.appendChild(dayDiv);
            }

            // Modify the style of an element
            forecastDiv.style.display = 'block';
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
