const express = require('express');
const fs = require('fs');
const router = express.Router();
const cartsFile = './src/data/carts.json';

const readCarts = () => JSON.parse(fs.readFileSync(cartsFile));
const saveCarts = (carts) => fs.writeFileSync(cartsFile, JSON.stringify(carts, null, 2));


router.post('/', (req, res) => {
    const carts = readCarts();
    const newCart = { id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1, products: [] };
    carts.push(newCart);
    saveCarts(carts);
    res.status(201).json(newCart);
});


router.get('/:cid', (req, res) => {
    const carts = readCarts();
    const cart = carts.find(c => c.id === parseInt(req.params.cid));
    cart ? res.json(cart.products) : res.status(404).json({ error: "Carrito no encontrado" });
});


router.post('/:cid/product/:pid', (req, res) => {
    const carts = readCarts();
    const cart = carts.find(c => c.id === parseInt(req.params.cid));
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const productId = parseInt(req.params.pid);
    const existingProduct = cart.products.find(p => p.id === productId);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.products.push({ id: productId, quantity: 1 });
    }

    saveCarts(carts);
    res.json(cart);
});

module.exports = router;
