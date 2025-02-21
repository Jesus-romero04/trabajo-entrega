import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import productsData from '../data/products.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();


router.get('/', (req, res) => {
  res.render('home', { products: productsData });
});


router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { products: productsData });
});

export default router;