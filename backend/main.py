from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, date
import sqlite3
import requests

app = Flask(__name__)
CORS(app)

def init_db():
    conn = sqlite3.connect('tuition.db')
    c = conn.cursor()
    
    # Create students table
    c.execute('''
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            parent_name TEXT,
            phone TEXT NOT NULL,
            fees INTEGER NOT NULL,
            class_name TEXT,
            subjects TEXT,
            join_date DATE NOT NULL
        )
    ''')
    
    # Create payments table
    c.execute('''
        CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            amount INTEGER NOT NULL,
            payment_date DATE NOT NULL,
            payment_mode TEXT NOT NULL,
            month TEXT NOT NULL,
            year INTEGER NOT NULL,
            FOREIGN KEY (student_id) REFERENCES students (id)
        )
    ''')
    
    conn.commit()
    conn.close()

def send_payment_sms(phone, student_name, amount, month):
    url = "https://textflow-sms-api.p.rapidapi.com/send-sms"
    message = f"Payment of Rs.{amount} received for {student_name} for the month of {month}. Thank you!"
    payload = {
        "phone_number": phone,
        "text": message
    }
    headers = {
        "x-rapidapi-key": "e282d1da3bmsh9ee0bab2165e9cdp12afd6jsn3cd1266eda48",
        "x-rapidapi-host": "textflow-sms-api.p.rapidapi.com",
        "Content-Type": "application/json"
    }
    try:
        response = requests.post(url, json=payload, headers=headers)
        return response.json()
    except Exception as e:
        print(f"SMS sending failed: {str(e)}")
        return None

@app.route('/students', methods=['GET'])
def get_all_students():
    conn = sqlite3.connect('tuition.db')
    c = conn.cursor()
    c.execute('SELECT * FROM students')
    students = c.fetchall()
    conn.close()
    
    return jsonify([{
        'id': s[0],
        'name': s[1],
        'parent_name': s[2],
        'phone': s[3],
        'fees': s[4],
        'class_name': s[5],
        'subjects': s[6],
        'join_date': s[7]
    } for s in students])

@app.route('/students/<int:student_id>', methods=['GET'])
def get_student(student_id):
    conn = sqlite3.connect('tuition.db')
    c = conn.cursor()
    c.execute('SELECT * FROM students WHERE id = ?', (student_id,))
    student = c.fetchone()
    conn.close()
    
    if not student:
        return jsonify({'error': 'Student not found'}), 404
        
    return jsonify({
        'id': student[0],
        'name': student[1],
        'parent_name': student[2],
        'phone': student[3],
        'fees': student[4],
        'class_name': student[5],
        'subjects': student[6],
        'join_date': student[7]
    })

@app.route('/students', methods=['POST'])
def add_student():
    data = request.json
    conn = sqlite3.connect('tuition.db')
    c = conn.cursor()
    
    try:
        c.execute('''
            INSERT INTO students (name, parent_name, phone, fees, class_name, subjects, join_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['name'],
            data['parent_name'],
            data['phone'],
            data['fees'],
            data['class_name'],
            data['subjects'],
            date.today().isoformat()
        ))
        
        conn.commit()
        student_id = c.lastrowid
        conn.close()
        
        return jsonify({
            'id': student_id,
            'message': 'Student added successfully'
        }), 201
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({'error': str(e)}), 400

@app.route('/students/<int:student_id>', methods=['PUT'])
def update_student(student_id):
    data = request.json
    conn = sqlite3.connect('tuition.db')
    c = conn.cursor()
    
    try:
        update_fields = []
        values = []
        for key, value in data.items():
            if value is not None and key != 'id':
                update_fields.append(f"{key} = ?")
                values.append(value)
        
        if update_fields:
            values.append(student_id)
            query = f"UPDATE students SET {', '.join(update_fields)} WHERE id = ?"
            c.execute(query, values)
            conn.commit()
        
        conn.close()
        return jsonify({'message': 'Student updated successfully'})
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({'error': str(e)}), 400

@app.route('/payments', methods=['POST'])
def add_payment():
    data = request.json
    conn = sqlite3.connect('tuition.db')
    c = conn.cursor()
    
    try:
        # Get student details for SMS
        c.execute('SELECT name, phone FROM students WHERE id = ?', (data['student_id'],))
        student = c.fetchone()
        
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        c.execute('''
            INSERT INTO payments (student_id, amount, payment_date, payment_mode, month, year)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            data['student_id'],
            data['amount'],
            date.today().isoformat(),
            data['payment_mode'],
            data['month'],
            data['year']
        ))
        
        conn.commit()
        
        # Send SMS notification
        send_payment_sms(student[1], student[0], data['amount'], data['month'])
        
        return jsonify({'message': 'Payment recorded successfully'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        conn.close()

@app.route('/dashboard', methods=['GET'])
def get_dashboard():
    conn = sqlite3.connect('tuition.db')
    c = conn.cursor()
    
    current_date = date.today()
    current_month = current_date.strftime('%B')
    current_year = current_date.year
    
    c.execute('''
        SELECT 
            s.id,
            s.name,
            s.fees,
            s.phone,
            s.class_name,
            p.payment_date,
            p.payment_mode,
            p.month,
            p.year
        FROM students s
        LEFT JOIN (
            SELECT student_id, payment_date, payment_mode, month, year
            FROM payments p1
            WHERE (student_id, payment_date) IN (
                SELECT student_id, MAX(payment_date)
                FROM payments
                GROUP BY student_id
            )
        ) p ON s.id = p.student_id
        ORDER BY s.name
    ''')
    
    results = c.fetchall()
    conn.close()
    
    return jsonify([{
        'id': row[0],
        'name': row[1],
        'fees': row[2],
        'phone': row[3],
        'class_name': row[4],
        'last_payment_date': row[5],
        'payment_mode': row[6],
        'month': row[7],
        'year': row[8],
        'payment_status': 'Paid' if (row[7] == current_month and row[8] == current_year)
                         else 'Overdue' if row[5] else 'Not Received'
    } for row in results])

if __name__ == '__main__':
    init_db()
    app.run(debug=True)