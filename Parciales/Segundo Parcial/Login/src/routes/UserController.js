// src/routes/UserController.js
const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const { connection } = require('../user/User');
const bcrypt = require('bcryptjs');
const { verifyToken } = require('./VerifyToken');

// PUBLIC: Crear usuario (registro)
router.post('/', (req, res) => {
  try {
    const { email, password } = req.body;
    connection.query('SELECT id FROM users WHERE email = ?', [email], (err, results) => {
      if (err) return res.sendStatus(500);
      if (results.length > 0) return res.sendStatus(409);

      const hashedPassword = bcrypt.hashSync(password, 10);
      connection.query(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword],
        (err2) => {
          if (err2) return res.sendStatus(500);
          return res.sendStatus(201);
        }
      );
    });
  } catch (err) {
    console.error('UserController POST / error:', err);
    return res.sendStatus(500);
  }
});

// PROTECTED: Listar todos (solo admin)
router.get('/', verifyToken, (req, res) => {
  connection.query('SELECT id, email FROM users', (err) => {
    if (err) return res.sendStatus(500);
    return res.sendStatus(200);
  });
});




module.exports = router;
