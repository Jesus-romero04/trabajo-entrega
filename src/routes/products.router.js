const express = require('express');
const fs = require('fs');
const router = express.Router();
const productsFile = './src/data/products.json';

const readProducts = () => JSON.parse(fs.readFileSync(productsFile));
const saveProducts = (products) => fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));


router.get('/:pid', (req, res) => {
    const products = readProducts();
    const product = products.find(p => p.id === parseInt(req.params.pid));
    product ? res.json(product) : res.status(404).json({ error: "Producto no encontrado" });
});


router.post('/', (req, res) => {
    const products = readProducts();
    const newProduct = {
        id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
        ...req.body
    };
    products.push(newProduct);
    saveProducts(products);
    res.status(201).json(newProduct);
});


router.put('/:pid', (req, res) => {
    let products = readProducts();
    const index = products.findIndex(p => p.id === parseInt(req.params.pid));
    if (index === -1) return res.status(404).json({ error: "Producto no encontrado" });
    products[index] = { ...products[index], ...req.body };
    saveProducts(products);
    res.json(products[index]);
});


router.delete('/:pid', (req, res) => {
    let products = readProducts();
    const filteredProducts = products.filter(p => p.id !== parseInt(req.params.pid));
    if (filteredProducts.length === products.length) return res.status(404).json({ error: "Producto no encontrado" });
    saveProducts(filteredProducts);
    res.json({ message: "Producto eliminado" });
});

module.exports = router;
