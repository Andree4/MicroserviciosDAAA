const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', __dirname);

const dbConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '1122ffgg',
    database: process.env.MYSQL_DATABASE || 'APPUSUARIOS',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const db = mysql.createPool(dbConfig);

const connectWithRetry = () => {
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            console.log('Retrying connection in 5 seconds...');
            setTimeout(connectWithRetry, 5000);
            return;
        }
        console.log('Connected to MySQL');
        if (connection) connection.release();
    });
};

connectWithRetry();

app.get('/', async (req, res) => {
    try {
        const [users] = await db.promise().query('SELECT * FROM users');
        res.render('index', { users, showForm: false });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.get('/add', (req, res) => {
    res.render('index', { users: [], showForm: true });
});

app.post('/add', async (req, res) => {
    if (!req.body) {
        return res.status(400).send('Request body is missing');
    }
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).send('Name and email are required');
    }
    try {
        await db.promise().query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding user');
    }
});

app.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.promise().query('DELETE FROM users WHERE id = ?', [id]);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting user');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});