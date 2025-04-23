// Константы
const Colors = {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#333333',
    subtext: '#8E8E93',
    border: '#E5E5EA',
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FFCC00',
    inactive: '#C7C7CC',
    gradient: {
        start: '#FF6B6B',
        end: '#FF8E8E'
    }
};

// Мок данные
const mockUsers = [
    {
        id: '1',
        name: 'София',
        age: 28,
        bio: 'Люблю кофе, йогу и приключения. Давай исследовать город вместе!',
        location: 'Москва',
        distance: 5,
        photos: [
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
            'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
        ],
        interests: ['Путешествия', 'Йога', 'Фотография', 'Кофе'],
        lastActive: '2 мин назад'
    },
    {
        id: '2',
        name: 'Александр',
        age: 30,
        bio: "Архитектор днем, шеф-повар вечером. Могу спроектировать дом мечты и приготовить в нем ужин.",
        location: 'Санкт-Петербург',
        distance: 8,
        photos: [
            'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
            'https://images.unsplash.com/photo-1488161628813-04466f872be2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
        ],
        interests: ['Архитектура', 'Кулинария', 'Походы', 'Джаз'],
        lastActive: '1 час назад'
    }
];

// Telegram WebApp утилиты
const isTelegramWebApp = () => {
    return window.Telegram && window.Telegram.WebApp;
};

const getTelegramWebApp = () => {
    if (!isTelegramWebApp()) {
        console.error('Telegram WebApp не доступен');
        return null;
    }
    return window.Telegram.WebApp;
};

const initTelegramWebApp = () => {
    const webApp = getTelegramWebApp();
    if (webApp) {
        webApp.ready();
        webApp.expand();
        
        // Настраиваем тему
        document.documentElement.className = webApp.colorScheme;
        
        // Обработчик изменения темы
        webApp.onEvent('themeChanged', () => {
            document.documentElement.className = webApp.colorScheme;
        });
        
        return webApp;
    }
    return null;
};

const getTelegramUser = () => {
    const webApp = getTelegramWebApp();
    return webApp ? webApp.initDataUnsafe.user : null;
};

// Состояние приложения
const state = {
    currentUser: null,
    currentProfile: null,
    currentChat: null,
    profiles: [...mockUsers],
    matches: [],
    messages: [],
    filters: {
        ageMin: 18,
        ageMax: 50,
        gender: 'all',
        distance: 50,
        interests: []
    }
};

// DOM элементы
const elements = {
    pages: {
        cards: document.getElementById('cards-page'),
        profile: document.getElementById('profile-page'),
        live: document.getElementById('live-page'),
        likes: document.getElementById('likes-page'),
        matches: document.getElementById('matches-page')
    },
    cards: {
        container: document.querySelector('.card-stack'),
        card: document.querySelector('.profile-card'),
        photo: document.querySelector('.photo-container img'),
        name: document.querySelector('.profile-info-overlay h3'),
        bio: document.querySelector('.profile-info-overlay p'),
        likeButton: document.getElementById('like-button'),
        dislikeButton: document.getElementById('dislike-button'),
        superlikeButton: document.getElementById('superlike-button')
    },
    navigation: document.querySelectorAll('.nav-item')
};

// Утилиты
const utils = {
    showSection(sectionId) {
        Object.values(elements.sections).forEach(section => {
            section.classList.add('hidden');
        });
        elements.sections[sectionId].classList.remove('hidden');
    },
    
    formatAge(birthdate) {
        const today = new Date();
        const birth = new Date(birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    },
    
    createMessageElement(message, isSent) {
        const div = document.createElement('div');
        div.className = `message ${isSent ? 'sent' : 'received'}`;
        div.textContent = message.text;
        return div;
    }
};

// API взаимодействие
const api = {
    async getProfile() {
        const response = await fetch('/api/profile');
        state.currentProfile = await response.json();
        updateProfileView();
    },
    
    async updateProfile(data) {
        const response = await fetch('/api/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        state.currentProfile = await response.json();
        updateProfileView();
    },
    
    async getNextProfile() {
        const response = await fetch('/api/profiles/next');
        return await response.json();
    },
    
    async sendAction(profileId, action) {
        const response = await fetch('/api/action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profileId, action })
        });
        return await response.json();
    },
    
    async getMatches() {
        const response = await fetch('/api/matches');
        state.matches = await response.json();
        updateMatchesView();
    },
    
    async sendMessage(receiverId, text) {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ receiverId, text })
        });
        return await response.json();
    },
    
    async getMessages(partnerId) {
        const response = await fetch(`/api/messages/${partnerId}`);
        return await response.json();
    }
};

