import express from "express";
import ProductManager from "../ProductManager.js";

const viewsRouter = express.Router();
const productManager = new ProductManager("./src/data/products.json");


viewsRouter.get("", async(req, res)=> {
  try {
    const products = await productManager.getProducts();

    res.render("home", { products }); 
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});


// Vista Productos en Tiempo Real
viewsRouter.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();

    res.render("realTimeProducts", {
      products,
      hasProducts: products.length > 0,
      title: "Productos en Tiempo Real"
    });
  } catch (error) {
    res.status(500).render("error", { message: `Error al cargar la vista en tiempo real: ${error.message}` });
  }
});

export default viewsRouter;