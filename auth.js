// Ждем загрузки всей страницы, чтобы ID точно были видны скрипту
document.addEventListener('DOMContentLoaded', () => {

// ПРОВЕРКА: Если токен уже есть, отправляем в профиль сразу
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
        console.log("🎫 Токен найден, перенаправляю в профиль...");
        window.location.href = 'profile.html';
        return; // Останавливаем выполнение остального скрипта
    }

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            await sendAuthRequest('/login', { email, password });
        };
    }

    if (registerForm) {
        registerForm.onsubmit = async (e) => {
            e.preventDefault();
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            await sendAuthRequest('/register', { email, password });
        };
    }
});

function toggleAuth() {
    const loginBlock = document.getElementById('loginBlock');
    const registerBlock = document.getElementById('registerBlock');
    const status = document.getElementById('statusMessage');
    
    status.innerText = ""; // Очищаем старые сообщения
    
    if (loginBlock.style.display === "none") {
        loginBlock.style.display = "block";
        registerBlock.style.display = "none";
    } else {
        loginBlock.style.display = "none";
        registerBlock.style.display = "block";
    }
}

const API_BASE = 'https://mtb-weather-backend.onrender.com/api';

// Функция для отправки запроса
async function sendAuthRequest(path, data) {
    const status = document.getElementById('statusMessage');
    console.log("Отправляю запрос на:", path);

    try {
        const response = await fetch(`${API_BASE}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log("Ответ от сервера получен:", result);

        if (response.ok) {
            // ПРОВЕРКА: Прислал ли сервер токен?
            if (result.token) {
                console.log("Токен получен! Сохраняю...");
                localStorage.setItem('token', result.token);
                
                if (status) status.innerText = "Успех! Входим...";
                
                // Переход
                console.log("Выполняю переход на profile.html");
                window.location.href = 'profile.html'; 
            } else {
                console.warn("Пароль верный, но сервер не прислал токен!");
                if (status) status.innerText = "Ошибка: сервер не выдал ключ доступа.";
            }
        } else {
            if (status) status.innerText = result.message || "Ошибка входа";
        }
    } catch (e) {
        console.error("Критическая ошибка скрипта:", e);
    }
}