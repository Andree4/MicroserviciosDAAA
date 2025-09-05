const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sales_system'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL');
});

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Sales System API',
            version: '1.0.0',
            description: 'RESTful APIs for managing products, clients, invoices, and invoice details.'
        },
        servers: [
            { url: `http://localhost:${port}` }
        ],
        paths: {
            '/products': {
                post: {
                    summary: 'Create a new product',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string' },
                                        description: { type: 'string' },
                                        brand: { type: 'string' },
                                        stock: { type: 'integer' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '201': { description: 'Product created' }
                    }
                },
                get: {
                    summary: 'Get list of products with pagination and filtering',
                    parameters: [
                        { in: 'query', name: 'page', schema: { type: 'integer' }, description: 'Page number (default 1)' },
                        { in: 'query', name: 'limit', schema: { type: 'integer' }, description: 'Items per page (default 10)' },
                        { in: 'query', name: 'brand', schema: { type: 'string' }, description: 'Filter by brand' }
                    ],
                    responses: {
                        '200': { description: 'List of products' }
                    }
                }
            },
            '/products/{id}': {
                get: {
                    summary: 'Get a single product',
                    parameters: [
                        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } }
                    ],
                    responses: {
                        '200': { description: 'Product details' },
                        '404': { description: 'Product not found' }
                    }
                },
                put: {
                    summary: 'Update a product',
                    parameters: [
                        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string' },
                                        description: { type: 'string' },
                                        brand: { type: 'string' },
                                        stock: { type: 'integer' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '200': { description: 'Product updated' },
                        '404': { description: 'Product not found' }
                    }
                },
                delete: {
                    summary: 'Delete a product',
                    parameters: [
                        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } }
                    ],
                    responses: {
                        '200': { description: 'Product deleted' },
                        '404': { description: 'Product not found' }
                    }
                }
            },
            '/clients': {
                post: {
                    summary: 'Create a new client',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        ci: { type: 'string' },
                                        names: { type: 'string' },
                                        surnames: { type: 'string' },
                                        sex: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '201': { description: 'Client created' }
                    }
                },
                get: {
                    summary: 'Get list of clients with pagination and filtering',
                    parameters: [
                        { in: 'query', name: 'page', schema: { type: 'integer' } },
                        { in: 'query', name: 'limit', schema: { type: 'integer' } },
                        { in: 'query', name: 'sex', schema: { type: 'string' } }
                    ],
                    responses: {
                        '200': { description: 'List of clients' }
                    }
                }
            },
            '/clients/{id}': {
                get: {
                    summary: 'Get a single client',
                    parameters: [
                        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } }
                    ],
                    responses: {
                        '200': { description: 'Client details' },
                        '404': { description: 'Client not found' }
                    }
                },
                put: {
                    summary: 'Update a client',
                    parameters: [
                        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        ci: { type: 'string' },
                                        names: { type: 'string' },
                                        surnames: { type: 'string' },
                                        sex: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '200': { description: 'Client updated' },
                        '404': { description: 'Client not found' }
                    }
                },
                delete: {
                    summary: 'Delete a client',
                    parameters: [
                        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } }
                    ],
                    responses: {
                        '200': { description: 'Client deleted' },
                        '404': { description: 'Client not found' }
                    }
                }
            },
            '/invoices': {
                post: {
                    summary: 'Create a new invoice',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        date: { type: 'string', format: 'date' },
                                        client_id: { type: 'integer' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '201': { description: 'Invoice created' }
                    }
                },
                get: {
                    summary: 'Get list of invoices with pagination',
                    parameters: [
                        { in: 'query', name: 'page', schema: { type: 'integer' } },
                        { in: 'query', name: 'limit', schema: { type: 'integer' } }
                    ],
                    responses: {
                        '200': { description: 'List of invoices' }
                    }
                }
            },
            '/invoices/{id}': {
                get: {
                    summary: 'Get a single invoice',
                    parameters: [
                        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } }
                    ],
                    responses: {
                        '200': { description: 'Invoice details' },
                        '404': { description: 'Invoice not found' }
                    }
                },
                put: {
                    summary: 'Update an invoice',
                    parameters: [
                        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        date: { type: 'string', format: 'date' },
                                        client_id: { type: 'integer' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '200': { description: 'Invoice updated' },
                        '404': { description: 'Invoice not found' }
                    }
                },
                delete: {
                    summary: 'Delete an invoice',
                    parameters: [
                        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } }
                    ],
                    responses: {
                        '200': { description: 'Invoice deleted' },
                        '404': { description: 'Invoice not found' }
                    }
                }
            },
            '/clients/{client_id}/invoices': {
                get: {
                    summary: 'Get all invoices for a specific client',
                    parameters: [
                        { in: 'path', name: 'client_id', required: true, schema: { type: 'integer' } },
                        { in: 'query', name: 'page', schema: { type: 'integer' } },
                        { in: 'query', name: 'limit', schema: { type: 'integer' } }
                    ],
                    responses: {
                        '200': { description: 'List of invoices for the client' }
                    }
                }
            },
            '/invoices/{invoice_id}/details': {
                post: {
                    summary: 'Add a detail to an invoice',
                    parameters: [
                        { in: 'path', name: 'invoice_id', required: true, schema: { type: 'integer' } }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        product_id: { type: 'integer' },
                                        quantity: { type: 'integer' },
                                        price: { type: 'number' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '201': { description: 'Detail added' }
                    }
                },
                get: {
                    summary: 'Get details of a specific invoice',
                    parameters: [
                        { in: 'path', name: 'invoice_id', required: true, schema: { type: 'integer' } },
                        { in: 'query', name: 'page', schema: { type: 'integer' } },
                        { in: 'query', name: 'limit', schema: { type: 'integer' } }
                    ],
                    responses: {
                        '200': { description: 'List of invoice details' }
                    }
                }
            },
            '/invoices/{invoice_id}/details/{detail_id}': {
                put: {
                    summary: 'Update an invoice detail',
                    parameters: [
                        { in: 'path', name: 'invoice_id', required: true, schema: { type: 'integer' } },
                        { in: 'path', name: 'detail_id', required: true, schema: { type: 'integer' } }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        product_id: { type: 'integer' },
                                        quantity: { type: 'integer' },
                                        price: { type: 'number' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '200': { description: 'Detail updated' },
                        '404': { description: 'Detail not found' }
                    }
                },
                delete: {
                    summary: 'Delete an invoice detail',
                    parameters: [
                        { in: 'path', name: 'invoice_id', required: true, schema: { type: 'integer' } },
                        { in: 'path', name: 'detail_id', required: true, schema: { type: 'integer' } }
                    ],
                    responses: {
                        '200': { description: 'Detail deleted' },
                        '404': { description: 'Detail not found' }
                    }
                }
            }
        }
    },
    apis: []
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

