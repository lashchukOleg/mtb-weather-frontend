// Переключение между Входом и Регистрацией
// Ждем загрузки всей страницы, чтобы ID точно были видны скрипту
document.addEventListener('DOMContentLoaded', () => {
    console.log("Скрипт auth.js загружен и готов!");

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            console.log("🚀 Нажата кнопка ВХОДА");
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            await sendAuthRequest('/login', { email, password });
        };
    }

    if (registerForm) {
        registerForm.onsubmit = async (e) => {
            e.preventDefault();
            console.log("🚀 Нажата кнопка РЕГИСТРАЦИИ");
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
    try {
        const response = await fetch(`${API_BASE}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (response.ok) {
            if (result.token) {
                // СОХРАНЯЕМ ТОКЕН
                localStorage.setItem('token', result.token); 
                status.innerText = "Успех! Переходим в профиль...";
                setTimeout(() => window.location.href = 'profile.html', 1500);
            } else {
                status.innerText = result.message;
            }
            status.style.color = "green";
        } else {
            status.innerText = result.message;
            status.style.color = "red";
        }
    } catch (e) {
        status.innerText = "Ошибка связи с сервером";
    }
}