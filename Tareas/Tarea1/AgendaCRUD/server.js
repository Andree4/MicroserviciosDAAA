const express = require('express');
const mysql = require('mysql2/promise'); // Usamos mysql2 con soporte para promesas
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Configuración de la conexión a MySQL
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Reemplaza con tu usuario de MySQL (por defecto en phpMyAdmin: root)
    password: '', // Reemplaza con tu contraseña (por defecto en XAMPP: vacía)
    database: 'agenda_db',
    port: 3306, // Puerto por defecto de MySQL
});

// Crea la tabla si no existe (ejecuta esto una vez)
pool.query(`
    CREATE TABLE IF NOT EXISTS agenda (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombres VARCHAR(255) NOT NULL,
        apellidos VARCHAR(255) NOT NULL,
        fecha_nacimiento DATE,
        direccion VARCHAR(255),
        celular VARCHAR(20),
        correo VARCHAR(255)
    );
`).catch(err => console.error('Error al crear la tabla:', err));

// CREATE: Agregar contacto
app.post('/agenda', async (req, res) => {
    const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO agenda (nombres, apellidos, fecha_nacimiento, direccion, celular, correo) VALUES (?, ?, ?, ?, ?, ?)',
            [nombres, apellidos, fecha_nacimiento || null, direccion, celular, correo]
        );
        // MySQL no soporta RETURNING directamente, así que obtenemos el registro insertado
        const [newRecord] = await pool.query('SELECT * FROM agenda WHERE id = ?', [result.insertId]);
        res.json(newRecord[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ: Obtener todos los contactos
app.get('/agenda', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM agenda');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ: Obtener un contacto por ID
app.get('/agenda/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM agenda WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Contacto no encontrado' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE: Actualizar contacto
app.put('/agenda/:id', async (req, res) => {
    const { id } = req.params;
    const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE agenda SET nombres = ?, apellidos = ?, fecha_nacimiento = ?, direccion = ?, celular = ?, correo = ? WHERE id = ?',
            [nombres, apellidos, fecha_nacimiento || null, direccion, celular, correo, id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Contacto no encontrado' });
        // Obtener el registro actualizado
        const [updatedRecord] = await pool.query('SELECT * FROM agenda WHERE id = ?', [id]);
        res.json(updatedRecord[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Eliminar contacto
app.delete('/agenda/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM agenda WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Contacto no encontrado' });
        res.json({ message: 'Contacto eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});