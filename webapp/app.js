// Инициализация Telegram Web App
const webApp = window.Telegram.WebApp;
webApp.ready();
webApp.expand();

// Получение данных пользователя
const user = webApp.initDataUnsafe.user;
let currentProfile = null;

// Функции для работы с профилями
async function loadProfile() {
    try {
        const response = await fetch('/api/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: user.id
            })
        });
        const data = await response.json();
        displayProfile(data);
    } catch (error) {
        console.error('Error loading profile:', error);
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
        if (data) {
            currentProfile = data;
            displayProfileCard(data);
        } else {
            document.getElementById('profile-card').classList.add('hidden');
        }
    } catch (error) {
        console.error('Error loading next profile:', error);
    }
}

async function handleLike() {
    if (!currentProfile) return;
    
    try {
        await fetch('/api/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: user.id,
                target_id: currentProfile.user_id
            })
        });
        loadNextProfile();
    } catch (error) {
        console.error('Error liking profile:', error);
    }
}

async function handleDislike() {
    if (!currentProfile) return;
    
    try {
        await fetch('/api/dislike', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: user.id,
                target_id: currentProfile.user_id
            })
        });
        loadNextProfile();
    } catch (error) {
        console.error('Error disliking profile:', error);
    }
}

// Функции отображения
function displayProfile(profile) {
    const profileInfo = document.getElementById('profile-info');
    profileInfo.innerHTML = `
        <p><strong>Имя:</strong> ${profile.name}</p>
        <p><strong>Возраст:</strong> ${profile.age}</p>
        <p><strong>О себе:</strong> ${profile.bio}</p>
    `;
}

function displayProfileCard(profile) {
    const card = document.getElementById('profile-card');
    card.classList.remove('hidden');
    
    document.getElementById('profile-photo').src = profile.photo_url;
    document.getElementById('profile-name').textContent = profile.name;
    document.getElementById('profile-age').textContent = `${profile.age} лет`;
    document.getElementById('profile-bio').textContent = profile.bio;
}

// Обработчики событий
document.getElementById('like').addEventListener('click', handleLike);
document.getElementById('dislike').addEventListener('click', handleDislike);
document.getElementById('edit-profile').addEventListener('click', () => {
    webApp.close();
});

// Загрузка начальных данных
loadProfile();
loadNextProfile(); 