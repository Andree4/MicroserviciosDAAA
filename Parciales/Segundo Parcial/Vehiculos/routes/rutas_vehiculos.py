from flask import Blueprint
from controllers.controlador_vehiculos import crear_vehiculo, obtener_vehiculos, actualizar_vehiculo, eliminar_vehiculo

blueprint_vehiculos = Blueprint('vehiculos', __name__)

# Agregar ruta sin barra para evitar redirecciones
blueprint_vehiculos.route(
    '', methods=['GET'], strict_slashes=False)(obtener_vehiculos)
blueprint_vehiculos.route(
    '', methods=['POST'], strict_slashes=False)(crear_vehiculo)
blueprint_vehiculos.route('/', methods=['GET'])(obtener_vehiculos)
blueprint_vehiculos.route('/', methods=['POST'])(crear_vehiculo)
blueprint_vehiculos.route(
    '/<int:id_vehiculo>', methods=['PUT'])(actualizar_vehiculo)
blueprint_vehiculos.route(
    '/<int:id_vehiculo>', methods=['DELETE'])(eliminar_vehiculo)
