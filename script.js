const apiKey = '5308da8b1c6b4b8c89932525242311';
const apiUrl = 'https://api.weatherapi.com/v1/current.json?q=';
const apiUrl1 = 'https://api.weatherapi.com/v1/astronomy.json?q=';
const apiUrl2 = 'https://api.weatherapi.com/v1/forecast.json?q=';
const searchBox = document.getElementById('searchBox');
const searchBtn = document.getElementById('searchBtn');


const checkWeather = async (city) => {
    const response = await fetch(apiUrl + city + `&key=${apiKey}`);
    let data = await response.json();

    const response1 = await fetch(apiUrl1 + city + `&key=${apiKey}`);
    let data1 = await response1.json();

    const response2 = await fetch(apiUrl2 + city + `&key=${apiKey}`);
    let data2 = await response2.json();

    console.log(data);

    const iconUrl = `https:${data.current.condition.icon}`;

    document.getElementById('weatherIcon').src = iconUrl;
    document.getElementById('weatherText').innerHTML = data.current.condition.text;
    document.getElementById('city').innerHTML = data.location.name + ', ' + data.location.country;
    document.getElementById('temperature').innerHTML = Math.floor(data.current.temp_c) + '°C';
    document.getElementById('wind').innerHTML = data.current.wind_kph + ' km/h';
    document.getElementById('humidity').innerHTML = data.current.humidity + '%';
    document.getElementById('realFeelTemp').innerHTML = data.current.feelslike_c + '°C';
    document.getElementById('realFeelIcon').src = iconUrl;
    document.getElementById('uvIndex').innerHTML = data.current.uv;
    document.getElementById('pressure').innerHTML = data.current.pressure_mb + ' mb';
    document.getElementById('latitude').innerHTML = 'Latitude: ' + data.location.lat;
    document.getElementById('longitude').innerHTML = 'Longitude: ' + data.location.lon;


    document.getElementById('sunRise').innerHTML = 'Rise ' + data1.astronomy.astro.sunrise;
    document.getElementById('sunSet').innerHTML = 'Set ' + data1.astronomy.astro.sunset;
    document.getElementById('moonRise').innerHTML = data1.astronomy.astro.moonrise;
    document.getElementById('moonSet').innerHTML = 'Set ' + data1.astronomy.astro.moonset;

    document.getElementById('maxTemp').innerHTML = data2.forecast.forecastday[0].day.maxtemp_c + '°C';
    document.getElementById('minTemp').innerHTML = data2.forecast.forecastday[0].day.mintemp_c + '°C';
}

const updateDateAndTime = () => {
    const now = new Date();

    const date = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).replace(/ /g, '-');

    const day = now.toLocaleDateString('en-US', { weekday: 'long'});

    const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    document.getElementById('date').innerHTML = `
        <p>${date}</p>
        <p>${day}, ${time}</p>
        <p>Day</p>
    `
}

const fetchWeatherByLocation = async () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // const lat = 27.6833;
                // const lon = 84.4333;

                const response = await fetch(
                    `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`
                );
                const data = await response.json();

                const response1 = await fetch(
                    `https://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${lat},${lon}`
                );
                const data1 = await response1.json();

                const response2 = await fetch(
                    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=1`
                );
                const data2 = await response2.json();

                console.log(data);

                // Extract necessary weather data
                const city = data.location.name;
                const country = data.location.country;
                const iconUrl = `https:${data.current.condition.icon}`;
                const weatherIcon = data.current.condition.text;
                const temp = Math.floor(data.current.temp_c);
                const wind = data.current.wind_kph + " km/h";
                const humidity = data.current.humidity + "%";
                const realFeel = data.current.feelslike_c + "°C";
                const realFeelIcon = iconUrl;
                const uvIndex = data.current.uv;
                const pressure = data.current.pressure_mb + ' mb';
                const latitude = 'Latitude: ' + data.location.lat;
                const longitude = 'Longitude: ' + data.location.lon;
                const sunrise = 'Rise ' +  data1.astronomy.astro.sunrise;
                const sunset = 'Set ' +  data1.astronomy.astro.sunset;
                const moonRise = data1.astronomy.astro.moonrise;
                const moonSet = 'Set ' +  data1.astronomy.astro.moonset;
                const maxTemp = data2.forecast.forecastday[0].day.maxtemp_c + "°C";
                const minTemp = data2.forecast.forecastday[0].day.mintemp_c + "°C";

                // Update the UI
                document.getElementById("weatherIcon").src = iconUrl;
                document.getElementById("weatherText").innerHTML = weatherIcon;
                document.getElementById("city").innerHTML = `${city}, ${country}`;
                document.getElementById("temperature").innerHTML = `${temp}°C`;
                document.getElementById("wind").innerHTML = wind;
                document.getElementById("humidity").innerHTML = humidity;
                document.getElementById("realFeelTemp").innerHTML = realFeel;
                document.getElementById('realFeelIcon').src = realFeelIcon;
                document.getElementById('uvIndex').innerHTML = uvIndex;
                document.getElementById('pressure').innerHTML = pressure;
                document.getElementById('latitude').innerHTML = latitude;
                document.getElementById('longitude').innerHTML = longitude;
                document.getElementById("maxTemp").innerHTML = maxTemp;
                document.getElementById("minTemp").innerHTML = minTemp;

                document.getElementById("sunRise").innerHTML = sunrise;
                document.getElementById("sunSet").innerHTML = sunset;
                document.getElementById("moonRise").innerHTML = moonRise;
                document.getElementById("moonSet").innerHTML = moonSet;
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

updateDateAndTime();

window.onload = () => {
    fetchWeatherByLocation();
};

const handleSearch = () => {
    const city = searchBox.value.trim();
    if (city) {
        checkWeather(city);
    } else {
        alert("Please enter a city name.");
    }
};

searchBox.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

searchBtn.addEventListener('click', handleSearch);