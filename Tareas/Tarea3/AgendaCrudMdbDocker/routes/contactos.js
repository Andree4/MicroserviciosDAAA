const express = require('express');
const router = express.Router();
const Contacto = require('../models/Contacto');

// CREATE
router.post('/', async (req, res) => {
    try {
        const nuevo = new Contacto(req.body);
        const guardado = await nuevo.save();
        res.status(201).json(guardado);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// READ (todos)
router.get('/', async (req, res) => {
    try {
        const lista = await Contacto.find();
        res.json(lista);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// READ (uno)
router.get('/:id', async (req, res) => {
    try {
        const item = await Contacto.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'No encontrado' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const actualizado = await Contacto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!actualizado) return res.status(404).json({ message: 'No encontrado' });
        res.json(actualizado);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const eliminado = await Contacto.findByIdAndDelete(req.params.id);
        if (!eliminado) return res.status(404).json({ message: 'No encontrado' });
        res.json({ message: 'Eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
