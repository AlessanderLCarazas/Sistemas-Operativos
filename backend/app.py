from flask import Flask, jsonify
from flask_cors import CORS  # Importa CORS
import psutil

app = Flask(__name__)
CORS(app)  # Habilita CORS para todas las rutas

@app.route('/processes', methods=['GET'])
def get_processes():
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'create_time']):
        try:
            processes.append({
                'pid': proc.info['pid'],
                'name': proc.info['name'],
                'cpu_percent': proc.info['cpu_percent'],
                'create_time': proc.info['create_time']
            })
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
    return jsonify(processes)

if __name__ == "__main__":
    app.run(debug=True)
