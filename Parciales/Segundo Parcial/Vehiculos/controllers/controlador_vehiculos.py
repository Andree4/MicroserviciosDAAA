from flask import request, jsonify, make_response
from models.vehiculos import Vehiculo
from config.bd import bd
import jwt
from functools import wraps
import logging
import os

# Configurar logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


def requerir_token(f):
    @wraps(f)
    def decorado(*args, **kwargs):
        logger.debug("Verificando token en la solicitud")
        token = request.headers.get('Authorization')
        if not token:
            logger.error("Token no proporcionado")
            return make_response(jsonify({'error': 'Se requiere token'}), 401)
        try:
            token = token.split(" ")[1]
            logger.debug(f"Token recibido: {token}")
            jwt_secret = os.getenv('JWT_SECRET', 'sup6546ersecreto')
            datos = jwt.decode(token, jwt_secret, algorithms=["HS256"])
            logger.debug(f"Token decodificado: {datos}")
        except Exception as e:
            logger.error(f"Error al decodificar token: {str(e)}")
            return make_response(jsonify({'error': 'Token inválido'}), 401)
        return f(*args, **kwargs)
    return decorado


def crear_vehiculo():
    logger.debug("Procesando solicitud para crear vehiculo")
    try:
        datos = request.get_json()
        logger.debug(f"Datos recibidos: {datos}")
        vehiculo = Vehiculo(
            placa=datos['placa'],
            tipo=datos['tipo'],
            estado=datos['estado']
        )
        bd.session.add(vehiculo)
        bd.session.commit()
        logger.info(f"vehiculo creado con ID: {vehiculo.id}")
        return jsonify({'mensaje': 'vehiculo creado', 'id': vehiculo.id}), 201
    except Exception as e:
        logger.error(f"Error al crear vehiculo: {str(e)}")
        return jsonify({'error': str(e)}), 400


@requerir_token
def obtener_vehiculos():
    logger.debug("Obteniendo lista de vehiculos")
    vehiculos = Vehiculo.query.all()
    return jsonify([vehiculo.a_diccionario() for vehiculo in vehiculos])


@requerir_token
def actualizar_vehiculo(id_vehiculo):
    logger.debug(f"Actualizando vehiculo con ID: {id_vehiculo}")
    datos = request.get_json()
    vehiculo = Vehiculo.query.get(id_vehiculo)
    if not vehiculo:
        logger.error(f"vehiculo con ID {id_vehiculo} no encontrado")
        return make_response(jsonify({'error': 'vehiculo no encontrado'}), 404)
    for clave, valor in datos.items():
        setattr(vehiculo, clave, valor)
    bd.session.commit()
    logger.info(f"vehiculo con ID {id_vehiculo} actualizado")
    return jsonify({'mensaje': 'vehiculo actualizado'})


@requerir_token
def eliminar_vehiculo(id_vehiculo):
    logger.debug(f"Eliminando vehiculo con ID: {id_vehiculo}")
    vehiculo = Vehiculo.query.get(id_vehiculo)
    if not vehiculo:
        logger.error(f"vehiculo con ID {id_vehiculo} no encontrado")
        return make_response(jsonify({'error': 'vehiculo no encontrado'}), 404)
    bd.session.delete(vehiculo)
    bd.session.commit()
    logger.info(f"vehiculo con ID {id_vehiculo} eliminado")
    return jsonify({'mensaje': 'vehiculo eliminado'})
