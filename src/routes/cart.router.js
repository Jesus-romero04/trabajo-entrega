import express from "express";
import CartManager from "../CartManager.js";

// Instanciamos el router de express para manejar las rutas
const cartRouter = express.Router();
// Instanciamos el manejador de nuestro archivo de carrito
const cartManager = new CartManager("./src/data/cart.json");

// Crear un carrito vacío con ID autogenerado
cartRouter.post("/", async (req, res) => {
  try {
    const carts = await cartManager.addCart();
    res.status(201).send(carts);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Obtener productos de un carrito por ID
cartRouter.get("/:cid", async (req, res) => {
  try {
    const cartProducts = await cartManager.getCartById(req.params.cid);
    res.status(200).send(cartProducts);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

// Agregar producto al carrito, sumando cantidad si ya existe
cartRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) {
      return res.status(400).send({ message: "La cantidad debe ser mayor a 0." });
    }

    const product = { id: parseInt(req.params.pid), quantity };
    const updatedCart = await cartManager.addProductInCartById(req.params.cid, product);

    res.status(201).send({
      message: `Producto con id: ${req.params.pid} agregado al carrito con id: ${req.params.cid}`,
      cart: updatedCart
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Eliminar producto del carrito
cartRouter.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const updatedCart = await cartManager.deleteProductFromCart(req.params.cid, req.params.pid);
    res.status(200).send({
      message: `Producto con id: ${req.params.pid} eliminado del carrito con id: ${req.params.cid}`,
      cart: updatedCart
    });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

export default cartRouter;