from config.bd import bd
from datetime import datetime


class vehiculo(bd.Model):
    __tablename__ = 'vehiculos'

    id = bd.Column(bd.Integer, primary_key=True)
    placa = bd.Column(bd.Integer, nullable=False)
    tipo = bd.Column(bd.String(100), nullable=False)
    estado = bd.Column(bd.Boolean, nullable=False)

    def a_diccionario(self):
        return {
            'id': self.id,
            'placa': self.placa,
            'tipo': self.tipo,
            'estado': self.estado
        }
