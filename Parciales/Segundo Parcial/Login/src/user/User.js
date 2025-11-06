// src/user/User.js
const mysql = require('mysql2');

const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'login'
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos');

    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        PRIMARY KEY (id)
      );
    `;

    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error al crear el esquema de usuario:', err);
      } else {
        console.log('Esquema de usuario creado correctamente');
      }
    });
  }
});

const validateEmail = email =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/.test(email);

module.exports = { connection, validateEmail };
