from pymongo import MongoClient  # type: ignore
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


### MONGUITO
mongo_uri = "mongodb://localhost:27017/"
client = MongoClient(mongo_uri)
db = client["policia"]

coleccion_sumariantes = db['sumariantes']
coleccion_hechos = db['hechos']
coleccion_denuncias = db['denuncias']

### SUMARIANTES
@app.route('/api/sumariantes', methods=['GET'])
def get_sumariantes():
    sumariantes = list(coleccion_sumariantes.find({}, {'_id': 0}))
    return jsonify(sumariantes)

@app.route('/api/sumariantes', methods=['POST'])
def add_sumariante():
    data = request.json
    nuevo_sumariante = {
        "nombre": data.get("nombre"),
        "edad": data.get("edad"),
        "ni": data.get("ni_sumariante")
    }
    coleccion_sumariantes.insert_one(nuevo_sumariante)
    return jsonify({"message": "Sumariante agregado exitosamente"}), 201

@app.route('/api/sumariantes', methods=['DELETE'])
def delete_sumariante():
    ni_sumariante = request.json.get("ni_sumariante")
    resultado = coleccion_sumariantes.delete_one({"ni": ni_sumariante})
    if resultado.deleted_count > 0:
        return jsonify({"message": "Sumariante eliminado exitosamente"}), 200
    else:
        return jsonify({"message": "Sumariante no encontrado"}), 404

# HECHOS 

@app.route('/api/hechos', methods=['GET'])
def get_hechos():
    hechos = list(coleccion_hechos.find({}, {'_id': 0}))
    return jsonify(hechos)

@app.route('/api/hechos', methods=['POST'])
def add_hecho():
    valor_hecho = request.json
    coleccion_hechos.insert_one(valor_hecho)
    return jsonify({"message": "Hecho agregado exitosamente"}), 201

@app.route('/api/hechos', methods=['DELETE'])
def delete_hecho():
    nombre_hecho = request.json.get("nombre")
    resultado = coleccion_hechos.delete_one({"nombre": nombre_hecho})
    if resultado.deleted_count > 0:
        return jsonify({"message": "Hecho eliminado exitosamente"}), 200
    else:
        return jsonify({"message": "Hecho no encontrado"}), 404

#  DENUNCIAS 

@app.route('/api/denuncias', methods=['GET'])
def get_denuncias():
    denuncias = list(coleccion_denuncias.find({}, {'_id': 0}))
    return jsonify(denuncias)

@app.route('/api/denuncias', methods=['POST'])
def add_denuncia():
    data = request.json

    nueva_denuncia = {
        "numero_denuncia": data.get("numero_denuncia"),
        "fecha_denuncia": data.get("fecha_denuncia"),
        "lugar_denuncia": data.get("lugar_denuncia"),
        "hecho_denuncia": data.get("hecho_denuncia"),
        "observaciones": data.get("observaciones"),
        "victima": data.get("victima"),
        "imputado": data.get("imputado"),
        "fiscalia_juzgado": data.get("fiscalia_juzgado"),
        "detenido": data.get("detenido"),
        "id": int(data.get("id"))
    }

    coleccion_denuncias.insert_one(nueva_denuncia)
    return jsonify({"message": "Denuncia agregada exitosamente"}), 201

@app.route('/api/denuncias/<int:id>', methods=['GET'])
def get_denuncia_by_id(id):
    denuncia = coleccion_denuncias.find_one({"id": id}, {'_id': 0})
    if denuncia:
        return jsonify(denuncia)
    else:
        return jsonify({"message": "Denuncia no encontrada"}), 404


if __name__ == '__main__':
    app.run(debug=True)
