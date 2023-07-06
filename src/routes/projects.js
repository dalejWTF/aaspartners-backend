const express = require("express");
const multer = require('multer');
const projectSchema = require('../models/projects');
const fs = require('fs');


const router = express.Router()

const storage = multer.diskStorage({
    destination: 'public/uploads/', // Carpeta de destino para guardar las imágenes
    filename: (req, file, cb) => {
        // Generar un nombre de archivo único con la marca de tiempo
        const timestamp = Date.now();
        const extension = file.originalname.split('.').pop();
        cb(null, `imagen_${timestamp}.${extension}`);
    }
});

const upload = multer({ storage });



//POST
router.post('/projects', upload.array('images', 5), async (req, res) => {
    try {
        // Crear un nuevo proyecto con el nombre del proyecto y las referencias a archivos de imágenes
        const project = projectSchema({
            name: req.body.name,
            tags: req.body.tags,
            description: req.body.description,
            uploadDate: Date.now(),
            images: req.files.map(file => file.filename) // Obtener los nombres de archivo generados por multer
        });
        await project.save(); // Guardar el nuevo proyecto en la base de datos
        res.status(201).json({ mensaje: 'Proyecto creado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el proyecto' });
    }
});


//GET ALL
router.get('/projects', (req, res) => {

    projectSchema.find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

//SEARCH A TAG
router.get('/projects/tags/:tag', (req, res) => {
    const tag = req.params.tag; // Obtener el tag de la URL
  
    projectSchema.find({ tags: tag })
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
  });
  

//SEARCH A PROJECT
router.get('/projects/:name', (req, res) => {
    const name = req.params.name
    projectSchema.findOne({ name: name })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});


//UPDATE A PROJECT
router.put('/projects/:id', upload.array('images', 5), async (req, res) => {
    try {
        const projectId = req.params.id; // Obtener el ID del proyecto de los parámetros de la ruta
        const { name, tags, description } = req.body; // Obtener el nuevo nombre del proyecto del cuerpo de la solicitud

        // Obtener el proyecto existente de la base de datos
        const project = await projectSchema.findOne({ _id: projectId });

        if (!project) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }

        // Eliminar las imágenes antiguas asociadas al proyecto en el sistema de archivos
        const oldImages = project.images;
        for (const oldImage of oldImages) {
            const oldImagePath = `public/uploads/${oldImage}`;
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath); // Eliminar el archivo de imagen del sistema de archivos
            }
        }

        // Actualizar el proyecto con el nuevo nombre y las referencias a las nuevas imágenes
        project.name = name;
        project.tags = tags;
        project.description = description;
        project.images = req.files.map(file => file.filename); // Obtener los nombres de archivo generados por Multer

        await project.save(); // Guardar el proyecto actualizado en la base de datos

        res.json({ mensaje: 'Proyecto actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el proyecto' });
    }
});


//DELETE A PROJECT
router.delete('/projects/:id', async (req, res) => {
    try {
        const projectId = req.params.id; // Obtener el ID del proyecto de los parámetros de la ruta

        // Obtener el proyecto de la base de datos
        const project = await projectSchema.findOne({ _id: projectId });

        if (!project) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }

        // Eliminar las imágenes asociadas al proyecto en el sistema de archivos
        const images = project.images;
        for (const image of images) {
            const imagePath = `public/uploads/${image}`;
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // Eliminar el archivo de imagen del sistema de archivos
            }
        }

        // Eliminar el proyecto de la base de datos utilizando el método deleteOne de Mongoose
        await projectSchema.deleteOne({ _id: projectId });

        res.json({ mensaje: 'Proyecto eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el proyecto' });
    }
});



module.exports = router