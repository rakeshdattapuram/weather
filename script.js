const API_KEY = "bf2b58f1d99686ac2e864f680c108f11";

const temperature = document.getElementById("temperature");
const cityInput = document.getElementById("cityInput");
const humidity = document.getElementById("humidity");
const pressure = document.getElementById("pressure");
const wind = document.getElementById("wind");
const locationBtn = document.getElementById("locationBtn");
const feelslike = document.getElementById("feelsLike");
const condition = document.getElementById("condition");
const visibility = document.getElementById("visibility");
const uv = document.getElementById("uv");

const detailFeels = document.getElementById("detailFeels");
const detailWind = document.getElementById("detailWind");
const detailHumidity = document.getElementById("detailHumidity");

const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

const cityName = document.getElementById("cityName");
const cityInForecast = document.getElementById("cityInForecast");
const searchBtn = document.getElementById("searchBtn");
const mainIcon = document.getElementById("mainIcon");
const currentDate = document.getElementById("currentDate");
const currentTime = document.getElementById("currentTime");

const days = [
    document.getElementById("day1"),
    document.getElementById("day2"),
    document.getElementById("day3"),
    document.getElementById("day4"),
    document.getElementById("day5")
];

const icons = [
    document.getElementById("icon1"),
    document.getElementById("icon2"),
    document.getElementById("icon3"),
    document.getElementById("icon4"),
    document.getElementById("icon5")
];

const temps = [
    document.getElementById("temp1"),
    document.getElementById("temp2"),
    document.getElementById("temp3"),
    document.getElementById("temp4"),
    document.getElementById("temp5")
];

const conditions = [
    document.getElementById("condition1"),
    document.getElementById("condition2"),
    document.getElementById("condition3"),
    document.getElementById("condition4"),
    document.getElementById("condition5")
];

async function getWeather(city) {
    if (!city.trim()) {
        alert("Please enter a city name");
        return;
    }

    try {
        const URL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        const response = await fetch(URL);
        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "City not found");
            return;
        }

        updateWeather(data);
        addToHistory(data.name);
        await get5daysforecast(data.name);

    } catch (error) {
        console.error(error);
        alert("Unable to fetch weather data");
    }
}

function updateWeather(data) {
    cityName.textContent = data.name;
    cityInForecast.textContent = data.name;

    temperature.textContent = Math.round(data.main.temp);

    feelslike.textContent =
        Math.round(data.main.feels_like) + "°C";

    condition.textContent = data.weather[0].main;

    humidity.textContent =
        data.main.humidity + "%";

    wind.textContent =
        (data.wind.speed * 3.6).toFixed(1) + " km/h";

    detailFeels.textContent =
        Math.round(data.main.feels_like) + "°C";

    detailWind.textContent =
        (data.wind.speed * 3.6).toFixed(1) + " km/h";

    detailHumidity.textContent =
        data.main.humidity + "%";

    pressure.textContent =
        data.main.pressure + " hPa";

    visibility.textContent =
        (data.visibility / 1000).toFixed(1) + " km";

    uv.textContent = "N/A";

    updateMainIcon();

    sunrise.textContent =
        new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    sunset.textContent =
        new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    currentDate.textContent =
        new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric"
        });
}

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (!city) {
        alert("Please enter a city name");
        return;
    }

    getWeather(city);

    cityInput.value = "";
});

cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});

async function get5daysforecast(city) {
    try {
        const URL = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        const response = await fetch(URL);
        const data = await response.json();

        if (!response.ok) {
            console.error(data.message);
            return;
        }

        const forecast = data.list.filter(item =>
            item.dt_txt.includes("12:00:00")
        );

        forecast.slice(0, 5).forEach((item, index) => {

            days[index].textContent =
                new Date(item.dt * 1000)
                    .toLocaleDateString("en-US", {
                        weekday: "short"
                    })
                    .toUpperCase();

            temps[index].textContent =
                Math.round(item.main.temp) + "°";

            conditions[index].textContent =
                item.weather[0].main;

            icons[index].textContent =
                getWeatherIcon(item.weather[0].main);
        });

    } catch (error) {
        console.error(error);
    }
}

function getWeatherIcon(weatherCondition) {

    if (weatherCondition === "Clear") {
        return "☀️";
    }

    if (weatherCondition === "Clouds") {
        return "☁️";
    }

    if (weatherCondition === "Rain") {
        return "🌧️";
    }

    if (weatherCondition === "Drizzle") {
        return "🌦️";
    }

    if (weatherCondition === "Thunderstorm") {
        return "⛈️";
    }

    if (weatherCondition === "Snow") {
        return "❄️";
    }

    if (
        weatherCondition === "Mist" ||
        weatherCondition === "Fog" ||
        weatherCondition === "Haze"
    ) {
        return "🌫️";
    }

    return "🌤️";
}

function updateLogo() {
    const logo = document.getElementById("logoIcon");
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 18) {
        logo.textContent = "☀️";
    } else {
        logo.textContent = "🌙";
    }
}

function updateMainIcon() {
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 18) {
        mainIcon.textContent = "☀️";
    } else {
        mainIcon.textContent = "🌙";
    }
}

function updateTime() {
    currentTime.textContent =
        new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
}

updateLogo();
updateMainIcon();
updateTime();

setInterval(updateLogo, 60000);
setInterval(updateMainIcon, 60000);
setInterval(updateTime, 1000);

let searchHistory =
    JSON.parse(localStorage.getItem("searchHistory")) || [];

const historyList =
    document.getElementById("historyList");

const clearHistory =
    document.getElementById("clearHistory");

function displayHistory() {

    historyList.innerHTML = "";

    searchHistory.forEach(city => {

        const button = document.createElement("button");

        button.textContent = city;

        button.addEventListener("click", () => {
            getWeather(city);
        });

        historyList.appendChild(button);
    });
}

function addToHistory(city) {

    city = city.trim();

    if (!city) {
        return;
    }

    searchHistory = searchHistory.filter(
        item =>
            item.toLowerCase() !== city.toLowerCase()
    );

    searchHistory.unshift(city);

    searchHistory =
        searchHistory.slice(0, 5);

    localStorage.setItem(
        "searchHistory",
        JSON.stringify(searchHistory)
    );

    displayHistory();
}

clearHistory.addEventListener("click", () => {

    searchHistory = [];

    localStorage.removeItem("searchHistory");

    displayHistory();
});

displayHistory();

locationBtn.addEventListener("click", () => {

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }

    locationBtn.textContent =
        "📍 Getting Location...";

    navigator.geolocation.getCurrentPosition(

        async (position) => {

            try {

                const lat =
                    position.coords.latitude;

                const lon =
                    position.coords.longitude;

                const URL =
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

                const response =
                    await fetch(URL);

                const data =
                    await response.json();

                if (!response.ok) {
                    alert(
                        data.message ||
                        "Unable to get weather"
                    );
                    return;
                }

                updateWeather(data);

                addToHistory(data.name);

                await get5daysforecast(data.name);

            } catch (error) {

                console.error(error);

                alert(
                    "Unable to fetch weather for your location"
                );

            } finally {

                locationBtn.textContent =
                    "📍 Use My Location";
            }
        },

        (error) => {

            console.error(error);

            locationBtn.textContent =
                "📍 Use My Location";

            if (error.code === 1) {
                alert("Location permission was denied");
            } else if (error.code === 2) {
                alert("Your location could not be determined");
            } else if (error.code === 3) {
                alert("Location request timed out");
            } else {
                alert("Unable to get your location");
            }
        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
});

getWeather("Tadipatri");