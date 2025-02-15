const express = require('express');
const fs = require('fs');
const router = express.Router();
const cartsFile = './src/data/carts.json';


const readCarts = () => {
    try {
        if (!fs.existsSync(cartsFile)) return [];
        const data = fs.readFileSync(cartsFile, 'utf-8');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Error leyendo el archivo de carritos:", error);
        return [];
    }
};

const saveCarts = (carts) => {
    try {
        fs.writeFileSync(cartsFile, JSON.stringify(carts, null, 2));
    } catch (error) {
        console.error("Error guardando el archivo de carritos:", error);
    }
};


router.get('/', (req, res) => {
    const carts = readCarts();
    res.json(carts);
});


router.get('/products', (req, res) => {
    const carts = readCarts();
    const allProducts = carts.flatMap(cart => cart.products);
    res.json(allProducts);
});


router.post('/', (req, res) => {
    const carts = readCarts();
    const newCart = {
        id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
        products: []
    };
    carts.push(newCart);
    saveCarts(carts);
    res.status(201).json(newCart);
});


router.get('/:cid', (req, res) => {
    const carts = readCarts();
    const cartId = parseInt(req.params.cid);
    if (isNaN(cartId)) return res.status(400).json({ error: "ID de carrito no válido" });

    const cart = carts.find(c => c.id === cartId);
    cart ? res.json(cart.products) : res.status(404).json({ error: "Carrito no encontrado" });
});


router.post('/:cid/product/:pid', (req, res) => {
    const carts = readCarts();
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    if (isNaN(cartId) || isNaN(productId)) {
        return res.status(400).json({ error: "ID de carrito o producto no válido" });
    }

    const cart = carts.find(c => c.id === cartId);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

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