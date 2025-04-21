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

# Включаем логирование
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)

# Инициализация базы данных
def init_db():
    conn = sqlite3.connect('dating_bot.db')
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
    conn.commit()
    conn.close()

# Состояния диалога
PROFILE, BIO, AGE, GENDER, SEARCH_GENDER, PHOTOS, CHAT, MAIN_MENU, NAME = range(9)

def main_menu_keyboard():
    """Создаем клавиатуру главного меню."""
    keyboard = [
        ["🔍 Поиск людей"],
        ["💌 Мои пары"],
        ["⚙️ Настройки поиска"],
        ["✏️ Редактировать профиль"],
        [KeyboardButton("🌐 Открыть веб-приложение", web_app=WebAppInfo(url="https://your-domain.com"))]
    ]
    return ReplyKeyboardMarkup(keyboard, resize_keyboard=True)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Начало диалога и запрос информации профиля."""
    await update.message.reply_text(
        "👋 Добро пожаловать в Dating Bot!\n\n"
        "Давайте создадим ваш профиль для знакомств.\n"
        "Как вас зовут?"
    )
    return NAME

async def profile_name(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Сохраняем имя и запрашиваем описание."""
    name = update.message.text.strip()
    
    if not name or len(name) < 2:
        await update.message.reply_text(
            "⚠️ Имя должно содержать минимум 2 символа.\n"
            "Пожалуйста, введите ваше имя:"
        )
        return NAME
        
    context.user_data['name'] = name
    await update.message.reply_text(
        "✨ Отлично! Теперь расскажите немного о себе:\n"
        "(Ваши увлечения, интересы, чем занимаетесь)"
    )
    return BIO

