from flask import Flask
from flask_cors import CORS
from config.bd import iniciar_bd
from routes.rutas_vehiculos import blueprint_vehiculos
from dotenv import load_dotenv
import os


load_dotenv()

aplicacion = Flask(__name__)

# Configurar CORS para rutas bajo /api/* y origen de Vue
CORS(
    aplicacion,
    resources={r"/api/*": {"origins": ["http://localhost:5173"]}},
    supports_credentials=True,
    intercept_exceptions=True,
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"]
)

# Construir la URL de conexión a la base de datos desde variables de entorno
db_url = os.getenv('DATABASE_URL')
if not db_url:
    db_host = os.getenv('DB_HOST', 'localhost')
    db_port = os.getenv('DB_PORT', '3306')
    db_user = os.getenv('DB_USER', 'root')
    db_password = os.getenv('DB_PASSWORD', '')
    db_name = os.getenv('DB_NAME', 'vehiculos_db')
    db_url = f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"

aplicacion.config['SQLALCHEMY_DATABASE_URI'] = db_url
aplicacion.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
aplicacion.config['STRICT_SLASHES'] = False
iniciar_bd(aplicacion)

aplicacion.register_blueprint(blueprint_vehiculos, url_prefix='/api/events')

if __name__ == '__main__':
    aplicacion.run(host='0.0.0.0', port=5000, debug=True)