const handleError = (res, err, status = 500) => {
    console.error(err);
    res.status(status).json({ error: err.message || 'Internal Server Error' });
};

app.post('/products', (req, res) => {
    const { name, description, brand, stock } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    db.query('INSERT INTO products (name, description, brand, stock) VALUES (?, ?, ?, ?)', [name, description, brand, stock || 0], (err, result) => {
        if (err) return handleError(res, err);
        res.status(201).json({ id: result.insertId, name, description, brand, stock });
    });
});

app.get('/products', (req, res) => {
    const { page = 1, limit = 10, brand } = req.query;
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM products';
    let params = [];
    if (brand) {
        query += ' WHERE brand = ?';
        params.push(brand);
    }
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    db.query(query, params, (err, results) => {
        if (err) return handleError(res, err);
        res.json(results);
    });
});

app.get('/products/:id', (req, res) => {
    db.query('SELECT * FROM products WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return handleError(res, err);
        if (!results.length) return res.status(404).json({ error: 'Product not found' });
        res.json(results[0]);
    });
});

app.put('/products/:id', (req, res) => {
    const { name, description, brand, stock } = req.body;
    db.query('UPDATE products SET name = ?, description = ?, brand = ?, stock = ? WHERE id = ?', [name, description, brand, stock, req.params.id], (err, result) => {
        if (err) return handleError(res, err);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product updated' });
    });
});

app.delete('/products/:id', (req, res) => {
    db.query('DELETE FROM products WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return handleError(res, err);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted' });
    });
});

app.post('/clients', (req, res) => {
    const { ci, names, surnames, sex } = req.body;
    if (!ci || !names || !surnames) return res.status(400).json({ error: 'CI, names, and surnames are required' });
    db.query('INSERT INTO clients (ci, names, surnames, sex) VALUES (?, ?, ?, ?)', [ci, names, surnames, sex], (err, result) => {
        if (err) return handleError(res, err);
        res.status(201).json({ id: result.insertId, ci, names, surnames, sex });
    });
});

