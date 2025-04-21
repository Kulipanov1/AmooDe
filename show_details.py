import sqlite3

def show_full_info():
    try:
        conn = sqlite3.connect('dating_bot.db')
        c = conn.cursor()
        
        # 1. Полная информация о профилях
        print("\n=== ПРОФИЛИ ПОЛЬЗОВАТЕЛЕЙ ===")
        print("----------------------------------------")
        c.execute('SELECT * FROM profiles')
        profiles = c.fetchall()
        
        if not profiles:
            print("Нет зарегистрированных пользователей")
        else:
            for profile in profiles:
                print(f"\nПрофиль пользователя:")
                print(f"ID: {profile[0]}")
                print(f"Имя: {profile[1]}")
                print(f"О себе: {profile[2]}")
                print(f"Возраст: {profile[3]}")
                print(f"Пол: {profile[4]}")
                print(f"ID фото: {profile[5]}")
                print(f"Ищет пол: {profile[6]}")
                print("----------------------------------------")
        
        # 2. Все лайки/дизлайки
        print("\n=== ЛАЙКИ И ДИЗЛАЙКИ ===")
        print("----------------------------------------")
        c.execute('''
            SELECT 
                p1.name as from_name,
                p2.name as to_name,
                m.status,
                p1.user_id as from_id,
                p2.user_id as to_id
            FROM matches m
            JOIN profiles p1 ON m.user1_id = p1.user_id
            JOIN profiles p2 ON m.user2_id = p2.user_id
        ''')
        matches = c.fetchall()
        
        if not matches:
            print("Нет лайков/дизлайков")
        else:
            for match in matches:
                status_emoji = "❤️" if match[2] == "like" else "👎"
                print(f"{match[0]} ({match[3]}) {status_emoji} -> {match[1]} ({match[4]})")
        
        # 3. Взаимные лайки
        print("\n=== ВЗАИМНЫЕ СИМПАТИИ ===")
        print("----------------------------------------")
        c.execute('''
            SELECT 
                p1.name as user1_name,
                p2.name as user2_name,
                p1.user_id as user1_id,
                p2.user_id as user2_id
            FROM matches m1
            JOIN matches m2 ON m1.user1_id = m2.user2_id AND m1.user2_id = m2.user1_id
            JOIN profiles p1 ON m1.user1_id = p1.user_id
            JOIN profiles p2 ON m1.user2_id = p2.user_id
            WHERE m1.status = 'like' AND m2.status = 'like'
        ''')
        mutual = c.fetchall()
        
        if not mutual:
            print("Нет взаимных симпатий")
        else:
            for pair in mutual:
                print(f"{pair[0]} ({pair[2]}) ❤️ {pair[1]} ({pair[3]})")
        
        # 4. Сообщения
        print("\n=== СООБЩЕНИЯ ===")
        print("----------------------------------------")
        c.execute('''
            SELECT 
                p1.name as from_name,
                p2.name as to_name,
                m.message,
                m.timestamp,
                p1.user_id as from_id,
                p2.user_id as to_id
            FROM messages m
            JOIN profiles p1 ON m.sender_id = p1.user_id
            JOIN profiles p2 ON m.receiver_id = p2.user_id
            ORDER BY m.timestamp
        ''')
        messages = c.fetchall()
        
        if not messages:
            print("Нет сообщений")
        else:
            for msg in messages:
                print(f"\nОт: {msg[0]} ({msg[4]})")
                print(f"Кому: {msg[1]} ({msg[5]})")
                print(f"Время: {msg[3]}")
                print(f"Сообщение: {msg[2]}")
                print("----------------------------------------")
        
    except sqlite3.Error as e:
        print(f"Ошибка при работе с базой данных: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    show_full_info() 