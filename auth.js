// Переключение между Входом и Регистрацией
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
        status.innerText = result.message;
        status.style.color = response.ok ? "green" : "red";
    } catch (e) {
        status.innerText = "Ошибка связи с сервером";
        status.style.color = "red";
    }
}

// Слушатель для Входа
document.getElementById('loginForm').onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    sendAuthRequest('/login', { email, password });
};

// Слушатель для Регистрации
document.getElementById('registerForm').onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    sendAuthRequest('/register', { email, password });
};