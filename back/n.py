from pymongo import MongoClient # type: ignore

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

mongo_policia = "mongodb://localhost:27017/"
client = MongoClient(mongo_policia)
db = client["policia"]
coleccion_sumariantes = db['sumariantes']
coleccion_hechos = db['hechos']
    
@app.route('/api/sumariantes', methods=['GET'])
def get_sumariantes():
    sumariantes = list(coleccion_sumariantes.find({}, {'_id': 0}))
    return jsonify(sumariantes)

@app.route('/api/sumariantes', methods=['POST'])
def add_sumariante():
    data = request.json

    nuevo_sumariante = { 
    "nombre": data.get("nombre"),
    "edad" : data.get("edad"),
    "ni" : data.get("ni_sumariante")
    }
   
    coleccion_sumariantes.insert_one(nuevo_sumariante)
    return jsonify({"message": "Sumariante agregado exitosamente"}), 201

@app.route('/api/hechos', methods=['GET'])
def get_hechos():
    hechos = list(coleccion_hechos.find({}, {'_id': 0}))
    return jsonify(hechos)

@app.route('/api/hechos', methods=['POST'])
def add_hecho():
    valor_hecho = request.json
    coleccion_hechos.insert_one(valor_hecho)
    return jsonify({"message": "Hecho agregado exitosamente"}), 201

if __name__ == '__main__':
    app.run(debug=True)

