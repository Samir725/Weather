const apiKey = '5308da8b1c6b4b8c89932525242311';
const apiBaseUrl = 'https://api.weatherapi.com/v1/';
const searchBox = document.getElementById('searchBox');
const searchBtn = document.getElementById('searchBtn');

// Function to fetch weather data
const fetchWeatherData = async (location) => {
    try {
        const currentWeatherResponse = await fetch(`${apiBaseUrl}current.json?key=${apiKey}&q=${location}`);
        const astronomyResponse = await fetch(`${apiBaseUrl}astronomy.json?key=${apiKey}&q=${location}`);
        const forecastResponse = await fetch(`${apiBaseUrl}forecast.json?key=${apiKey}&q=${location}&days=1`);

        const currentWeather = await currentWeatherResponse.json();
        const astronomy = await astronomyResponse.json();
        const forecast = await forecastResponse.json();

        return { currentWeather, astronomy, forecast };
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Failed to fetch weather data. Please try again.");
    }
};

// Function to update the UI
const updateUi = (data) => {
    if (!data) return;

    const { currentWeather, astronomy, forecast } = data;

    const iconUrl = `https:${currentWeather.current.condition.icon}`;
    document.getElementById('weatherIcon').src = iconUrl;
    document.getElementById('weatherText').innerHTML = currentWeather.current.condition.text;
    document.getElementById('city').innerHTML = `${currentWeather.location.name}, ${currentWeather.location.country}`;
    document.getElementById('temperature').innerHTML = `${Math.floor(currentWeather.current.temp_c)}°C`;
    document.getElementById('wind').innerHTML = `${currentWeather.current.wind_kph} km/h`;
    document.getElementById('humidity').innerHTML = `${currentWeather.current.humidity}%`;
    document.getElementById('realFeelTemp').innerHTML = `${currentWeather.current.feelslike_c}°C`;
    document.getElementById('realFeelIcon').src = iconUrl;
    document.getElementById('uvIndex').innerHTML = currentWeather.current.uv;
    document.getElementById('pressure').innerHTML = `${currentWeather.current.pressure_mb} mb`;
    document.getElementById('latitude').innerHTML = `Latitude: ${currentWeather.location.lat}`;
    document.getElementById('longitude').innerHTML = `Longitude: ${currentWeather.location.lon}`;
    document.getElementById('sunRise').innerHTML = `Rise ${astronomy.astronomy.astro.sunrise}`;
    document.getElementById('sunSet').innerHTML = `Set ${astronomy.astronomy.astro.sunset}`;
    document.getElementById('moonRise').innerHTML = `Rise ${astronomy.astronomy.astro.moonrise}`;
    document.getElementById('moonSet').innerHTML = `Set ${astronomy.astronomy.astro.moonset}`;
    document.getElementById('maxTemp').innerHTML = `${forecast.forecast.forecastday[0].day.maxtemp_c}°C`;
    document.getElementById('minTemp').innerHTML = `${forecast.forecast.forecastday[0].day.mintemp_c}°C`;
};

// Function to get weather data by geolocation
const fetchWeatherByLocation = async () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const data = await fetchWeatherData(`${lat},${lon}`);
                updateUi(data);
            },
            (error) => {
                console.error("Geolocation permission denied or unavailable:", error);
                alert("Location access denied. Please search for a city manually.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
};

// Function to check weather by city
const checkWeather = async (city) => {
    if (!city) {
        alert("Please enter a valid city name.");
        return;
    }
    const data = await fetchWeatherData(city);
    updateUi(data);
};

// Function to update date and time
const updateDateAndTime = () => {
    const now = new Date();

    const date = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).replace(/ /g, '-');

    const day = now.toLocaleDateString('en-US', { weekday: 'long' });

    const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    document.getElementById('date').innerHTML = `
        <p>${date}</p>
        <p>${day}, ${time}</p>
        <p>Day</p>
    `;
};

// Initialize the app
updateDateAndTime();

window.onload = () => {
    fetchWeatherByLocation();
};

searchBtn.addEventListener('click', () => {
    checkWeather(searchBox.value.trim());
});