app.get('/clients', (req, res) => {
    const { page = 1, limit = 10, sex } = req.query;
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM clients';
    let params = [];
    if (sex) {
        query += ' WHERE sex = ?';
        params.push(sex);
    }
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    db.query(query, params, (err, results) => {
        if (err) return handleError(res, err);
        res.json(results);
    });
});

app.get('/clients/:id', (req, res) => {
    db.query('SELECT * FROM clients WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return handleError(res, err);
        if (!results.length) return res.status(404).json({ error: 'Client not found' });
        res.json(results[0]);
    });
});

app.put('/clients/:id', (req, res) => {
    const { ci, names, surnames, sex } = req.body;
    db.query('UPDATE clients SET ci = ?, names = ?, surnames = ?, sex = ? WHERE id = ?', [ci, names, surnames, sex, req.params.id], (err, result) => {
        if (err) return handleError(res, err);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Client not found' });
        res.json({ message: 'Client updated' });
    });
});

app.delete('/clients/:id', (req, res) => {
    db.query('DELETE FROM clients WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return handleError(res, err);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Client not found' });
        res.json({ message: 'Client deleted' });
    });
});

app.post('/invoices', (req, res) => {
    const { date, client_id } = req.body;
    if (!date || !client_id) return res.status(400).json({ error: 'Date and client_id are required' });
    db.query('INSERT INTO invoices (date, client_id) VALUES (?, ?)', [date, client_id], (err, result) => {
        if (err) return handleError(res, err);
        res.status(201).json({ id: result.insertId, date, client_id });
    });
});

app.get('/invoices', (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    db.query('SELECT * FROM invoices LIMIT ? OFFSET ?', [parseInt(limit), parseInt(offset)], (err, results) => {
        if (err) return handleError(res, err);
        res.json(results);
    });
});

app.get('/invoices/:id', (req, res) => {
    db.query('SELECT * FROM invoices WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return handleError(res, err);
        if (!results.length) return res.status(404).json({ error: 'Invoice not found' });
        res.json(results[0]);
    });
});

app.get('/clients/:client_id/invoices', (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    db.query('SELECT * FROM invoices WHERE client_id = ? LIMIT ? OFFSET ?', [req.params.client_id, parseInt(limit), parseInt(offset)], (err, results) => {
        if (err) return handleError(res, err);
        res.json(results);
    });
});

app.put('/invoices/:id', (req, res) => {
    const { date, client_id } = req.body;
    db.query('UPDATE invoices SET date = ?, client_id = ? WHERE id = ?', [date, client_id, req.params.id], (err, result) => {
        if (err) return handleError(res, err);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Invoice not found' });
        res.json({ message: 'Invoice updated' });
    });
});

app.delete('/invoices/:id', (req, res) => {
    db.query('DELETE FROM invoices WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return handleError(res, err);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Invoice not found' });
        res.json({ message: 'Invoice deleted' });
    });
});

app.post('/invoices/:invoice_id/details', (req, res) => {
    const { product_id, quantity, price } = req.body;
    if (!product_id || !quantity || !price) return res.status(400).json({ error: 'Product_id, quantity, and price are required' });
    db.query('INSERT INTO invoice_details (invoice_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', [req.params.invoice_id, product_id, quantity, price], (err, result) => {
        if (err) return handleError(res, err);
        res.status(201).json({ id: result.insertId, invoice_id: req.params.invoice_id, product_id, quantity, price });
    });
});

app.get('/invoices/:invoice_id/details', (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    db.query('SELECT * FROM invoice_details WHERE invoice_id = ? LIMIT ? OFFSET ?', [req.params.invoice_id, parseInt(limit), parseInt(offset)], (err, results) => {
        if (err) return handleError(res, err);
        res.json(results);
    });
});

app.put('/invoices/:invoice_id/details/:detail_id', (req, res) => {
    const { product_id, quantity, price } = req.body;
    db.query('UPDATE invoice_details SET product_id = ?, quantity = ?, price = ? WHERE id = ? AND invoice_id = ?', [product_id, quantity, price, req.params.detail_id, req.params.invoice_id], (err, result) => {
        if (err) return handleError(res, err);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Detail not found' });
        res.json({ message: 'Detail updated' });
    });
});

app.delete('/invoices/:invoice_id/details/:detail_id', (req, res) => {
    db.query('DELETE FROM invoice_details WHERE id = ? AND invoice_id = ?', [req.params.detail_id, req.params.invoice_id], (err, result) => {
        if (err) return handleError(res, err);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Detail not found' });
        res.json({ message: 'Detail deleted' });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
});