// Обработчики событий профиля
const profileHandlers = {
    async init() {
        try {
            const profile = await api.getProfile();
            elements.profile.photo.src = profile.photo || 'default-avatar.png';
            elements.profile.name.textContent = profile.name;
            elements.profile.likesCount.textContent = profile.likes || 0;
            elements.profile.matchesCount.textContent = profile.matches || 0;
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    },
    
    setupListeners() {
        elements.profile.editButton.addEventListener('click', () => {
            tg.showPopup({
                title: 'Редактировать профиль',
                message: 'Эта функция будет доступна в следующем обновлении',
                buttons: [{ type: 'ok' }]
            });
        });
    }
};

// Обработчики событий поиска
const searchHandlers = {
    async loadNextProfile() {
        try {
            const profile = await api.getNextProfile();
            if (profile) {
                state.currentProfile = profile;
                this.displayProfile(profile);
            } else {
                elements.search.profileCard.innerHTML = `
                    <div class="no-profiles">
                        <i class="fas fa-search"></i>
                        <p>Профили закончились. Попробуйте изменить параметры поиска.</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading next profile:', error);
        }
    },
    
    displayProfile(profile) {
        const photoContainer = elements.search.profileCard.querySelector('.photo-container');
        photoContainer.querySelector('img').src = profile.photo;
        photoContainer.querySelector('#profile-name').textContent = profile.name;
        photoContainer.querySelector('#profile-age').textContent = utils.formatAge(profile.birthdate);
        photoContainer.querySelector('#profile-bio').textContent = profile.bio;
        
        // Обновляем интересы
        const interestsContainer = photoContainer.querySelector('.profile-interests');
        interestsContainer.innerHTML = '';
        profile.interests.forEach(interest => {
            const tag = document.createElement('div');
            tag.className = 'interest-tag';
            tag.textContent = interest;
            interestsContainer.appendChild(tag);
        });
    },
    
    setupListeners() {
        // Обработчики фильтров
        elements.search.filterButton.addEventListener('click', () => {
            elements.search.filters.classList.toggle('hidden');
        });
        
        elements.search.ageMin.addEventListener('input', (e) => {
            elements.search.ageMinValue.textContent = e.target.value;
        });
        
        elements.search.ageMax.addEventListener('input', (e) => {
            elements.search.ageMaxValue.textContent = e.target.value;
        });
        
        elements.search.genderButtons.forEach(button => {
            button.addEventListener('click', () => {
                elements.search.genderButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                state.filters.gender = button.dataset.gender;
            });
        });
        
        // Обработчики действий
        elements.search.likeButton.addEventListener('click', () => this.handleAction('like'));
        elements.search.dislikeButton.addEventListener('click', () => this.handleAction('dislike'));
        elements.search.superlikeButton.addEventListener('click', () => this.handleAction('superlike'));
    },
    
    async handleAction(action) {
        if (!state.currentProfile) return;
        
        try {
            const result = await api.sendAction(state.currentProfile.id, action);
            if (result.match) {
                this.showMatchModal(state.currentProfile);
            } else {
                this.loadNextProfile();
            }
        } catch (error) {
            console.error('Error sending action:', error);
        }
    },
    
    showMatchModal(profile) {
        elements.modal.match.querySelector('.partner-photo').src = profile.photo;
        elements.modal.match.querySelector('.your-photo').src = elements.profile.photo.src;
        elements.modal.match.classList.remove('hidden');
    }
};

// Обработчики событий пар
const matchesHandlers = {
    async loadMatches(type = 'all') {
        try {
            const matches = await api.getMatches();
            elements.matches.list.innerHTML = '';
            
            matches
                .filter(match => type === 'all' || (type === 'new' && !match.messagesCount))
                .forEach(match => {
                    const matchElement = this.createMatchElement(match);
                    elements.matches.list.appendChild(matchElement);
                });
        } catch (error) {
            console.error('Error loading matches:', error);
        }
    },
    
    createMatchElement(match) {
        const div = document.createElement('div');
        div.className = 'match-card';
        div.innerHTML = `
            <img src="${match.photo}" alt="${match.name}" class="match-photo">
            <div class="match-info">
                <h3>${match.name}, ${utils.formatAge(match.birthdate)}</h3>
                <p>${match.lastMessage || 'Начните общение!'}</p>
            </div>
            ${!match.messagesCount ? '<span class="new-badge">Новый</span>' : ''}
        `;
        
        div.addEventListener('click', () => {
            state.currentChat = match.id;
            messageHandlers.openChat(match);
        });
        
        return div;
    },
    
    setupListeners() {
        elements.matches.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                elements.matches.tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.loadMatches(tab.dataset.tab);
            });
        });
        
        elements.matches.backButton.addEventListener('click', () => {
            utils.showSection('search');
        });
    }
};

// Обработчики событий сообщений
const messageHandlers = {
    async openChat(partner) {
        utils.showSection('messages');
        elements.messages.partnerName.textContent = partner.name;
        elements.messages.partnerPhoto.src = partner.photo;
        elements.messages.container.innerHTML = '';
        
        try {
            const messages = await api.getMessages(partner.id);
            messages.forEach(message => {
                const messageElement = utils.createMessageElement(message, message.senderId === tg.initDataUnsafe.user.id);
                elements.messages.container.appendChild(messageElement);
            });
            this.scrollToBottom();
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    },
    
    async sendMessage() {
        const text = elements.messages.input.value.trim();
        if (!text || !state.currentChat) return;
        
        try {
            const message = await api.sendMessage(state.currentChat, text);
            const messageElement = utils.createMessageElement(message, true);
            elements.messages.container.appendChild(messageElement);
            elements.messages.input.value = '';
            this.scrollToBottom();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    },
    
    scrollToBottom() {
        elements.messages.container.scrollTop = elements.messages.container.scrollHeight;
    },
    
    setupListeners() {
        elements.messages.sendButton.addEventListener('click', () => this.sendMessage());
        elements.messages.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        elements.messages.backButton.addEventListener('click', () => {
            state.currentChat = null;
            utils.showSection('matches');
        });
    }
};

// Модальные окна
const modalHandlers = {
    setupListeners() {
        elements.modal.sendMessage.addEventListener('click', () => {
            elements.modal.match.classList.add('hidden');
            utils.showSection('messages');
            messageHandlers.openChat(state.currentProfile);
        });
        
        elements.modal.keepSwiping.addEventListener('click', () => {
            elements.modal.match.classList.add('hidden');
            searchHandlers.loadNextProfile();
        });
    }
};

// Инициализация приложения
function initApp() {
    const webApp = initTelegramWebApp();
    const user = getTelegramUser();
    
    if (user) {
        state.currentUser = {
            id: user.id,
            name: user.first_name,
            photo: user.photo_url
        };
    }
    
    // Настраиваем обработчики навигации
    elements.navigation.forEach(item => {
        item.addEventListener('click', () => {
            const pageId = item.getAttribute('data-page');
            if (pageId) showPage(pageId);
        });
    });
    
    // Настраиваем обработчики кнопок действий
    if (elements.cards.likeButton) {
        elements.cards.likeButton.addEventListener('click', () => handleAction('like'));
    }
    if (elements.cards.dislikeButton) {
        elements.cards.dislikeButton.addEventListener('click', () => handleAction('dislike'));
    }
    if (elements.cards.superlikeButton) {
        elements.cards.superlikeButton.addEventListener('click', () => handleAction('superlike'));
    }
    
    // Загружаем первый профиль
    loadNextProfile();
}

// Запускаем приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);

// View updates
function updateProfileView() {
    if (!state.currentProfile) return;
    
    elements.profile.name.textContent = state.currentProfile.name;
    elements.profile.photo.src = state.currentProfile.photo || 'default-avatar.png';
    elements.profile.likesCount.textContent = state.currentProfile.likes || 0;
    elements.profile.matchesCount.textContent = state.currentProfile.matches || 0;
}

function updateMatchesView() {
    elements.matches.list.innerHTML = '';
    state.matches.forEach(match => {
        const matchCard = document.createElement('div');
        matchCard.className = 'match-card';
        matchCard.innerHTML = `
            <img src="${match.photo}" alt="${match.name}" class="match-photo">
            <div class="match-info">
                <h3>${match.name}, ${utils.formatAge(match.birthdate)}</h3>
                <p>${match.lastMessage || 'Начните общение!'}</p>
            </div>
            ${!match.messagesCount ? '<span class="new-badge">Новый</span>' : ''}
        `;
        
        matchCard.addEventListener('click', () => {
            state.currentChat = match.id;
            messageHandlers.openChat(match);
        });
        
        elements.matches.list.appendChild(matchCard);
    });
}

function appendMessage(message, isSent) {
    const messageElement = utils.createMessageElement(message, isSent);
    elements.messages.container.appendChild(messageElement);
    elements.messages.container.scrollTop = elements.messages.container.scrollHeight;
}

// Управление страницами
const pages = ['cards', 'profile', 'live', 'likes', 'matches'];
let currentPage = 'cards';

// Функции загрузки данных для страниц
async function loadPageData(pageId) {
    switch (pageId) {
        case 'cards':
            await loadMoreCards();
            break;
        case 'profile':
            await loadProfileData();
            break;
        case 'live':
            await loadLiveStreams();
            break;
        case 'likes':
            await loadLikes();
            break;
        case 'matches':
            await loadMatches();
            break;
    }
}

async function loadProfileData() {
    try {
        const response = await fetch('/api/profile');
        const profile = await response.json();
        
        const profileName = document.getElementById('profile-name');
        const profileBio = document.getElementById('profile-bio');
        const profileDetails = document.querySelector('.profile-details');
        
        if (profileName) profileName.textContent = profile.name;
        if (profileBio) profileBio.textContent = profile.bio || 'Расскажите о себе';
        if (profileDetails) {
            profileDetails.innerHTML = `
                <div class="profile-stat">
                    <span class="stat-value">${profile.likes || 0}</span>
                    <span class="stat-label">Лайков</span>
                </div>
                <div class="profile-stat">
                    <span class="stat-value">${profile.matches || 0}</span>
                    <span class="stat-label">Мэтчей</span>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

async function loadLiveStreams() {
    try {
        const response = await fetch('/api/live-streams');
        const streams = await response.json();
        
        const liveGrid = document.querySelector('.live-grid');
        if (!liveGrid) return;
        
        if (streams.length === 0) {
            liveGrid.innerHTML = `
                <div class="no-content">
                    <h3>Нет активных трансляций</h3>
                    <p>Попробуйте зайти позже</p>
                </div>
            `;
            return;
        }
        
        liveGrid.innerHTML = streams.map(stream => `
            <div class="live-card">
                <div class="live-preview">
                    <img src="${stream.thumbnail}" alt="${stream.title}">
                    <span class="live-badge">LIVE</span>
                    <span class="viewers-count">${stream.viewers} 👥</span>
                </div>
                <div class="live-info">
                    <img src="${stream.userPhoto}" alt="" class="user-avatar">
                    <div>
                        <h4>${stream.userName}</h4>
                        <p>${stream.title}</p>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading live streams:', error);
    }
}

async function loadLikes() {
    try {
        const response = await fetch('/api/likes');
        const likes = await response.json();
        
        const likesGrid = document.querySelector('.likes-grid');
        if (!likesGrid) return;
        
        if (likes.length === 0) {
            likesGrid.innerHTML = `
                <div class="no-content">
                    <h3>Пока нет лайков</h3>
                    <p>Продолжайте искать интересных людей</p>
                </div>
            `;
            return;
        }
        
        likesGrid.innerHTML = likes.map(like => `
            <div class="like-card">
                <img src="${like.photo}" alt="${like.name}" class="like-photo">
                <div class="like-info">
                    <h3>${like.name}, ${like.age}</h3>
                    <p>${like.bio || ''}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading likes:', error);
    }
}

async function loadMatches() {
    try {
        const response = await fetch('/api/matches');
        const matches = await response.json();
        
        const matchesGrid = document.querySelector('.matches-grid');
        if (!matchesGrid) return;
        
        if (matches.length === 0) {
            matchesGrid.innerHTML = `
                <div class="no-content">
                    <h3>Пока нет мэтчей</h3>
                    <p>Продолжайте искать интересных людей</p>
                </div>
            `;
            return;
        }
        
        matchesGrid.innerHTML = matches.map(match => `
            <div class="match-card" data-user-id="${match.userId}">
                <img src="${match.photo}" alt="${match.name}" class="match-photo">
                <div class="match-info">
                    <h3>${match.name}, ${match.age}</h3>
                    <p>${match.lastMessage || 'Начните общение!'}</p>
                </div>
                ${!match.hasMessages ? '<span class="new-badge">Новый</span>' : ''}
            </div>
        `).join('');
        
        // Добавляем обработчики для карточек мэтчей
        document.querySelectorAll('.match-card').forEach(card => {
            card.addEventListener('click', () => {
                const userId = card.dataset.userId;
                openChat(userId);
            });
        });
    } catch (error) {
        console.error('Error loading matches:', error);
    }
}

// Обновляем функцию showPage
function showPage(pageId) {
    // Скрыть все страницы
    pages.forEach(page => {
        document.getElementById(`${page}-page`).classList.remove('active');
        document.querySelector(`[data-page="${page}"]`).classList.remove('active');
    });
    
    // Показать выбранную страницу
    document.getElementById(`${pageId}-page`).classList.add('active');
    document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
    currentPage = pageId;
    
    // Загружаем данные для страницы
    loadPageData(pageId);
}

// Инициализация навигации
document.addEventListener('DOMContentLoaded', () => {
    // Настройка обработчиков для навигации
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const pageId = item.getAttribute('data-page');
            showPage(pageId);
        });
    });

    // Показать начальную страницу
    showPage('cards');
});

// Управление карточками
let currentCardIndex = 0;
const cards = []; // Здесь будут храниться данные карточек

function showNextCard() {
    if (currentCardIndex >= cards.length - 1) {
        // Загрузить новые карточки
        loadMoreCards();
        return;
    }
    
    currentCardIndex++;
    updateCardDisplay();
}

function handleLike() {
    const currentCard = cards[currentCardIndex];
    // Отправить лайк на сервер
    fetch('/api/like', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: currentCard.userId,
            action: 'like'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.isMatch) {
            showMatch(currentCard);
        }
        showNextCard();
    })
    .catch(error => console.error('Error:', error));
}

