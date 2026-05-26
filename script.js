const apiKey = "39c23e4c1483f4f247d75a5483187d40";

// 🌍 Background change based on weather
function setBackground(condition) {

    let body = document.body;

    if (condition === "Clear") {
        body.style.backgroundImage = "url('https://images.unsplash.com/photo-1502082553048-f009c37129b9')";
    }
    else if (condition === "Rain") {
        body.style.backgroundImage = "url('https://images.unsplash.com/photo-1501691223387-dd0500403074')";
    }
    else if (condition === "Clouds") {
        body.style.backgroundImage = "url('https://images.unsplash.com/photo-1534088568595-a066f410bcda')";
    }
    else if (condition === "Snow") {
        body.style.backgroundImage = "url('https://images.unsplash.com/photo-1608889175631-1f6a0f8b0b3c')";
    }
    else if (condition === "Thunderstorm") {
        body.style.backgroundImage = "url('https://images.unsplash.com/photo-1500674425229-f692875b0ab7')";
    }
    else {
        body.style.backgroundImage = "url('https://images.unsplash.com/photo-1527766833261-b09c3163a791')";
    }

    body.style.backgroundSize = "cover";
    body.style.backgroundPosition = "center";
}

// 🌤 Get weather
async function getWeather() {

    let city = document.getElementById("city").value.trim();

    if (city === "") {
        document.getElementById("result").innerHTML =
            "<h3>Please enter a city name.</h3>";
        return;
    }

    document.getElementById("result").innerHTML =
        "<h3>⏳ Loading Weather...</h3>";

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    fetchWeather(url);
}

// 🌦 Fetch weather
async function fetchWeather(url) {

    try {

        let response = await fetch(url);
        let data = await response.json();

        if (data.cod != 200 && data.cod != "200") {
            document.getElementById("result").innerHTML =
                "<h3>City not found ❌</h3>";
            return;
        }

        let condition = data.weather[0].main;

        // 🌍 Background update
        setBackground(condition);

        // 🌤 Icon
        let icon = "🌤️";

        if (condition === "Clear") icon = "☀️";
        else if (condition === "Rain") icon = "🌧️";
        else if (condition === "Clouds") icon = "☁️";
        else if (condition === "Thunderstorm") icon = "⛈️";
        else if (condition === "Snow") icon = "❄️";
        else if (condition === "Mist" || condition === "Haze") icon = "🌫️";

        // 🌡 Temperature color
        let temp = data.main.temp;
        let tempColor = "#007aff";

        if (temp >= 35) tempColor = "#ff3b30";
        else if (temp >= 25) tempColor = "#ff9500";
        else if (temp >= 15) tempColor = "#34c759";
        else tempColor = "#007aff";

        // 💧 Humidity color
        let humidity = data.main.humidity;
        let humidityColor = "#3498db";

        if (humidity >= 80) humidityColor = "#1e90ff";
        else if (humidity >= 50) humidityColor = "#00bcd4";
        else humidityColor = "#4caf50";

        // 🌬 Wind color
        let wind = data.wind.speed;
        let windColor = "#2ecc71";

        if (wind >= 10) windColor = "#ff3b30";
        else if (wind >= 5) windColor = "#ff9500";

        // 🌥 Condition color
        let conditionColor = "#555";

        if (condition === "Clear") conditionColor = "#f39c12";
        else if (condition === "Rain") conditionColor = "#3498db";
        else if (condition === "Clouds") conditionColor = "#7f8c8d";
        else if (condition === "Snow") conditionColor = "#00cec9";

        document.getElementById("result").innerHTML = `
            <div class="weather-card">

                <h2>${icon} ${data.name}, ${data.sys.country}</h2>

                <div class="info">

                    <div class="box">
                        <h3>🌡 Temperature</h3>
                        <p style="color:${tempColor}; font-size:28px; font-weight:bold;">
                            ${data.main.temp} °C
                        </p>
                    </div>

                    <div class="box">
                        <h3>💧 Humidity</h3>
                        <p style="color:${humidityColor}; font-size:20px; font-weight:bold;">
                            ${data.main.humidity}%
                        </p>
                    </div>

                    <div class="box">
                        <h3>🌬 Wind</h3>
                        <p style="color:${windColor}; font-size:20px; font-weight:bold;">
                            ${data.wind.speed} m/s
                        </p>
                    </div>

                    <div class="box">
                        <h3>🌥 Condition</h3>
                        <p style="color:${conditionColor}; font-size:20px; font-weight:bold;">
                            ${condition}
                        </p>
                    </div>

                </div>

            </div>
        `;

    }
    catch (error) {
        document.getElementById("result").innerHTML =
            "<h3>Error fetching weather data!</h3>";
    }
}

// 📍 Current location
function getCurrentLocation() {

    if (navigator.geolocation) {

        document.getElementById("result").innerHTML =
            "<h3>📍 Getting your location...</h3>";

        navigator.geolocation.getCurrentPosition(async (position) => {

            let lat = position.coords.latitude;
            let lon = position.coords.longitude;

            let url =
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            fetchWeather(url);

        });

    } else {
        alert("Geolocation not supported.");
    }
}