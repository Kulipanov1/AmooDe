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
const messagesSection = document.getElementById('messages-section');
const messageInput = document.getElementById('message-text');
const sendMessageBtn = document.getElementById('send-message');

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

async function loadNextProfile() {
    try {
        const response = await fetch('/api/next-profile', {
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

async function fetchMessages(chatPartnerId) {
    try {
        const response = await fetch(`/api/messages/${user.id}/${chatPartnerId}`);
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

if (sendMessageBtn) {
    sendMessageBtn.addEventListener('click', sendMessage);
}

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
            if (reaction === 'like') {
                const matchData = await response.json();
                if (matchData.isMatch) {
                    showSuccess('У вас взаимная симпатия! 💕');
                }
            }
            loadNextProfile();
        } else {
            showError('Ошибка при отправке реакции');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Ошибка сервера');
    }
}

async function sendMessage() {
    const text = messageInput.value.trim();
    if (!text || !currentChatPartner) return;

    try {
        const response = await fetch('/api/messages/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sender_id: user.id,
                receiver_id: currentChatPartner,
                text: text
            })
        });
        
        if (response.ok) {
            messageInput.value = '';
            fetchMessages(currentChatPartner);
        } else {
            showError('Ошибка при отправке сообщения');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Ошибка сервера');
    }
}

let currentChatPartner = null;

async function startChat(targetUserId) {
    currentChatPartner = targetUserId;
    messagesSection.classList.remove('hidden');
    matchesSection.classList.add('hidden');
    await fetchMessages(targetUserId);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 3000);
}

// Инициализация
function init() {
    fetchProfile();
    fetchMatches();
    loadNextProfile();
}

// Запуск приложения
init(); 