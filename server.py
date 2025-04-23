from flask import Flask, render_template, request, jsonify, send_from_directory
from dotenv import load_dotenv
import sqlite3
import os

# Загружаем переменные окружения
load_dotenv()

app = Flask(__name__, 
    static_folder='static',
    template_folder='templates'
)

def get_db_connection():
    """Создаем подключение к базе данных"""
    conn = sqlite3.connect('dating_bot.db')
    conn.row_factory = sqlite3.Row
    return conn

# Serve static files from the public directory
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

# API endpoints
@app.route('/api/profile/<int:user_id>', methods=['GET'])
def get_profile(user_id):
    """Получение профиля пользователя"""
    conn = get_db_connection()
    profile = conn.execute('SELECT * FROM profiles WHERE user_id = ?', (user_id,)).fetchone()
    conn.close()
    
    if profile:
        return jsonify({
            'user_id': profile['user_id'],
            'name': profile['name'],
            'bio': profile['bio'],
            'age': profile['age'],
            'gender': profile['gender'],
            'photo_id': profile['photo_id'],
            'search_gender': profile['search_gender']
        })
    return jsonify({'error': 'Profile not found'}), 404

@app.route('/api/next-profile', methods=['POST'])
def get_next_profile():
    data = request.json
    user_id = data.get('user_id')
    
    conn = get_db_connection()
    profile = conn.execute('''
        SELECT * FROM profiles 
        WHERE user_id != ? 
        AND user_id NOT IN (SELECT user2_id FROM matches WHERE user1_id = ?)
        AND gender IN (
            SELECT search_gender 
            FROM profiles 
            WHERE user_id = ?
        )
        ORDER BY RANDOM() LIMIT 1
    ''', (user_id, user_id, user_id)).fetchone()
    conn.close()
    
    if profile:
        return jsonify({
            'user_id': profile['user_id'],
            'name': profile['name'],
            'age': profile['age'],
            'bio': profile['bio'],
            'photo_url': f'/api/photo/{profile["photo_id"]}',
            'gender': profile['gender']
        })
    return jsonify({'error': 'No more profiles'}), 404

@app.route('/api/matches/<int:user_id>', methods=['GET'])
def get_matches(user_id):
    """Получение списка мэтчей пользователя"""
    conn = get_db_connection()
    matches = conn.execute('''
        SELECT p.* FROM profiles p
        INNER JOIN matches m1 ON p.user_id = m1.user2_id
        INNER JOIN matches m2 ON m1.user2_id = m2.user1_id
        WHERE m1.user1_id = ? AND m2.user2_id = ?
        AND m1.status = 'like' AND m2.status = 'like'
    ''', (user_id, user_id)).fetchall()
    conn.close()
    
    return jsonify([dict(match) for match in matches])

@app.route('/api/match', methods=['POST'])
def create_match():
    """Создание нового мэтча"""
    data = request.json
    user1_id = data.get('user1_id')
    user2_id = data.get('user2_id')
    status = data.get('status')
    
    if not all([user1_id, user2_id, status]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    conn = get_db_connection()
    try:
        conn.execute(
            'INSERT INTO matches (user1_id, user2_id, status) VALUES (?, ?, ?)',
            (user1_id, user2_id, status)
        )
        conn.commit()
        return jsonify({'message': 'Match created successfully'})
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Match already exists'}), 409
    finally:
        conn.close()

@app.route('/api/photo/<photo_id>')
def get_photo(photo_id):
    # Здесь должна быть логика получения фото из Telegram
    # В реальном приложении нужно использовать Telegram Bot API
    return jsonify({'error': 'Photo not available'}), 404

@app.route('/api/messages/<int:user_id>', methods=['GET'])
def get_messages(user_id):
    """Получение сообщений пользователя"""
    conn = get_db_connection()
    messages = conn.execute('''
        SELECT m.*, p.name as sender_name 
        FROM messages m
        JOIN profiles p ON m.sender_id = p.user_id
        WHERE m.receiver_id = ?
        ORDER BY m.timestamp DESC
    ''', (user_id,)).fetchall()
    conn.close()
    
    return jsonify([dict(message) for message in messages])

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True) 