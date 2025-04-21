from flask import Flask, request, jsonify, send_from_directory
import sqlite3
import os

app = Flask(__name__)

def get_db_connection():
    conn = sqlite3.connect('dating_bot.db')
    conn.row_factory = sqlite3.Row
    return conn

# Serve static files from the public directory
@app.route('/')
def index():
    return send_from_directory('public', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('public', path)

# API endpoints
@app.route('/api/profile', methods=['POST'])
def get_profile():
    data = request.json
    user_id = data.get('user_id')
    
    conn = get_db_connection()
    profile = conn.execute('SELECT * FROM profiles WHERE user_id = ?', (user_id,)).fetchone()
    conn.close()
    
    if profile:
        return jsonify({
            'name': profile['name'],
            'age': profile['age'],
            'bio': profile['bio'],
            'photo_url': f'/api/photo/{profile["photo_id"]}',
            'gender': profile['gender'],
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

@app.route('/api/matches', methods=['POST'])
def get_matches():
    data = request.json
    user_id = data.get('user_id')
    
    conn = get_db_connection()
    matches = conn.execute('''
        SELECT p.* FROM profiles p
        JOIN matches m ON p.user_id = m.user2_id
        WHERE m.user1_id = ? AND m.status = 'like'
        AND EXISTS (
            SELECT 1 FROM matches m2
            WHERE m2.user1_id = p.user_id
            AND m2.user2_id = ?
            AND m2.status = 'like'
        )
    ''', (user_id, user_id)).fetchall()
    conn.close()
    
    return jsonify([{
        'user_id': match['user_id'],
        'name': match['name'],
        'age': match['age'],
        'bio': match['bio'],
        'photo_url': f'/api/photo/{match["photo_id"]}',
        'gender': match['gender']
    } for match in matches])

@app.route('/api/photo/<photo_id>')
def get_photo(photo_id):
    # Здесь должна быть логика получения фото из Telegram
    # В реальном приложении нужно использовать Telegram Bot API
    return jsonify({'error': 'Photo not available'}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 