// Инициализация Telegram WebApp
const webApp = window.Telegram.WebApp;
webApp.expand();

// Получение данных пользователя
const user = webApp.initDataUnsafe.user;
let currentProfile = null;

// Элементы интерфейса
const profileSection = document.getElementById('profile-section');
const profileInfo = document.getElementById('profile-info');
const searchSection = document.getElementById('search-section');
const profileCard = document.getElementById('profile-card');
const matchesSection = document.getElementById('matches-section');
const matchesList = document.getElementById('matches-list');

// Функции для работы с API
async function fetchProfile() {
    try {
        const response = await fetch(`/api/profile/${user.id}`);
        const data = await response.json();
        if (response.ok) {
            displayProfile(data);
        } else {
            showError('Ошибка загрузки профиля');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Ошибка сервера');
    }
}

async function fetchMatches() {
    try {
        const response = await fetch(`/api/matches/${user.id}`);
        const data = await response.json();
        if (response.ok) {
            displayMatches(data);
        } else {
            showError('Ошибка загрузки пар');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Ошибка сервера');
    }
}

async function fetchMessages() {
    try {
        const response = await fetch(`/api/messages/${user.id}`);
        const data = await response.json();
        if (response.ok) {
            displayMessages(data);
        } else {
            showError('Ошибка загрузки сообщений');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Ошибка сервера');
    }
}

// Функции отображения
function displayProfile(profile) {
    profileInfo.innerHTML = `
        <div class="profile-header">
            <img src="${profile.photo_url || 'default-avatar.png'}" alt="Фото профиля" class="profile-photo">
            <h3>${profile.name}, ${profile.age}</h3>
        </div>
        <div class="profile-details">
            <p><strong>О себе:</strong> ${profile.bio}</p>
            <p><strong>Пол:</strong> ${profile.gender}</p>
            <p><strong>Ищу:</strong> ${profile.search_gender}</p>
        </div>
    `;
}

function displayMatches(matches) {
    if (matches.length === 0) {
        matchesList.innerHTML = '<p>У вас пока нет пар</p>';
        return;
    }

    matchesList.innerHTML = matches.map(match => `
        <div class="match-card">
            <img src="${match.photo_url || 'default-avatar.png'}" alt="Фото" class="match-photo">
            <div class="match-info">
                <h4>${match.name}, ${match.age}</h4>
                <p>${match.bio}</p>
                <button onclick="startChat(${match.user_id})">Написать</button>
            </div>
        </div>
    `).join('');
}

function displayMessages(messages) {
    const messagesContainer = document.getElementById('messages');
    if (!messagesContainer) return;

    if (messages.length === 0) {
        messagesContainer.innerHTML = '<p>Нет сообщений</p>';
        return;
    }

    messagesContainer.innerHTML = messages.map(msg => `
        <div class="message ${msg.sender_id === user.id ? 'sent' : 'received'}">
            <div class="message-content">
                <p class="message-text">${msg.text}</p>
                <span class="message-time">${new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
        </div>
    `).join('');
}

// Обработчики событий
document.getElementById('edit-profile').addEventListener('click', () => {
    webApp.close();
});

document.getElementById('like').addEventListener('click', () => {
    if (currentProfile) {
        sendReaction(currentProfile.user_id, 'like');
    }
});

document.getElementById('dislike').addEventListener('click', () => {
    if (currentProfile) {
        sendReaction(currentProfile.user_id, 'dislike');
    }
});

// Вспомогательные функции
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}

async function sendReaction(targetUserId, reaction) {
    try {
        const response = await fetch('/api/reaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: user.id,
                target_user_id: targetUserId,
                reaction: reaction
            })
        });
        
        if (response.ok) {
            // Показываем следующий профиль
            loadNextProfile();
        } else {
            showError('Ошибка при отправке реакции');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Ошибка сервера');
    }
}

async function startChat(targetUserId) {
    webApp.sendData(JSON.stringify({
        action: 'start_chat',
        target_user_id: targetUserId
    }));
}

// Инициализация
function init() {
    fetchProfile();
    fetchMatches();
    fetchMessages();
}

// Запуск приложения
init(); 
loadNextProfile(); 