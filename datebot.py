import logging
import sqlite3
from telegram import Update, ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    ConversationHandler,
    CallbackQueryHandler,
    filters,
    ContextTypes,
)
import json
from dotenv import load_dotenv
import os
import asyncio

# Загружаем переменные окружения
load_dotenv()

# Включаем логирование
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)

class DatabaseConnection:
    def __init__(self):
        self.connection = None

    def __enter__(self):
        self.connection = sqlite3.connect('dating_bot.db')
        return self.connection

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.connection:
            self.connection.commit()
            self.connection.close()

def init_db():
    """Инициализация базы данных."""
    with DatabaseConnection() as conn:
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS profiles
                     (user_id INTEGER PRIMARY KEY,
                      name TEXT,
                      bio TEXT,
                      age INTEGER,
                      gender TEXT,
                      photo_id TEXT,
                      search_gender TEXT DEFAULT 'all')''')
        c.execute('''CREATE TABLE IF NOT EXISTS matches
                     (user1_id INTEGER,
                      user2_id INTEGER,
                      status TEXT,
                      PRIMARY KEY (user1_id, user2_id))''')
        c.execute('''CREATE TABLE IF NOT EXISTS messages
                     (sender_id INTEGER,
                      receiver_id INTEGER,
                      message TEXT,
                      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')

# Состояния диалога
MENU, REGISTER_NAME, REGISTER_AGE, REGISTER_BIO, REGISTER_GENDER, REGISTER_PHOTO, SEARCH, SETTINGS, MATCHES, CHAT = range(10)

def main_menu_keyboard():
    """Создаем клавиатуру главного меню."""
    keyboard = [
        ["🔍 Поиск людей"],
        ["💌 Мои пары"],
        ["⚙️ Настройки поиска"],
        ["👤 Мой профиль"],
        ["📊 Статистика"],
        ["🌐 Открыть веб-приложение"],
        ["✏️ Редактировать профиль"]
    ]
    return ReplyKeyboardMarkup(keyboard, resize_keyboard=True)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Начало диалога и запрос информации профиля."""
    try:
        user = update.effective_user
        logger.info(f"User {user.id} ({user.first_name}) started the bot")
        
        await update.message.reply_text(
            f"👋 Добро пожаловать, {user.first_name}, в Dating Bot!\n\n"
            "Давайте создадим ваш профиль для знакомств.\n"
            "Как вас зовут?"
        )
        return REGISTER_NAME
    except Exception as e:
        logger.error(f"Error in start command: {e}")
        await update.message.reply_text(
            "Произошла ошибка при запуске бота. Пожалуйста, попробуйте еще раз через минуту."
        )
        return ConversationHandler.END

async def profile_name(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Сохраняем имя и запрашиваем описание."""
    name = update.message.text.strip()
    
    if not name or len(name) < 2:
        await update.message.reply_text(
            "⚠️ Имя должно содержать минимум 2 символа.\n"
            "Пожалуйста, введите ваше имя:"
        )
        return REGISTER_NAME
        
    context.user_data['name'] = name
    await update.message.reply_text(
        "✨ Отлично! Теперь расскажите немного о себе:\n"
        "(Ваши увлечения, интересы, чем занимаетесь)"
    )
    return REGISTER_BIO

async def profile_bio(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Сохраняем описание и запрашиваем возраст."""
    bio = update.message.text.strip()
    
    if not bio or len(bio) < 10:
        await update.message.reply_text(
            "⚠️ Описание должно содержать минимум 10 символов.\n"
            "Расскажите о себе подробнее:"
        )
        return REGISTER_BIO
        
    context.user_data['bio'] = bio
    await update.message.reply_text(
        "📅 Сколько вам лет?\n"
        "Введите число от 18 до 99:"
    )
    return REGISTER_AGE

async def profile_age(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Сохраняем возраст и запрашиваем пол."""
    try:
        age = int(update.message.text)
        if age < 18 or age > 100:
            await update.message.reply_text("⚠️ Пожалуйста, введите корректный возраст (18-100):")
            return REGISTER_AGE
        
        context.user_data['age'] = age
        keyboard = [
            [KeyboardButton("👨 Мужской"), KeyboardButton("👩 Женский")]
        ]
        reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
        await update.message.reply_text(
            "👤 Укажите ваш пол:",
            reply_markup=reply_markup
        )
        return REGISTER_GENDER
    except ValueError:
        await update.message.reply_text("⚠️ Пожалуйста, введите число:")
        return REGISTER_AGE

async def profile_gender(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Сохраняем пол и запрашиваем фото."""
    gender = update.message.text.lower()
    if "мужской" not in gender and "женский" not in gender:
        await update.message.reply_text(
            "⚠️ Пожалуйста, выберите пол, используя кнопки:"
        )
        return REGISTER_GENDER
    
    context.user_data['gender'] = "мужской" if "мужской" in gender else "женский"
    
    await update.message.reply_text(
        "📸 Отправьте свою фотографию\n"
        "Это поможет другим пользователям лучше узнать вас!"
    )
    return REGISTER_PHOTO

async def search_gender_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Сохраняем предпочитаемый пол и запрашиваем фото."""
    search_gender = update.message.text.lower()
    if "мужской" in search_gender:
        context.user_data['search_gender'] = "мужской"
    elif "женский" in search_gender:
        context.user_data['search_gender'] = "женский"
    else:
        context.user_data['search_gender'] = "all"
    
    await update.message.reply_text(
        "📸 Отправьте свою фотографию\n"
        "Это поможет другим пользователям лучше узнать вас!"
    )
    return REGISTER_PHOTO

async def save_profile(user_id, name, bio, age, gender, photo_id, search_gender):
    with DatabaseConnection() as conn:
        c = conn.cursor()
        c.execute('''INSERT OR REPLACE INTO profiles 
                     (user_id, name, bio, age, gender, photo_id, search_gender) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)''',
                  (user_id, name, bio, age, gender, photo_id, search_gender))

async def get_random_profile(user_id):
    """Получаем случайный профиль с учетом предпочтений по полу."""
    with DatabaseConnection() as conn:
        c = conn.cursor()
        
        # Получаем предпочтения пользователя
        c.execute('SELECT search_gender FROM profiles WHERE user_id = ?', (user_id,))
        result = c.fetchone()
        if not result:
            return None
            
        search_gender = result[0]
        
        # Формируем запрос с учетом предпочтений
        if search_gender != 'all':
            c.execute('''SELECT * FROM profiles 
                         WHERE user_id != ? 
                         AND user_id NOT IN (SELECT user2_id FROM matches WHERE user1_id = ?)
                         AND gender = ?
                         ORDER BY RANDOM() LIMIT 1''', (user_id, user_id, search_gender))
        else:
            c.execute('''SELECT * FROM profiles 
                         WHERE user_id != ? 
                         AND user_id NOT IN (SELECT user2_id FROM matches WHERE user1_id = ?)
                         ORDER BY RANDOM() LIMIT 1''', (user_id, user_id))
        
        return c.fetchone()

async def profile_photo(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Сохраняем фото и показываем главное меню."""
    if not update.message.photo:
        await update.message.reply_text(
            "⚠️ Пожалуйста, отправьте фотографию.\n"
            "Это поможет другим пользователям лучше узнать вас!"
        )
        return REGISTER_PHOTO
        
    # Проверяем наличие всех необходимых данных
    required_fields = ['name', 'bio', 'age', 'gender']
    missing_fields = [field for field in required_fields if field not in context.user_data]
    
    if missing_fields:
        await update.message.reply_text(
            "❌ Ошибка: отсутствуют некоторые данные профиля.\n"
            "Пожалуйста, начните создание профиля заново с помощью команды /start"
        )
        return ConversationHandler.END
        
    photo_id = update.message.photo[-1].file_id
    
    try:
        # Сохраняем профиль в базу данных
        await save_profile(
            update.effective_user.id,
            context.user_data['name'],
            context.user_data['bio'],
            context.user_data['age'],
            context.user_data['gender'],
            photo_id,
            context.user_data.get('search_gender', 'all')
        )
        
        await update.message.reply_text(
            "✅ Отлично! Ваш профиль создан!\n\n"
            "Теперь вы можете:\n"
            "🔍 Искать новые знакомства\n"
            "💌 Просматривать свои пары\n"
            "⚙️ Настроить поиск\n"
            "✏️ Редактировать профиль",
            reply_markup=main_menu_keyboard()
        )
        return MENU
    except Exception as e:
        logger.error(f"Error saving profile: {e}")
        await update.message.reply_text(
            "❌ Произошла ошибка при сохранении профиля.\n"
            "Пожалуйста, попробуйте еще раз позже."
        )
        return ConversationHandler.END

async def show_profile(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Показываем случайный профиль для свайпов."""
    user_id = update.effective_user.id
    profile = await get_random_profile(user_id)
    
    if not profile:
        await update.message.reply_text(
            "😔 К сожалению, пока нет доступных профилей для просмотра.\n"
            "Попробуйте позже!"
        )
        return
    
    keyboard = [
        [
            InlineKeyboardButton("👎", callback_data=f"dislike_{profile[0]}"),
            InlineKeyboardButton("❤️", callback_data=f"like_{profile[0]}"),
        ]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_photo(
        profile[5],  # photo_id
        caption=f"👤 {profile[1]}, {profile[3]}\n\n"  # name, age
                f"📝 {profile[2]}",  # bio
        reply_markup=reply_markup
    )

async def get_matches(user_id):
    """Получаем список взаимных пар пользователя."""
    with DatabaseConnection() as conn:
        c = conn.cursor()
        c.execute('''
            SELECT p.* FROM profiles p
            INNER JOIN matches m1 ON p.user_id = m1.user2_id
            INNER JOIN matches m2 ON m1.user2_id = m2.user1_id
            WHERE m1.user1_id = ? AND m2.user2_id = ?
            AND m1.status = 'like' AND m2.status = 'like'
        ''', (user_id, user_id))
        matches = c.fetchall()
    return matches

async def show_matches(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Показывает список мэтчей пользователя."""
    user_id = update.effective_user.id
    matches = await get_matches(user_id)
    
    if not matches:
        keyboard = [[KeyboardButton("↩️ Вернуться в главное меню")]]
        reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
        await update.message.reply_text(
            "😔 У вас пока нет взаимных симпатий.\n"
            "Продолжайте искать, и они обязательно появятся!",
            reply_markup=reply_markup
        )
    else:
        keyboard = []
        for match in matches:
            keyboard.append([KeyboardButton(f"💌 Чат с {match[1]}")])  # match[1] это имя
        keyboard.append([KeyboardButton("↩️ Вернуться в главное меню")])
        reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
        
        matches_text = "💌 Ваши пары:\n\n"
        for match in matches:
            matches_text += f"👤 {match[1]}, {match[3]}\n"  # Имя и возраст
        
        await update.message.reply_text(matches_text, reply_markup=reply_markup)
    
    return MATCHES

async def handle_like_dislike(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Обработка лайков и дизлайков."""
    query = update.callback_query
    await query.answer()  # Сразу отвечаем на callback, чтобы не было зависания
    
    if query.data == "return_menu":
        await query.message.reply_text(
            "Вы вернулись в главное меню",
            reply_markup=main_menu_keyboard()
        )
        return MENU
        
    action, target_user_id = query.data.split('_')
    user_id = update.effective_user.id
    
    try:
        # Преобразуем action в нужный формат
        status = "like" if action == "like" else "dislike"
        success = await save_match(user_id, int(target_user_id), status)
        
        if not success:
            await query.message.reply_text(
                "❌ Произошла ошибка при сохранении выбора. Попробуйте еще раз.",
                reply_markup=main_menu_keyboard()
            )
            return MENU
        
        if status == "like":
            # Проверяем взаимный лайк
            with DatabaseConnection() as conn:
                c = conn.cursor()
                c.execute('SELECT status FROM matches WHERE user1_id = ? AND user2_id = ?',
                         (int(target_user_id), user_id))
                match = c.fetchone()
            
            if match and match[0] == "like":
                await query.message.reply_text(
                    "🎉 У вас взаимная симпатия! Начинайте общение!"
                )
        
        # Показываем следующий профиль
        profile = await get_random_profile(user_id)
        
        if not profile:
            await query.message.reply_text(
                "😔 К сожалению, пока нет доступных профилей для просмотра.\n"
                "Попробуйте позже!",
                reply_markup=main_menu_keyboard()
            )
            return MENU
        
        keyboard = [
            [
                InlineKeyboardButton("👎", callback_data=f"dislike_{profile[0]}"),
                InlineKeyboardButton("❤️", callback_data=f"like_{profile[0]}"),
            ],
            [InlineKeyboardButton("↩️ В меню", callback_data="return_menu")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await query.message.reply_photo(
            profile[5],  # photo_id
            caption=f"👤 {profile[1]}, {profile[3]}\n\n"  # name, age
                    f"📝 {profile[2]}",  # bio
            reply_markup=reply_markup
        )
        return SEARCH
        
    except Exception as e:
        logger.error(f"Error in handle_like_dislike: {e}")
        await query.message.reply_text(
            "❌ Произошла ошибка. Попробуйте еще раз.",
            reply_markup=main_menu_keyboard()
        )
        return MENU

async def settings_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Обработчик настроек поиска."""
    keyboard = [
        [KeyboardButton("🔄 Изменить пол для поиска")],
        [KeyboardButton("↩️ Вернуться в главное меню")]
    ]
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    
    await update.message.reply_text(
        "⚙️ Настройки поиска\n\n"
        "Выберите, что хотите настроить:",
        reply_markup=reply_markup
    )
    return SETTINGS

async def update_search_preferences(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Обновляем предпочтения поиска."""
    text = update.message.text.lower()
    user_id = update.effective_user.id
    
    if "назад" in text:
        await update.message.reply_text(
            "Вернулись в главное меню",
            reply_markup=main_menu_keyboard()
        )
        return MENU
    
    search_gender = "мужской" if "парней" in text else "женский" if "девушек" in text else "all"
    
    with DatabaseConnection() as conn:
        c = conn.cursor()
        c.execute('UPDATE profiles SET search_gender = ? WHERE user_id = ?', (search_gender, user_id))
    
    await update.message.reply_text(
        "✅ Настройки поиска обновлены!",
        reply_markup=main_menu_keyboard()
    )
    return MENU

async def save_message(sender_id, receiver_id, message):
    """Сохраняем сообщение в базу данных."""
    with DatabaseConnection() as conn:
        c = conn.cursor()
        c.execute('INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
                  (sender_id, receiver_id, message))

async def start_chat(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Начинаем чат с пользователем."""
    user_id = update.effective_user.id
    match_id = int(context.user_data.get('current_chat', 0))
    
    if not match_id:
        await update.message.reply_text(
            "❌ Ошибка: собеседник не выбран",
            reply_markup=main_menu_keyboard()
        )
        return MENU
    
    message = update.message.text
    if message == "↩️ Закончить чат":
        await update.message.reply_text(
            "Чат завершен",
            reply_markup=main_menu_keyboard()
        )
        return MENU
    
    await save_message(user_id, match_id, message)
    
    # Отправляем сообщение собеседнику через бота
    with DatabaseConnection() as conn:
        c = conn.cursor()
        c.execute('SELECT name FROM profiles WHERE user_id = ?', (user_id,))
        sender_name = c.fetchone()[0]
    
    await context.bot.send_message(
        chat_id=match_id,
        text=f"💌 Сообщение от {sender_name}:\n{message}"
    )
    
    return CHAT

async def handle_chat_button(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Обработчик кнопок чата."""
    text = update.message.text
    
    if text == "↩️ Вернуться в главное меню":
        return await handle_main_menu(update, context)
    
    if text.startswith("💌 Чат с "):
        target_name = text.replace("💌 Чат с ", "")
        with DatabaseConnection() as conn:
            c = conn.cursor()
            
            # Получаем ID пользователя по имени
            c.execute('SELECT user_id FROM profiles WHERE name = ?', (target_name,))
            result = c.fetchone()
        
        if result:
            target_id = result[0]
            context.user_data['chat_with'] = target_id
            keyboard = [[KeyboardButton("↩️ Вернуться к списку пар")]]
            reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
            
            await update.message.reply_text(
                f"💌 Чат с {target_name}\n"
                "Отправьте сообщение или вернитесь к списку пар.",
                reply_markup=reply_markup
            )
            return CHAT
    
    return MATCHES

async def handle_main_menu(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработчик главного меню."""
    query = update.message.text
    
    if "🔍 Поиск людей" in query:
        profile = await get_random_profile(update.effective_user.id)
        if profile:
            keyboard = [
                [
                    InlineKeyboardButton("👎 Пропустить", callback_data="dislike"),
                    InlineKeyboardButton("❤️ Нравится", callback_data="like")
                ]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            caption = f"👤 {profile[1]}, {profile[3]}\n\n{profile[2]}"
            await update.message.reply_photo(
                photo=profile[5],
                caption=caption,
                reply_markup=reply_markup
            )
        else:
            await update.message.reply_text(
                "😔 К сожалению, сейчас нет доступных профилей.\n"
                "Попробуйте позже!"
            )
    
    elif "💌 Мои пары" in query:
        await show_matches(update, context)
    
    elif "⚙️ Настройки поиска" in query:
        await settings_handler(update, context)
    
    elif "👤 Мой профиль" in query:
        await show_my_profile(update, context)
    
    elif "📊 Статистика" in query:
        await show_statistics(update, context)
    
    elif "🌐 Открыть веб-приложение" in query:
        # Создаем кнопку для открытия веб-приложения
        webapp_url = os.getenv('WEBAPP_URL', 'http://localhost:5000')
        keyboard = [[InlineKeyboardButton("🌐 Открыть веб-приложение", web_app=WebAppInfo(url=webapp_url))]]
        reply_markup = InlineKeyboardMarkup(keyboard)
        await update.message.reply_text(
            "Нажмите на кнопку ниже, чтобы открыть веб-приложение:",
            reply_markup=reply_markup
        )
    
    elif "✏️ Редактировать профиль" in query:
        await update.message.reply_text(
            "Для редактирования профиля используйте команду /start"
        )

async def handle_chat_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Обработчик сообщений в чате."""
    text = update.message.text
    user_id = update.effective_user.id
    
    if text == "↩️ Вернуться к списку пар":
        del context.user_data['chat_with']
        return await show_matches(update, context)
    
    if 'chat_with' in context.user_data:
        receiver_id = context.user_data['chat_with']
        
        # Сохраняем сообщение в базу
        await save_message(user_id, receiver_id, text)
        
        # Получаем имя получателя для подтверждения
        with DatabaseConnection() as conn:
            c = conn.cursor()
            c.execute('SELECT name FROM profiles WHERE user_id = ?', (receiver_id,))
            receiver_name = c.fetchone()[0]
        
        # Отправляем сообщение получателю
        try:
            await context.bot.send_message(
                chat_id=receiver_id,
                text=f"💌 Новое сообщение:\n\n{text}"
            )
            await update.message.reply_text("✅ Сообщение отправлено!")
        except Exception as e:
            await update.message.reply_text("❌ Не удалось отправить сообщение. Попробуйте позже.")
            
        return CHAT
    
    return await show_matches(update, context)

async def search(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Показываем случайный профиль для поиска."""
    profile = await get_random_profile(update.effective_user.id)
    
    if not profile:
        await update.message.reply_text(
            "😔 К сожалению, пока нет доступных профилей для просмотра.\n"
            "Попробуйте позже!"
        )
        return MENU
    
    keyboard = [
        [
            InlineKeyboardButton("👎", callback_data=f"dislike_{profile[0]}"),
            InlineKeyboardButton("❤️", callback_data=f"like_{profile[0]}")
        ],
        [InlineKeyboardButton("↩️ В меню", callback_data="return_menu")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_photo(
        profile[5],  # photo_id
        caption=f"👤 {profile[1]}, {profile[3]}\n\n"  # name, age
                f"📝 {profile[2]}",  # bio
        reply_markup=reply_markup
    )
    return SEARCH

async def dislike_profile(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Обработка дизлайка профиля."""
    user_id = update.effective_user.id
    await save_match(user_id, context.user_data.get('current_profile_id'), "dislike")
    return await search(update, context)

async def return_to_menu(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Возврат в главное меню."""
    await update.message.reply_text(
        "Вы вернулись в главное меню",
        reply_markup=main_menu_keyboard()
    )
    return MENU

async def change_search_gender(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Изменение пола для поиска."""
    keyboard = [
        [KeyboardButton("👨 Искать парней")],
        [KeyboardButton("👩 Искать девушек")],
        [KeyboardButton("🌈 Искать всех")],
        [KeyboardButton("↩️ Назад")]
    ]
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    
    await update.message.reply_text(
        "Выберите, кого вы хотите искать:",
        reply_markup=reply_markup
    )
    return SETTINGS

async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Отмена текущего действия и возврат в главное меню."""
    await update.message.reply_text(
        "Действие отменено. Вы вернулись в главное меню.",
        reply_markup=main_menu_keyboard()
    )
    return MENU

async def save_match(user1_id, user2_id, status):
    """Сохраняем результат свайпа в базу данных."""
    try:
        with DatabaseConnection() as conn:
            c = conn.cursor()
            # Проверяем, существует ли уже такая запись
            c.execute('SELECT status FROM matches WHERE user1_id = ? AND user2_id = ?', 
                     (user1_id, user2_id))
            existing = c.fetchone()
            
            if existing:
                # Обновляем существующую запись
                c.execute('''UPDATE matches 
                           SET status = ? 
                           WHERE user1_id = ? AND user2_id = ?''', 
                         (status, user1_id, user2_id))
            else:
                # Создаем новую запись
                c.execute('''INSERT INTO matches (user1_id, user2_id, status)
                           VALUES (?, ?, ?)''', (user1_id, user2_id, status))
            return True
    except Exception as e:
        logger.error(f"Error in save_match: {e}")
        return False

async def show_my_profile(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Показываем профиль пользователя."""
    user_id = update.effective_user.id
    
    with DatabaseConnection() as conn:
        c = conn.cursor()
        c.execute('SELECT * FROM profiles WHERE user_id = ?', (user_id,))
        profile = c.fetchone()
    
    if not profile:
        await update.message.reply_text(
            "❌ Профиль не найден. Пожалуйста, создайте профиль с помощью команды /start"
        )
        return
    
    await update.message.reply_photo(
        profile[5],  # photo_id
        caption=f"👤 Ваш профиль:\n\n"
                f"📝 Имя: {profile[1]}\n"
                f"📅 Возраст: {profile[3]}\n"
                f"👤 Пол: {profile[4]}\n"
                f"📖 О себе: {profile[2]}\n"
                f"🔍 Ищу: {profile[6]}",
        reply_markup=main_menu_keyboard()
    )

async def show_statistics(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Показываем статистику пользователя."""
    user_id = update.effective_user.id
    
    with DatabaseConnection() as conn:
        c = conn.cursor()
        
        # Получаем количество лайков от пользователя
        c.execute('SELECT COUNT(*) FROM matches WHERE user1_id = ? AND status = "like"', (user_id,))
        likes_given = c.fetchone()[0]
        
        # Получаем количество дизлайков от пользователя
        c.execute('SELECT COUNT(*) FROM matches WHERE user1_id = ? AND status = "dislike"', (user_id,))
        dislikes_given = c.fetchone()[0]
        
        # Получаем количество лайков пользователю
        c.execute('SELECT COUNT(*) FROM matches WHERE user2_id = ? AND status = "like"', (user_id,))
        likes_received = c.fetchone()[0]
        
        # Получаем количество взаимных симпатий
        c.execute('''
            SELECT COUNT(*) FROM matches m1
            JOIN matches m2 ON m1.user1_id = m2.user2_id AND m1.user2_id = m2.user1_id
            WHERE m1.user1_id = ? AND m1.status = "like" AND m2.status = "like"
        ''', (user_id,))
        mutual_likes = c.fetchone()[0]
        
        # Получаем количество сообщений
        c.execute('SELECT COUNT(*) FROM messages WHERE sender_id = ?', (user_id,))
        messages_sent = c.fetchone()[0]
        
        c.execute('SELECT COUNT(*) FROM messages WHERE receiver_id = ?', (user_id,))
        messages_received = c.fetchone()[0]
    
    stats_text = (
        f"📊 Ваша статистика:\n\n"
        f"❤️ Отправлено лайков: {likes_given}\n"
        f"👎 Отправлено дизлайков: {dislikes_given}\n"
        f"❤️ Получено лайков: {likes_received}\n"
        f"💕 Взаимных симпатий: {mutual_likes}\n"
        f"📨 Отправлено сообщений: {messages_sent}\n"
        f"📩 Получено сообщений: {messages_received}"
    )
    
    await update.message.reply_text(stats_text, reply_markup=main_menu_keyboard())

def main():
    """Запуск бота."""
    # Инициализация базы данных
    init_db()
    
    # Создание приложения
    application = Application.builder().token(os.getenv('TELEGRAM_BOT_TOKEN')).build()
    
    # Добавление обработчиков
    conv_handler = ConversationHandler(
        entry_points=[CommandHandler('start', start)],
        states={
            MENU: [
                MessageHandler(filters.Regex('^🔍 Поиск людей$'), search),
                MessageHandler(filters.Regex('^💌 Мои пары$'), show_matches),
                MessageHandler(filters.Regex('^⚙️ Настройки поиска$'), settings_handler),
                MessageHandler(filters.Regex('^👤 Мой профиль$'), show_my_profile),
                MessageHandler(filters.Regex('^📊 Статистика$'), show_statistics),
                MessageHandler(filters.Regex('^✏️ Редактировать профиль$'), start),
            ],
            REGISTER_NAME: [MessageHandler(filters.TEXT & ~filters.COMMAND, profile_name)],
            REGISTER_AGE: [MessageHandler(filters.TEXT & ~filters.COMMAND, profile_age)],
            REGISTER_BIO: [MessageHandler(filters.TEXT & ~filters.COMMAND, profile_bio)],
            REGISTER_GENDER: [MessageHandler(filters.TEXT & ~filters.COMMAND, profile_gender)],
            REGISTER_PHOTO: [MessageHandler(filters.PHOTO, profile_photo)],
            SEARCH: [
                CallbackQueryHandler(handle_like_dislike),
                MessageHandler(filters.Regex('^↩️ В меню$'), return_to_menu),
            ],
            SETTINGS: [
                MessageHandler(filters.Regex('^🔄 Изменить пол для поиска$'), change_search_gender),
                MessageHandler(filters.Regex('^(👨 Искать парней|👩 Искать девушек|🌈 Искать всех)$'), update_search_preferences),
                MessageHandler(filters.Regex('^↩️ Назад$'), return_to_menu),
            ],
            MATCHES: [
                MessageHandler(filters.Regex('^💌 Чат с .*$'), handle_chat_button),
                MessageHandler(filters.Regex('^↩️ Вернуться в главное меню$'), return_to_menu),
            ],
            CHAT: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, handle_chat_message),
            ],
        },
        fallbacks=[CommandHandler('cancel', cancel)],
    )
    
    application.add_handler(conv_handler)
    
    # Запуск бота
    print("Bot started...")
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nBot stopped by user")
    except Exception as e:
        print(f"Error occurred: {e}")
        raise