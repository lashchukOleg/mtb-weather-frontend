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

const trailForm = document.getElementById('add-trail-form');
const trailsList = document.getElementById('user-trails-list');

// Funkcja ładująca trasy przy starcie strony
function loadTrails() {
    const savedTrails = JSON.parse(localStorage.getItem('userTrails')) || [];
    trailsList.innerHTML = '';
    savedTrails.forEach(trail => renderTrail(trail));
}

// Funkcja wyświetlająca pojedynczą kartę trasy
function renderTrail(trail) {
    const card = document.createElement('div');
    card.className = 'trail-card';
    card.innerHTML = `
        <span class="difficulty-tag tag-${trail.difficulty}">${trail.difficulty}</span>
        <h4>${trail.name}</h4>
        <a href="${trail.link}" target="_blank" class="btn-small">Zobacz na mapie</a>
    `;
    trailsList.appendChild(card);
}

if (trailForm) {
    trailForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newTrail = {
            name: document.getElementById('trail-name').value,
            difficulty: document.getElementById('trail-difficulty').value,
            link: document.getElementById('trail-link').value
        };

        // Zapis do LocalStorage
        const currentTrails = JSON.parse(localStorage.getItem('userTrails')) || [];
        currentTrails.push(newTrail);
        localStorage.setItem('userTrails', JSON.stringify(currentTrails));

        renderTrail(newTrail);
        trailForm.reset();
    });

    // Uruchom ładowanie przy starcie
    loadTrails();
}

// 1. Ждем, пока вся страница загрузится
document.addEventListener('DOMContentLoaded', () => {
    
    // 2. Ищем форму по ID. ПРОВЕРЬ, ЧТО В HTML У ТЕБЯ id="registrationForm"
    const regForm = document.getElementById('registrationForm');

    // Проверка: если форма не найдена, скрипт сразу об этом скажет
    if (!regForm) {
        console.error("❌ Ошибка: Форма с id='registrationForm' не найдена в HTML!");
        return;
    }

    console.log("✅ Скрипт успешно нашел форму, жду нажатия кнопки...");

    // 3. Вешаем обработчик события
    regForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Останавливаем перезагрузку страницы

        console.log("🚀 Кнопка нажата! Начинаю сбор данных...");

        const email = document.getElementById('emailInput').value;
        const password = document.getElementById('passwordInput').value;
        const statusMessage = document.getElementById('statusMessage');

        // ВАЖНО: Убедись, что ссылка ведет на твой Render без ошибок 404
        const API_URL = 'https://mtb-weather-backend.onrender.com/api/register';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                console.log("✅ Ответ от сервера:", data.message);
                statusMessage.innerText = data.message;
                statusMessage.style.color = "green";
                regForm.reset();
            } else {
                console.warn("⚠️ Сервер вернул ошибку:", data.message);
                statusMessage.innerText = data.message;
                statusMessage.style.color = "red";
            }
        } catch (error) {
            console.error("❌ Критическая ошибка fetch:", error);
            statusMessage.innerText = "Ошибка: не удалось связаться с сервером.";
            statusMessage.style.color = "red";
        }
    });
});