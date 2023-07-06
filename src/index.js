const express = require('express');
const mongoose = require("mongoose");
require("dotenv").config();
const projectRoutes = require("./routes/projects");
const videobgtRoutes = require("./routes/videobg");

const app = express();
const port = process.env.PORT || 9000;


// Middleware
app.use("/api", projectRoutes,videobgtRoutes)

// Configurar ruta estática para servir imágenes
app.use('/uploads', express.static('public/uploads')); // Configurar ruta estática para servir imágenes

// Routes
app.get('/', (req,res)=>{
    res.send('Hello World')
})

// MongoDB Conn
mongoose.connect(process.env.MONGODB_URI)
.then(()=> console.log("Conectado a ATLAS"))
.catch((error)=> console.error(error))

app.listen(port, ()=> console.log("server running at port ", port))
