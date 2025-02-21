import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsFile = path.join(__dirname, '../data/products.json');

const router = Router();

const readProducts = () => JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
const saveProducts = (products) => fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));

router.get('/', (req, res) => {
    const products = readProducts();
    res.json(products);
});

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
    const products = readProducts();
    const index = products.findIndex(p => p.id === parseInt(req.params.pid));
    if (index === -1) return res.status(404).json({ error: "Producto no encontrado" });

    products[index] = { ...products[index], ...req.body };
    saveProducts(products);
    res.json(products[index]);
});

router.delete('/:pid', (req, res) => {
    const products = readProducts();
    const filteredProducts = products.filter(p => p.id !== parseInt(req.params.pid));
    if (filteredProducts.length === products.length) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }
    saveProducts(filteredProducts);
    res.json({ message: "Producto eliminado" });
});

export default router;