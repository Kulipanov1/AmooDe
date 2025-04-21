import sqlite3
import os
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv()

def init_db():
    """Инициализация базы данных"""
    try:
        # Подключаемся к базе данных (создаст файл, если его нет)
        conn = sqlite3.connect('dating_bot.db')
        
        # Читаем SQL-скрипт
        with open('init_db.sql', 'r') as f:
            sql_script = f.read()
        
        # Выполняем SQL-скрипт
        conn.executescript(sql_script)
        
        # Сохраняем изменения и закрываем соединение
        conn.commit()
        conn.close()
        print("База данных успешно инициализирована!")
        
    except Exception as e:
        print(f"Ошибка при инициализации базы данных: {e}")
        raise

if __name__ == "__main__":
    init_db() 