function handleDislike() {
    const currentCard = cards[currentCardIndex];
    // Отправить дизлайк на сервер
    fetch('/api/like', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: currentCard.userId,
            action: 'dislike'
        })
    })
    .then(() => showNextCard())
    .catch(error => console.error('Error:', error));
}

function handleSuperlike() {
    const currentCard = cards[currentCardIndex];
    // Отправить суперлайк на сервер
    fetch('/api/like', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: currentCard.userId,
            action: 'superlike'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.isMatch) {
            showMatch(currentCard);
        }
        showNextCard();
    })
    .catch(error => console.error('Error:', error));
}

function showMatch(matchedUser) {
    // Показать уведомление о метче
    const matchNotification = document.createElement('div');
    matchNotification.classList.add('match-notification');
    matchNotification.innerHTML = `
        <h3>Это взаимно!</h3>
        <p>Вы понравились ${matchedUser.name}</p>
        <button onclick="startChat(${matchedUser.userId})">Начать общение</button>
    `;
    document.body.appendChild(matchNotification);
    
    setTimeout(() => {
        matchNotification.remove();
    }, 5000);
}

function startChat(userId) {
    // Переключиться на страницу чатов и открыть чат с пользователем
    showPage('matches');
    // TODO: Открыть чат с конкретным пользователем
}

function loadMoreCards() {
    fetch('/api/cards')
        .then(response => response.json())
        .then(data => {
            cards.push(...data);
            currentCardIndex = 0;
            updateCardDisplay();
        })
        .catch(error => console.error('Error:', error));
}

function updateCardDisplay() {
    const currentCard = cards[currentCardIndex];
    if (!currentCard) return;
    
    const cardElement = document.querySelector('.profile-card');
    cardElement.innerHTML = `
        <div class="photo-container">
            <img src="${currentCard.photo}" alt="${currentCard.name}">
            <div class="profile-info-overlay">
                <h3>${currentCard.name}, ${currentCard.age}</h3>
                <p>${currentCard.bio}</p>
            </div>
        </div>
    `;
}

// Инициализация карточек при загрузке
document.addEventListener('DOMContentLoaded', () => {
    loadMoreCards();
    
    // Настройка обработчиков для кнопок действий
    document.getElementById('like-button').addEventListener('click', handleLike);
    document.getElementById('dislike-button').addEventListener('click', handleDislike);
    document.getElementById('superlike-button').addEventListener('click', handleSuperlike);
});