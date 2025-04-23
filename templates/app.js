// Инициализация Telegram WebApp
let tg = window.Telegram.WebApp;
tg.expand();

// Инициализация состояния приложения
let currentSection = 'search';
let currentChatPartner = null;
let currentProfile = null;
let filters = {
    ageMin: 18,
    ageMax: 50,
    gender: 'female'
};

// Получение элементов DOM
const sections = {
    profile: document.getElementById('profile-section'),
    search: document.getElementById('search-section'),
    matches: document.getElementById('matches-section'),
    messages: document.getElementById('messages-section')
};

// Получение данных пользователя
const user = tg.initDataUnsafe.user;

// Статистика
let stats = {
    likes: 0,
    matches: 0
};

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
            updateStats();
        } else {
            showNotification('Ошибка загрузки профиля', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Ошибка сервера', 'error');
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
                user_id: user.id,
                filters: filters
            })
        });
        const data = await response.json();
        
        if (response.ok && data) {
            currentProfile = data;
            displayProfileCard(data);
            initializeSwipeHandlers();
        } else {
            document.getElementById('profile-card').classList.add('hidden');
            showNotification('Нет доступных профилей', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Ошибка загрузки профиля', 'error');
    }
}

async function fetchMatches(type = 'all') {
    try {
        const response = await fetch(`https://dating-bot-api.onrender.com/api/matches/${user.id}?type=${type}`);
        const data = await response.json();
        if (response.ok) {
            displayMatches(data);
            updateStats();
        } else {
            showNotification('Ошибка загрузки пар', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Ошибка сервера', 'error');
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
    const profileInfo = document.getElementById('profile-info');
    profileInfo.innerHTML = `
        <div class="profile-header">
            <img src="${profile.photo_url || 'default-avatar.png'}" alt="Фото профиля" class="profile-photo">
            <div class="profile-text">
                <h3>${profile.name}, ${profile.age}</h3>
                <p>${profile.gender}</p>
            </div>
        </div>
        <div class="profile-details">
            <p><strong>О себе:</strong> ${profile.bio}</p>
            <p><strong>Ищу:</strong> ${profile.search_gender}</p>
        </div>
    `;
}

function displayProfileCard(profile) {
    const card = document.getElementById('profile-card');
    card.classList.remove('hidden');
    
    document.getElementById('profile-photo').src = profile.photo_url || 'default-avatar.png';
    document.getElementById('profile-name').textContent = profile.name;
    document.getElementById('profile-age').textContent = profile.age;
    document.getElementById('profile-bio').textContent = profile.bio || '';

    // Анимация появления
    card.style.animation = 'slideIn 0.3s ease-out';
}

function displayMatches(matches) {
    const matchesList = document.getElementById('matches-list');
    
    if (!matches || matches.length === 0) {
        matchesList.innerHTML = '<p class="no-matches">У вас пока нет пар</p>';
        return;
    }

    matchesList.innerHTML = matches.map(match => `
        <div class="match-card" onclick="startChat(${match.user_id})">
            <img src="${match.photo_url || 'default-avatar.png'}" alt="${match.name}" class="match-photo">
            <div class="match-info">
                <h3>${match.name}, ${match.age}</h3>
                <p>${match.bio || ''}</p>
                ${match.unread ? '<span class="unread-badge">Новое сообщение</span>' : ''}
            </div>
        </div>
    `).join('');
}

function displayMessages(messages) {
    const messagesContainer = document.getElementById('messages');
    
    if (!messages || messages.length === 0) {
        messagesContainer.innerHTML = '<p class="no-messages">Нет сообщений</p>';
        return;
    }

    messagesContainer.innerHTML = messages.map(msg => `
        <div class="message ${msg.sender_id === user.id ? 'sent' : 'received'}">
            <div class="message-content">
                <p class="message-text">${msg.text}</p>
                <span class="message-time">${formatTime(msg.timestamp)}</span>
            </div>
        </div>
    `).join('');
    
    scrollToBottom();
}

// Вспомогательные функции
function showNotification(message, type = 'error') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}-message`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Функция для отправки данных в Telegram
function sendData(action, data = {}) {
    tg.sendData(JSON.stringify({
        action: action,
        ...data
    }));
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
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}

// Основные функции
function handleAction(action) {
    if (!currentProfile) return;
    
    const card = document.getElementById('profile-card');
    
    // Анимация
    if (action === 'like') {
        card.style.transform = 'translate(150%, 0) rotate(30deg)';
    } else if (action === 'dislike') {
        card.style.transform = 'translate(-150%, 0) rotate(-30deg)';
    } else if (action === 'superlike') {
        card.style.transform = 'translate(0, -150%) rotate(0deg)';
    }

    // Отправка действия
    sendData(action);
    
    // Обновление статистики
    if (action === 'like' || action === 'superlike') {
        stats.likes++;
        updateStats();
    }

    // Загрузка следующего профиля
    setTimeout(() => {
        card.style.display = 'none';
        card.style.transform = '';
        setTimeout(() => {
            card.style.display = '';
            loadNextProfile();
        }, 100);
    }, 300);
}

function showMatches() {
    showSection('matches');
    sendData('show_matches');
}

function startChat(userId) {
    currentChatPartner = userId;
    showSection('messages');
    sendData('start_chat', { partner_id: userId });
    document.getElementById('messages').innerHTML = '';
}

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

function createMessageElement(text, isSent) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <p class="message-text">${text}</p>
            <span class="message-time">${formatTime(new Date())}</span>
        </div>
    `;
    return messageDiv;
}

// Переключение между разделами
function showSection(sectionName) {
    Object.entries(sections).forEach(([name, element]) => {
        if (element) {
            if (name === 'profile' || name === 'search') {
                element.classList.remove('hidden');
            } else {
                element.classList.toggle('hidden', name !== sectionName);
            }
        }
    });
    currentSection = sectionName;
}

// Обработчики входящих данных
function handleIncomingMessage(data) {
    if (currentSection === 'messages' && currentChatPartner === data.sender_id) {
        const messageElement = createMessageElement(data.text, false);
        document.getElementById('messages').appendChild(messageElement);
        scrollToBottom();
    }
}

function updateProfile(data) {
    displayProfile(data);
}

function updateMatches(matches) {
    displayMatches(matches);
}

// Обработка свайпов
function initializeSwipeHandlers() {
    const card = document.getElementById('profile-card');
    let startX = 0;
    let startY = 0;
    let moveX = 0;
    let moveY = 0;

    card.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });

    card.addEventListener('touchmove', (e) => {
        moveX = e.touches[0].clientX - startX;
        moveY = e.touches[0].clientY - startY;
        
        const rotate = moveX * 0.1;
        card.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotate}deg)`;
    });

    card.addEventListener('touchend', () => {
        if (Math.abs(moveX) > 100) {
            if (moveX > 0) {
                handleAction('like');
            } else {
                handleAction('dislike');
            }
        } else {
            card.style.transform = '';
        }
    });
}

// Обработка фильтров
function initializeFilters() {
    const ageMin = document.getElementById('age-min');
    const ageMax = document.getElementById('age-max');
    const ageMinValue = document.getElementById('age-min-value');
    const ageMaxValue = document.getElementById('age-max-value');

    ageMin.addEventListener('input', () => {
        const min = parseInt(ageMin.value);
        const max = parseInt(ageMax.value);
        if (min > max) {
            ageMax.value = min;
            ageMaxValue.textContent = min;
        }
        ageMinValue.textContent = min;
        filters.ageMin = min;
    });

    ageMax.addEventListener('input', () => {
        const min = parseInt(ageMin.value);
        const max = parseInt(ageMax.value);
        if (max < min) {
            ageMin.value = max;
            ageMinValue.textContent = max;
        }
        ageMaxValue.textContent = max;
        filters.ageMax = max;
    });

    document.querySelectorAll('.gender-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.gender-button').forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            filters.gender = button.dataset.gender;
        });
    });
}

// Обновление статистики
function updateStats() {
    document.getElementById('likes-count').textContent = stats.likes;
    document.getElementById('matches-count').textContent = stats.matches;
}

// Модальные окна
function showMatchModal(matchData) {
    const modal = document.getElementById('match-modal');
    modal.classList.remove('hidden');
    
    document.getElementById('send-message-modal').onclick = () => {
        modal.classList.add('hidden');
        startChat(matchData.user_id);
    };
    
    document.getElementById('keep-swiping').onclick = () => {
        modal.classList.add('hidden');
    };
}

// Обработчики событий
document.getElementById('filter-button').addEventListener('click', () => {
    const filters = document.getElementById('search-filters');
    filters.classList.toggle('hidden');
});

document.getElementById('apply-filters').addEventListener('click', () => {
    document.getElementById('search-filters').classList.add('hidden');
    loadNextProfile();
});

document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        fetchMatches(button.dataset.tab);
    });
});

// Инициализация приложения
window.addEventListener('load', async () => {
    document.getElementById('profile-section').classList.remove('hidden');
    document.getElementById('search-section').classList.remove('hidden');
    
    initializeFilters();
    await fetchProfile();
    await loadNextProfile();
    
    const profileCard = document.getElementById('profile-card');
    if (profileCard) {
        profileCard.classList.remove('hidden');
    }
}); 