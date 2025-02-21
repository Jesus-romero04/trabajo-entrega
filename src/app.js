import express from 'express';
import handlebars from 'express-handlebars';
import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Ruta absoluta para directorios
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); // Se mantiene constante, no se reasigna
const server = createServer(app); // Crear servidor HTTP
const io = new SocketIO(server); // Conexión de WebSockets

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);

// Rutas para vistas
app.get('/', (req, res) => res.render('home', { products: [] }));
app.get('/realtimeproducts', (req, res) => res.render('realTimeProducts', { products: [] }));

// WebSocket: Actualización en tiempo real
io.on('connection', (socket) => {
    console.log('Cliente conectado');
    socket.on('disconnect', () => console.log('Cliente desconectado'));
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});