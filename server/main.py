import datetime
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
import requests
import firebase_admin
from firebase_admin import credentials, firestore
from functools import wraps

cred = credentials.Certificate("./key.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

app = Flask(__name__)
CORS(app)

API_ID = "1dbe4e81"
API_KEY = "911de8adc9fbb9850640e1b490f8e8a9"
headers = {"Content-Type": f"application/json" }
API_LINK = 'https://api.edamam.com/api/nutrition-details'


@app.route('/')
def home():
    return "<title>Welcome to the Macrome API</title>"

def add_cors_header(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        response = make_response(f(*args, **kwargs))
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response
    return decorated_function

def get_macros(item):
    params = {
        'app_id': API_ID,
        'app_key': API_KEY,
    }
    payload = {
        'ingr': item
    }
    response = requests.post(API_LINK, json=payload, headers=headers, params=params).json()
    return response

@app.route('/api/estimate', methods=["POST"])
@add_cors_header
def estimate():
    if request.method == "POST":
        data = request.get_json()
        ingr = data['ingr']
        api_res = get_macros(ingr)

        return jsonify({"calories": api_res["calories"]})


@app.route('/api/macros', methods=["POST"])
def macros():
    if request.method == "POST":
        data = request.get_json()
        ingr = data['ingr']
        api_res = get_macros([ingr])

        calories = api_res["calories"]
        calories_percent = api_res["totalDaily"]["ENERC_KCAL"]["quantity"]

        fat = api_res["totalNutrients"]["FAT"]["quantity"]
        fat_percent = api_res["totalDaily"]["FAT"]["quantity"]

        carbs = api_res["totalNutrients"]["CHOCDF"]["quantity"]
        carbs_percent = api_res["totalDaily"]["CHOCDF"]["quantity"]

        protein = api_res["totalNutrients"]["PROCNT"]["quantity"]
        protein_percent = api_res["totalDaily"]["PROCNT"]["quantity"]

        sodium = api_res["totalNutrients"]["NA"]["quantity"]
        sodium_percent = api_res["totalDaily"]["NA"]["quantity"]

        return_doc = {
            'name': ingr,
            'calories': calories,
            'calories_percent': calories_percent,
            'fat': fat,
            'fat_percent': fat_percent,
            'carbs': carbs,
            'carbs_percent': carbs_percent,
            'protein': protein,
            'protein_percent': protein_percent,
            'sodium': sodium,
            'sodium_percent': sodium_percent
        }
        print(return_doc)

        return_doc.update({'email': data['email'],
                           'timestamp': int(datetime.datetime.now().timestamp()),
                                 'date': datetime.datetime.now().date().day, 
                                 'month': datetime.datetime.now().date().month, 
                                 'year': datetime.datetime.now().date().year })

        db.collection('consumption').add(return_doc)

        return jsonify(return_doc)
        
@app.route('/api/dashboard', methods=['POST'])
def dashboard():
    if request.method == 'POST':
        data = request.get_json()
        
        consumption_ref = db.collection('consumption').where('email', '==', data["email"]).get()
        consumption_data = []
        if consumption_ref:
            for item in consumption_ref:
                consumption_data.append(item)

        consumption_data = sorted(consumption_data, key=lambda x: (x.get('timestamp')), reverse=True)

        now = int(datetime.datetime.now().timestamp())

        consumptions = []
        consumption_today = {
            'calories': 0,
            'calories_percent': 0,
            'fat': 0,
            'fat_percent': 0,
            'carbs': 0,
            'carbs_percent': 0,
            'protein': 0,
            'protein_percent': 0,
            'sodium': 0,
            'sodium_percent': 0
        }
        consumption_week = [consumption_today.copy() for _ in range(7)]

        for item in consumption_data:
            consumptions.append({
                'name': item.get('name'),
                'calories': item.get('calories'),
                'fat': round(item.get('fat'), 2),
                'carbs': round(item.get('carbs'), 2),
                'protein': round(item.get('protein'), 2),
                'sodium': round(item.get('sodium'), 2),
                'date': item.get('date'),
                'month': item.get('month'),
                'year': item.get('year')
            })

            if now - item.get('timestamp') < (86400):
                consumption_today['calories'] += item.get('calories')
                consumption_today['calories_percent'] += item.get('calories_percent')
                consumption_today['fat'] += item.get('fat')
                consumption_today['fat_percent'] += item.get('fat_percent')
                consumption_today['carbs'] += item.get('carbs')
                consumption_today['carbs_percent'] += item.get('carbs_percent')
                consumption_today['protein'] += item.get('protein')
                consumption_today['protein_percent'] += item.get('protein_percent')
                consumption_today['sodium'] += item.get('sodium')
                consumption_today['sodium_percent'] += item.get('sodium_percent')
            
            if now - item.get('timestamp') < (86400 * 7):
                diff = (now - item.get('timestamp')) // 86400
                consumption_week[diff]['calories'] += item.get('calories')
                consumption_week[diff]['calories_percent'] += item.get('calories_percent')
                consumption_week[diff]['fat'] += item.get('fat')
                consumption_week[diff]['fat_percent'] += item.get('fat_percent')
                consumption_week[diff]['carbs'] += item.get('carbs')
                consumption_week[diff]['carbs_percent'] += item.get('carbs_percent')
                consumption_week[diff]['protein'] += item.get('protein')
                consumption_week[diff]['protein_percent'] += item.get('protein_percent')
                consumption_week[diff]['sodium'] += item.get('sodium')
                consumption_week[diff]['sodium_percent'] += item.get('sodium_percent')

            

        return jsonify({"consumptions": consumptions, "consumption_today": consumption_today, "consumption_week": consumption_week})

@app.route('/api/direct', methods=["POST"])
@add_cors_header
def direct():
    if request.method == 'POST':
        data = request.get_json()

        payload = {
            'name': data['name'],
            'calories': data['calories'],
            'calories_percent': data['calories']/20,
            'fat': data['fat'],
            'fat_percent': data['fat'] * (100/65),
            'carbs': data['carbs'],
            'carbs_percent': data['carbs'] /3,
            'protein': data['protein'],
            'protein_percent': data['protein']*2,
            'sodium': data['sodium'],
            'sodium_percent': data['sodium'] / 24,
            'email': data['email'],
            'timestamp': int(datetime.datetime.now().timestamp()),
            'date': datetime.datetime.now().date().day, 
            'month': datetime.datetime.now().date().month, 
            'year': datetime.datetime.now().date().year }
        
        db.collection('consumption').add(payload)

        return jsonify(payload)


if __name__ == '__main__':
    app.run(debug=True)

