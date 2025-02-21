import express from 'express';
import handlebars from 'express-handlebars';
import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); 
const server = createServer(app); 
const io = new SocketIO(server); 


app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);


app.get('/', (req, res) => res.render('home', { products: [] }));
app.get('/realtimeproducts', (req, res) => res.render('realTimeProducts', { products: [] }));


io.on('connection', (socket) => {
    console.log('Cliente conectado');
    socket.on('disconnect', () => console.log('Cliente desconectado'));
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});