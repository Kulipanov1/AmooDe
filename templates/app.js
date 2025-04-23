// Инициализация Telegram WebApp
let tg = window.Telegram.WebApp;
tg.expand();

// Инициализация состояния приложения
let currentSection = 'profile';
let currentChatPartner = null;

// Получение элементов DOM
const sections = {
    profile: document.getElementById('profile-section'),
    matches: document.getElementById('matches-section'),
    messages: document.getElementById('messages-section')
};

// Получение данных пользователя
const user = tg.initDataUnsafe.user;
let currentProfile = null;

// Элементы интерфейса
const profileSection = document.getElementById('profile-section');
const profileInfo = document.getElementById('profile-info');
const searchSection = document.getElementById('search-section');
const profileCard = document.getElementById('profile-card');
const matchesSection = document.getElementById('matches-section');
const matchesList = document.getElementById('matches-list');
const messagesSection = document.getElementById('messages-section');
const messageInput = document.getElementById('message-text');
const sendMessageBtn = document.getElementById('send-message');

// Функции для работы с API
async function fetchProfile() {
    try {
        const response = await fetch(`https://dating-bot-api.onrender.com/api/profile/${user.id}`);
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

async function loadNextProfile() {
    try {
        const response = await fetch(`https://dating-bot-api.onrender.com/api/next-profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: user.id
            })
        });
        const data = await response.json();
        
        if (response.ok && data) {
            currentProfile = data;
            displayProfileCard(data);
        } else {
            profileCard.classList.add('hidden');
            showError('Нет доступных профилей');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Ошибка загрузки профиля');
    }
}

async function fetchMatches() {
    try {
        const response = await fetch(`https://dating-bot-api.onrender.com/api/matches/${user.id}`);
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

async function fetchMessages(chatPartnerId) {
    try {
        const response = await fetch(`https://dating-bot-api.onrender.com/api/messages/${user.id}/${chatPartnerId}`);
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

function displayProfileCard(profile) {
    profileCard.classList.remove('hidden');
    document.getElementById('profile-photo').src = profile.photo_url || 'default-avatar.png';
    document.getElementById('profile-name').textContent = profile.name;
    document.getElementById('profile-age').textContent = `${profile.age} лет`;
    document.getElementById('profile-bio').textContent = profile.bio;
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
    
    // Прокрутка к последнему сообщению
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Обработчики событий
document.getElementById('edit-profile').addEventListener('click', () => {
    tg.close();
});

document.getElementById('like-button').addEventListener('click', () => handleAction('like'));
document.getElementById('dislike-button').addEventListener('click', () => handleAction('dislike'));
document.getElementById('matches-button').addEventListener('click', showMatches);
document.getElementById('send-message').addEventListener('click', sendMessage);
document.getElementById('back-to-matches').addEventListener('click', () => {
    showSection('matches');
    currentChatPartner = null;
});

if (messageInput) {
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Вспомогательные функции
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}

// Функция для отправки данных в Telegram
function sendData(action, data = {}) {
    tg.sendData(JSON.stringify({
        action: action,
        ...data
    }));
}

// Обработка действий лайк/дизлайк
function handleAction(action) {
    sendData(action);
}

// Показ списка пар
function showMatches() {
    showSection('matches');
    sendData('show_matches');
}

// Начало чата
function startChat(userId) {
    currentChatPartner = userId;
    showSection('messages');
    sendData('start_chat', { partner_id: userId });
    document.getElementById('messages').innerHTML = '';
}

// Отправка сообщения
function sendMessage() {
    const text = messageInput.value.trim();
    
    if (text && currentChatPartner) {
        const messageElement = createMessageElement(text, true);
        document.getElementById('messages').appendChild(messageElement);
        
        sendData('send_message', {
            partner_id: currentChatPartner,
            text: text
        });
        
        messageInput.value = '';
        scrollToBottom();
    }
}

// Создание элемента сообщения
function createMessageElement(text, isSent) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;
    messageDiv.textContent = text;
    return messageDiv;
}

// Прокрутка чата вниз
function scrollToBottom() {
    const messagesContainer = document.getElementById('messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Переключение между разделами
function showSection(sectionName) {
    Object.entries(sections).forEach(([name, element]) => {
        element.classList.toggle('hidden', name !== sectionName);
    });
    currentSection = sectionName;
}

// Обработка входящих сообщений
function handleIncomingMessage(data) {
    if (currentSection === 'messages' && currentChatPartner === data.sender_id) {
        const messageElement = createMessageElement(data.text, false);
        document.getElementById('messages').appendChild(messageElement);
        scrollToBottom();
    }
}

// Обработка обновления профиля
function updateProfile(data) {
    document.getElementById('profile-photo').src = data.photo_url;
    document.getElementById('profile-name').textContent = data.name;
    document.getElementById('profile-age').textContent = data.age;
    document.getElementById('profile-bio').textContent = data.bio;
}

// Обработка обновления списка пар
function updateMatches(matches) {
    const matchesList = document.getElementById('matches-list');
    matchesList.innerHTML = '';
    
    matches.forEach(match => {
        const matchCard = document.createElement('div');
        matchCard.className = 'match-card';
        matchCard.innerHTML = `
            <img src="${match.photo_url}" alt="${match.name}" class="match-photo">
            <div class="match-info">
                <h3>${match.name}, ${match.age}</h3>
                <p>${match.bio}</p>
            </div>
            <button onclick="startChat(${match.user_id})">Чат</button>
        `;
        matchesList.appendChild(matchCard);
    });
}

// Инициализация приложения
window.addEventListener('load', () => {
    showSection('profile');
}); 