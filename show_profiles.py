import sqlite3

def show_profiles():
    try:
        conn = sqlite3.connect('dating_bot.db')
        c = conn.cursor()
        c.execute('SELECT user_id, name, age, gender, search_gender FROM profiles')
        profiles = c.fetchall()
        
        if not profiles:
            print("В базе данных пока нет зарегистрированных пользователей.")
            return
            
        print("\nСписок зарегистрированных пользователей:")
        print("----------------------------------------")
        print("ID | Имя | Возраст | Пол | Ищет")
        print("----------------------------------------")
        
        for profile in profiles:
            user_id, name, age, gender, search_gender = profile
            print(f"{user_id} | {name} | {age} | {gender} | {search_gender}")
            
        print("----------------------------------------")
        print(f"Всего пользователей: {len(profiles)}")
        
    except sqlite3.Error as e:
        print(f"Ошибка при работе с базой данных: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    show_profiles() 