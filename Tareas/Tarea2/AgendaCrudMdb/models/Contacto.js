const mongoose = require('mongoose');

const contactoSchema = new mongoose.Schema({
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    fecha_nacimiento: { type: Date, required: true },
    direccion: String,
    celular: String,
    correo: { type: String, match: /.+\@.+\..+/ }
}, {
    timestamps: true
});

module.exports = mongoose.model('Contacto', contactoSchema);
