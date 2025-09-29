from pymongo import MongoClient

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

mongo_policia = "mongodb://localhost:27017/"
client = MongoClient(mongo_policia)
db = client["policia"]
coleccion_sumariantes = db['sumariantes']

""" @app.route('/api/sumariantes', methods=['GET'])
resultados = coleccion_sumariantes.find()
for r in resultados:
    print(r["nombre"]) """
    
@app.route('/api/sumariantes', methods=['GET'])
def get_productos():
    sumariantes = list(coleccion_sumariantes.find({}, {'_id': 0}))
    return jsonify(sumariantes)

if __name__ == '__main__':
    app.run(debug=True)
"""
sumariante1 = {"nombre": "nacho", "ni": "123", "edad": 21}
sumariante2 = {"nombre": "ema", "ni": "1234", "edad": 35}

coleccion_sumariantes.insert_many([sumariante1, sumariante2]) 
"""

