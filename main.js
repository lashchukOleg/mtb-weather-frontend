const API_KEY = 'b0610d5161b497605e5952146cd9c3f0'

const weatherForm = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const weatherResults = document.getElementById('weather-results');


if (weatherForm) {
    weatherForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const city = cityInput.value.trim();
        if (!city) return;

        weatherResults.innerHTML = '<p>Sprawdzanie pogody...</p>';

        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pl`);
            
            if (!response.ok) {
                throw new Error('Nie znaleziono miasta. Spróbuj ponownie.');
            }

            const data = await response.json();
            displayWeather(data);

        } catch (error) {
            weatherResults.innerHTML = `<p style="color: red;">Błąd: ${error.message}</p>`;
        }
    });
}

function displayWeather(data) {
    const { name, main, weather, wind } = data;
    const temp = Math.round(main.temp);
    const desc = weather[0].description;
    const icon = weather[0].icon;
    const windSpeed = (wind.speed * 3.6).toFixed(1); 

    
    let recommendation = "";
    if (temp > 10 && temp < 25 && wind.speed < 8) {
        recommendation = "✅ Warunki idealne na tripa! Pamiętaj o nawodnieniu.";
    } else if (temp <= 5) {
        recommendation = "⚠️ Zimno! Załóż bieliznę termoaktywną i grubsze rękawiczki.";
    } else if (wind.speed >= 8) {
        recommendation = "💨 Silny wiatr! Uważaj na odsłoniętych grzbietach i skokach.";
    } else {
        recommendation = "🚲 Warunki są OK, ale sprawdź prognozę opadów przed wyjazdem.";
    }

    weatherResults.innerHTML = `
        <div class="weather-card">
            <h3>Pogoda w: ${name}</h3>
            <div class="weather-info">
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}">
                <div class="temp">${temp}°C</div>
                <div class="details">
                    <p><strong>Stan:</strong> ${desc}</p>
                    <p><strong>Wiatr:</strong> ${windSpeed} km/h</p>
                </div>
            </div>
            <div class="mtb-tip">
                <strong>Rekomendacja MTB:</strong><br>
                ${recommendation}
            </div>
        </div>
    `;
}



