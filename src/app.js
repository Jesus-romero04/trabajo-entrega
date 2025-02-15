const app = require('./app');
const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const productsRouter = require('./routes/products.router');
const cartRouter = require('./routes/cart.router');


app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');


app.use(express.json());


app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);


const server = http.createServer(app);


const io = new Server(server);


const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor iniciando en http://localhost:${PORT}`);
});

module.exports = app;