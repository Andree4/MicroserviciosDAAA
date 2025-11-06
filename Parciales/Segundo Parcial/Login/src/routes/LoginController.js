// src/routes/LoginController.js
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const { connection } = require('../user/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { jwt: jwtCfg } = require('../config/config');

// POST /api/v1/login
router.post('/', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ message: 'Missing fields' });

    connection.query('SELECT id, email, password FROM users WHERE email = ? LIMIT 1', [email], (err, results) => {
      if (err) return res.status(500).send({ message: 'Internal error' });
      if (!results || results.length === 0) return res.status(404).send('No user found.');

      const user = results[0];
      const ok = bcrypt.compareSync(password, user.password);
      if (!ok) return res.status(401).send({ auth: false, token: null });

      const token = jwt.sign({ sub: user.id.toString() }, jwtCfg.secret, { expiresIn: jwtCfg.expiresIn });

      res.status(200).send({ auth: true, token, user: { id: user.id, email: user.email } });
    });
  } catch (err) {
    console.error('LoginController POST / error:', err);
    res.status(500).send({ message: 'Internal error' });
  }
});

module.exports = router;
