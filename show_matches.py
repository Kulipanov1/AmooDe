import sqlite3

def show_matches():
    try:
        conn = sqlite3.connect('dating_bot.db')
        c = conn.cursor()
        
        # Получаем все совпадения с именами пользователей
        c.execute('''
            SELECT 
                p1.name as user1_name,
                p2.name as user2_name,
                m.status
            FROM matches m
            JOIN profiles p1 ON m.user1_id = p1.user_id
            JOIN profiles p2 ON m.user2_id = p2.user_id
        ''')
        matches = c.fetchall()
        
        if not matches:
            print("В базе данных пока нет совпадений между пользователями.")
            return
            
        print("\nСписок всех взаимодействий между пользователями:")
        print("------------------------------------------------")
        print("Кто | Кому | Статус")
        print("------------------------------------------------")
        
        for match in matches:
            user1_name, user2_name, status = match
            print(f"{user1_name} | {user2_name} | {status}")
            
        print("------------------------------------------------")
        print(f"Всего взаимодействий: {len(matches)}")
        
        # Проверяем взаимные лайки
        c.execute('''
            SELECT 
                p1.name as user1_name,
                p2.name as user2_name
            FROM matches m1
            JOIN matches m2 ON m1.user1_id = m2.user2_id AND m1.user2_id = m2.user1_id
            JOIN profiles p1 ON m1.user1_id = p1.user_id
            JOIN profiles p2 ON m1.user2_id = p2.user_id
            WHERE m1.status = 'like' AND m2.status = 'like'
        ''')
        mutual_likes = c.fetchall()
        
        if mutual_likes:
            print("\nВзаимные симпатии:")
            print("------------------------------------------------")
            for pair in mutual_likes:
                print(f"{pair[0]} ❤️ {pair[1]}")
        
    except sqlite3.Error as e:
        print(f"Ошибка при работе с базой данных: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    show_matches() 