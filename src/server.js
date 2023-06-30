const express = require('express');
const { findAll, findOneById, create, update, destroy } = require('./database/data.manager.js');

require('dotenv').config();

const server = express();


//Middlewares
server.use(express.json());
server.use(express.urlencoded({extended: true}));

//Obtener todos los productos
server.get('/productos', (req, res) =>{
        findAll()
        .then((productos) => res.status(200).send(productos))
        .catch((error) => res.status(400).send(error.message))
    });

//Obtener un producto en específico
server.get('/productos/:id', (req, res) =>{
    const {id} = req.params;

    findOneById(id)
    .then((producto) => res.status(200).send(producto))
    .catch((error) => res.status(400).send(error.message));
});

//Crear un nuevo producto
server.post('/productos', (req, res) =>{
    const {nombre, importe, marca, modelo, stock} = req.body;

    create({nombre, importe, marca, modelo, stock})
    .then((producto) => res.status(201).send(producto))
    .catch((error) => res.status(400).send(error.message));
});

//Actualizar un producto en específico
server.put('/productos/:id', (req, res) =>{
    const {id} = req.params;
    const { nombre, importe, marca, modelo, stock } = req.body;
    
    update({id: Number(id), nombre, importe, marca, modelo, stock })
    .then((producto) => res.status(200).send(producto))
    .catch((error) => res.status(400).send(error.message));
});

//Eliminar un producto en específico
server.delete('/productos/:id', (req, res) =>{
    const {id} = req.params;
    
    destroy(id)
    .then((producto) => res.status(200).send(producto))
    .catch((error) => res.status(400).send(error.message));

});

//Control de rutas inexistentes
server.use('*', (req, res) => {
    res.status(404).send("<h1>Error</h1></h2>La URL no existe en este servidor</h2>")
});


//Método oyente de peticiones
server.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log(`Ejecutandose en http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/productos`)
});