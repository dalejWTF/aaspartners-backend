const express = require("express");
const multer = require('multer');
const videobgSchema = require('../models/videobg');
const fs = require('fs');


const router = express.Router()

const storage = multer.diskStorage({
    destination: 'public/uploads/videobg/', // Carpeta de destino para guardar las imágenes
    filename: (req, file, cb) => {
        // Generar un nombre de archivo único con la marca de tiempo
        const extension = file.originalname.split('.').pop();
        cb(null, `videobg.${extension}`);
    }
});

const upload = multer({ storage });


//POST
router.post('/videobg', upload.single('video'), async (req, res) => {
    try {
        // Crear un nuevo proyecto con el nombre del proyecto y las referencias a archivos de imágenes
        const video = videobgSchema({
            title: req.body.title,
            description: req.body.description,
            video: req.file.filename
        });
        await video.save(); // Guardar el nuevo proyecto en la base de datos
        res.status(201).json({ mensaje: 'Video cargado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar el video' });
    }
});

//GET ALL
router.get('/videobg', (req, res) => {

    videobgSchema.find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});


module.exports = router