import sqlite3

def check_matches():
    try:
        conn = sqlite3.connect('dating_bot.db')
        c = conn.cursor()
        
        print("\n=== СОДЕРЖИМОЕ ТАБЛИЦЫ MATCHES ===")
        print("----------------------------------------")
        c.execute('SELECT * FROM matches')
        matches = c.fetchall()
        
        if not matches:
            print("Таблица matches пуста")
        else:
            print("USER1_ID | USER2_ID | STATUS")
            print("----------------------------------------")
            for match in matches:
                print(f"{match[0]} | {match[1]} | {match[2]}")
        
    except sqlite3.Error as e:
        print(f"Ошибка при работе с базой данных: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_matches() 