async def profile_bio(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Сохраняем описание и запрашиваем возраст."""
    bio = update.message.text.strip()
    
    if not bio or len(bio) < 10:
        await update.message.reply_text(
            "⚠️ Описание должно содержать минимум 10 символов.\n"
            "Расскажите о себе подробнее:"
        )
        return BIO
        
    context.user_data['bio'] = bio
    await update.message.reply_text(
        "📅 Сколько вам лет?\n"
        "Введите число от 18 до 99:"
    )
    return AGE

async def profile_age(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Сохраняем возраст и запрашиваем пол."""
    try:
        age = int(update.message.text)
        if age < 18 or age > 100:
            await update.message.reply_text("⚠️ Пожалуйста, введите корректный возраст (18-100):")
            return AGE
        
        context.user_data['age'] = age
        keyboard = [
            [KeyboardButton("👨 Мужской"), KeyboardButton("👩 Женский")]
        ]
        reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
        await update.message.reply_text(
            "👤 Укажите ваш пол:",
            reply_markup=reply_markup
        )
        return GENDER
    except ValueError:
        await update.message.reply_text("⚠️ Пожалуйста, введите число:")
        return AGE

async def profile_gender(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Сохраняем пол и запрашиваем предпочитаемый пол для поиска."""
    gender = update.message.text.lower()
    if "мужской" not in gender and "женский" not in gender:
        await update.message.reply_text(
            "⚠️ Пожалуйста, выберите пол, используя кнопки:"
        )
        return GENDER
    
    context.user_data['gender'] = gender
    
    keyboard = [
        [KeyboardButton("👨 Мужской"), KeyboardButton("👩 Женский"), KeyboardButton("🌈 Все")]
    ]
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    await update.message.reply_text(
        "🎯 Кого вы хотите найти?",
        reply_markup=reply_markup
    )
    return SEARCH_GENDER

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
    return PHOTOS

def save_profile(user_id, name, bio, age, gender, photo_id, search_gender):
    conn = sqlite3.connect('dating_bot.db')
    c = conn.cursor()
    c.execute('''INSERT OR REPLACE INTO profiles 
                 (user_id, name, bio, age, gender, photo_id, search_gender) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)''',
              (user_id, name, bio, age, gender, photo_id, search_gender))
    conn.commit()
    conn.close()

def get_random_profile(user_id):
    """Получаем случайный профиль с учетом предпочтений по полу."""
    conn = sqlite3.connect('dating_bot.db')
    c = conn.cursor()
    
    # Получаем предпочтения пользователя
    c.execute('SELECT search_gender FROM profiles WHERE user_id = ?', (user_id,))
    search_gender = c.fetchone()[0]
    
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
    
    profile = c.fetchone()
    conn.close()
    return profile

async def profile_photo(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Сохраняем фото и показываем главное меню."""
    if not update.message.photo:
        await update.message.reply_text(
            "⚠️ Пожалуйста, отправьте фотографию.\n"
            "Это поможет другим пользователям лучше узнать вас!"
        )
        return PHOTOS
        
    # Проверяем наличие всех необходимых данных
    required_fields = ['name', 'bio', 'age', 'gender']
    missing_fields = [field for field in required_fields if field not in context.user_data]
    
    if missing_fields:
        await update.message.reply_text(
            "❌ Ошибка: отсутствуют некоторые данные профиля.\n"
            "Пожалуйста, начните создание профиля заново с помощью команды /start"
        )
        return ConversationHandler.END
        
    photo_file = await update.message.photo[-1].get_file()
    photo_id = photo_file.file_id
    
    try:
        # Сохраняем профиль в базу данных
        save_profile(
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
        return MAIN_MENU
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
    profile = get_random_profile(user_id)
    
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

def get_matches(user_id):
    """Получаем список взаимных пар пользователя."""
    conn = sqlite3.connect('dating_bot.db')
    c = conn.cursor()
    c.execute('''
        SELECT p.* FROM profiles p
        INNER JOIN matches m1 ON p.user_id = m1.user2_id
        INNER JOIN matches m2 ON m1.user2_id = m2.user1_id
        WHERE m1.user1_id = ? AND m2.user2_id = ?
        AND m1.status = 'like' AND m2.status = 'like'
    ''', (user_id, user_id))
    matches = c.fetchall()
    conn.close()
    return matches

async def show_matches(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Показываем список взаимных пар."""
    user_id = update.effective_user.id
    matches = get_matches(user_id)
    
    if not matches:
        await update.message.reply_text(
            "😔 У вас пока нет взаимных симпатий.\n"
            "Продолжайте искать!"
        )
        return MAIN_MENU
    
    await update.message.reply_text("💌 Ваши пары:")
    
    for match in matches:
        keyboard = [[InlineKeyboardButton("💬 Начать чат", callback_data=f"chat_{match[0]}")]]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_photo(
            match[5],  # photo_id
            caption=f"👤 {match[1]}, {match[3]}\n\n"  # name, age
                    f"📝 {match[2]}",  # bio
            reply_markup=reply_markup
        )
    return MAIN_MENU

async def handle_like_dislike(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработка лайков и дизлайков."""
    query = update.callback_query
    action, target_user_id = query.data.split('_')
    user_id = update.effective_user.id
    
    try:
        if action == "like":
            save_match(user_id, int(target_user_id), "like")
            await query.answer("❤️ Вы поставили лайк!")
            
            # Проверяем взаимный лайк
            conn = sqlite3.connect('dating_bot.db')
            c = conn.cursor()
            c.execute('SELECT status FROM matches WHERE user1_id = ? AND user2_id = ?',
                     (int(target_user_id), user_id))
            match = c.fetchone()
            conn.close()
            
            if match and match[0] == "like":
                await query.message.reply_text(
                    "🎉 У вас взаимная симпатия! Начинайте общение!"
                )
        else:
            save_match(user_id, int(target_user_id), "dislike")
            await query.answer("👎 Вы поставили дизлайк")
        
        # Показываем следующий профиль
        profile = get_random_profile(user_id)
        
        if not profile:
            await query.message.reply_text(
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
        
        await query.message.reply_photo(
            profile[5],  # photo_id
            caption=f"👤 {profile[1]}, {profile[3]}\n\n"  # name, age
                    f"📝 {profile[2]}",  # bio
            reply_markup=reply_markup
        )
    except Exception as e:
        logger.error(f"Error in handle_like_dislike: {e}")
        await query.answer("Произошла ошибка. Попробуйте еще раз.")

async def settings_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработка настроек поиска."""
    keyboard = [
        [KeyboardButton("👨 Искать парней")],
        [KeyboardButton("👩 Искать девушек")],
        [KeyboardButton("🌈 Искать всех")],
        [KeyboardButton("↩️ Назад")]
    ]
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    await update.message.reply_text(
        "⚙️ Настройки поиска\n"
        "Выберите, кого вы хотите найти:",
        reply_markup=reply_markup
    )
    return SEARCH_GENDER

async def update_search_preferences(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Обновляем предпочтения поиска."""
    text = update.message.text.lower()
    user_id = update.effective_user.id
    
    if "назад" in text:
        await update.message.reply_text(
            "Вернулись в главное меню",
            reply_markup=main_menu_keyboard()
        )
        return MAIN_MENU
    
    search_gender = "мужской" if "парней" in text else "женский" if "девушек" in text else "all"
    
    conn = sqlite3.connect('dating_bot.db')
    c = conn.cursor()
    c.execute('UPDATE profiles SET search_gender = ? WHERE user_id = ?', (search_gender, user_id))
    conn.commit()
    conn.close()
    
    await update.message.reply_text(
        "✅ Настройки поиска обновлены!",
        reply_markup=main_menu_keyboard()
    )
    return MAIN_MENU

def save_message(sender_id, receiver_id, message):
    """Сохраняем сообщение в базу данных."""
    conn = sqlite3.connect('dating_bot.db')
    c = conn.cursor()
    c.execute('INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
              (sender_id, receiver_id, message))
    conn.commit()
    conn.close()

async def start_chat(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Начинаем чат с пользователем."""
    user_id = update.effective_user.id
    match_id = int(context.user_data.get('current_chat', 0))
    
    if not match_id:
        await update.message.reply_text(
            "❌ Ошибка: собеседник не выбран",
            reply_markup=main_menu_keyboard()
        )
        return MAIN_MENU
    
    message = update.message.text
    if message == "↩️ Закончить чат":
        await update.message.reply_text(
            "Чат завершен",
            reply_markup=main_menu_keyboard()
        )
        return MAIN_MENU
    
    save_message(user_id, match_id, message)
    
    # Отправляем сообщение собеседнику через бота
    conn = sqlite3.connect('dating_bot.db')
    c = conn.cursor()
    c.execute('SELECT name FROM profiles WHERE user_id = ?', (user_id,))
    sender_name = c.fetchone()[0]
    conn.close()
    
    context.bot.send_message(
        chat_id=match_id,
        text=f"💌 Сообщение от {sender_name}:\n{message}"
    )
    
    return CHAT

async def handle_chat_button(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Обработка нажатия кнопки начала чата."""
    query = update.callback_query
    action, match_id = query.data.split('_')
    
    if action == "chat":
        context.user_data['current_chat'] = match_id
        keyboard = [["↩️ Закончить чат"]]
        reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
        
        await query.message.reply_text(
            "💬 Чат начат! Отправьте сообщение.\n"
            "Нажмите 'Закончить чат' для возврата в меню.",
            reply_markup=reply_markup
        )
        return CHAT
    
    return MAIN_MENU

# Добавляем новые API эндпоинты для веб-приложения
async def handle_webapp_data(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработка данных из веб-приложения."""
    try:
        data = json.loads(update.message.web_app_data.data)
        user_id = update.effective_user.id
        
        if data.get('action') == 'like':
            target_id = data.get('target_id')
            save_match(user_id, target_id, 'like')
            await update.message.reply_text("❤️ Вы поставили лайк!")
        elif data.get('action') == 'dislike':
            target_id = data.get('target_id')
            save_match(user_id, target_id, 'dislike')
            await update.message.reply_text("👎 Вы пропустили профиль")
    except Exception as e:
        logger.error(f"Error handling webapp data: {e}")
        await update.message.reply_text("❌ Произошла ошибка при обработке данных")

def save_match(user1_id, user2_id, status):
    """Сохраняем лайк или дизлайк в базу данных."""
    conn = sqlite3.connect('dating_bot.db')
    c = conn.cursor()
    c.execute('''INSERT OR REPLACE INTO matches 
                 (user1_id, user2_id, status) 
                 VALUES (?, ?, ?)''',
              (user1_id, user2_id, status))
    conn.commit()
    conn.close()

def main() -> None:
    """Запуск бота."""
    # Инициализируем базу данных
    init_db()
    
    application = Application.builder().token("7172788867:AAE-a9VMys3vnw52Es5ej7s1ssQMkas8IzM").build()

    conv_handler = ConversationHandler(
        entry_points=[CommandHandler("start", start)],
        states={
            NAME: [MessageHandler(filters.TEXT & ~filters.COMMAND, profile_name)],
            BIO: [MessageHandler(filters.TEXT & ~filters.COMMAND, profile_bio)],
            AGE: [MessageHandler(filters.TEXT & ~filters.COMMAND, profile_age)],
            GENDER: [MessageHandler(filters.TEXT & ~filters.COMMAND, profile_gender)],
            SEARCH_GENDER: [MessageHandler(filters.TEXT & ~filters.COMMAND, search_gender_handler)],
            PHOTOS: [MessageHandler(filters.PHOTO | filters.TEXT, profile_photo)],
            MAIN_MENU: [
                MessageHandler(filters.Regex("^🔍 Поиск людей$"), show_profile),
                MessageHandler(filters.Regex("^💌 Мои пары$"), show_matches),
                MessageHandler(filters.Regex("^⚙️ Настройки поиска$"), settings_handler),
                MessageHandler(filters.Regex("^✏️ Редактировать профиль$"), start),
                MessageHandler(filters.StatusUpdate.WEB_APP_DATA, handle_webapp_data),
            ],
            CHAT: [MessageHandler(filters.TEXT & ~filters.COMMAND, start_chat)],
        },
        fallbacks=[CommandHandler("cancel", lambda u, c: ConversationHandler.END)],
    )

    application.add_handler(conv_handler)
    application.add_handler(CallbackQueryHandler(handle_like_dislike, pattern="^(like|dislike)_"))
    application.add_handler(CallbackQueryHandler(handle_chat_button, pattern="^chat_"))
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()