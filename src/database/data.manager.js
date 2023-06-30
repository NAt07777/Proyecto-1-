const fs = require('fs');
const path = require('path');

const ruta = path.join(__dirname, 'data.json');

function escribir(contenido) {
    return new Promise((resolve, reject) => {
        fs.writeFile(ruta, JSON.stringify(contenido, null, '\t'), 'utf8',(error) => {
        if(error) reject(new Error("No se pudo escribir"));
        resolve(true);
        });
    });
};

function leer() {
    return new Promise((resolve, reject) => {
        fs.readFile(ruta, 'utf8', (error, contenido) => {
        if(error) reject(new Error("No se leer escribir"));
        resolve(JSON.parse(contenido));
        });
    });
};

function generarId(productos) {
    let mayorId = 0;
    productos.forEach((producto) => {
        if(Number(producto.id) > mayorId ) {
            mayorId = Number(producto.id);
        };
    });
    return mayorId +1;
};

async function findAll() {
    const productos = await leer();
    return productos;
}

async function findOneById(id) {
    if(!id) throw new Error("id indefinido");
    
    const productos = await leer();
    const producto = productos.find((producto) => producto.id === Number(id));

    if(!producto) throw new Error("El id no corresponde a un producto existente");

    return producto;
};

async function create(producto) {
    if(!producto?.nombre || !producto?.importe || !producto?.marca || !producto?.modelo || !producto?.stock)
    throw new Error("Error, Los datos no estan completos");
    
    const productos = await leer();
    const productoId = { id : generarId(productos), ...producto};

    productos.push(productoId);
    await escribir(productos);

    return productoId;
};

async function update(producto) {
    if(!producto?.id || !producto?.nombre || !producto?.importe || !producto?.marca || !producto?.modelo || !producto?.stock)
    throw new Error("Error, no puede actualizar el producto. Los datos no estan completos");

    let productos = await leer();
    const index = productos.findIndex((element) => element.id === Number(producto.id));

    if(index < 0) throw new Error("Error, el id no corresponde a un producto existente.");

    productos[index] = producto;
    await escribir(productos);

    return productos[index];
}

async function destroy(id) {
    if(!id) throw new Error("Error, El id esta indefinido");

    let productos = await leer();
    const index = productos.findIndex((item) => item.id === Number(id));

    if(index < 0) throw new Error("Error, el id no corresponde a un producto existente");

    const producto = productos[index];
    productos.splice(index, 1);
    await escribir(productos);

    return producto;
}

module.exports = {findAll, findOneById, create, update, destroy};