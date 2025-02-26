import express from "express";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./ProductManager.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configuración de Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "./views"));

// Puerto del servidor
const PORT = 8080;

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

// WebSockets
const productManager = new ProductManager("./src/data/products.json");

io.on("connection", (socket) => {
  console.log("Nuevo usuario conectado");

  // Manejar la creación de un nuevo producto
  socket.on("newProduct", async (productData) => {
    try {
      const newProduct = await productManager.addProduct(productData);
      io.emit("productAdded", newProduct); // Emitir a todos los clientes conectados
    } catch (error) {
      console.log("Error al añadir el nuevo producto:", error.message);
    }
  });

  // Manejar la eliminación de un producto
  socket.on("deleteProduct", async (productId) => {
    try {
      const deletedProduct = await productManager.deleteProductById(productId); // ✅ Método correcto
      if (deletedProduct) {
        io.emit("productDeleted", productId); // Emitir evento para actualizar la lista
      }
    } catch (error) {
      console.log("Error al eliminar el producto:", error.message);
    }
  });
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Servidor iniciado en: http://localhost:${PORT}`);
});
