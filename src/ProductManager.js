import fs from "fs";

class ProductManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  // Obtener todos los productos
  getProducts = async () => {
    try {
      const fileData = await fs.promises.readFile(this.pathFile, "utf-8");
      return JSON.parse(fileData);
    } catch (error) {
      throw new Error(`Error al leer el archivo de productos: ${error.message}`);
    }
  };

  // Obtener producto por ID
  getProductById = async (idProduct) => {
    try {
      const data = await this.getProducts();
      const product = data.find((prod) => prod.id === parseInt(idProduct));
      if (!product) throw new Error(`Producto con id: ${idProduct} no encontrado`);
      return product;
    } catch (error) {
      throw new Error(`Error al obtener el producto: ${error.message}`);
    }
  };

  // Agregar nuevo producto (sin campo thumbnail)
  addProduct = async (newProduct) => {
    try {
      const data = await this.getProducts();
      newProduct.price = parseFloat(newProduct.price);
      newProduct.stock = parseInt(newProduct.stock, 10);

      const newId = data.length > 0 ? data[data.length - 1].id + 1 : 1;
      const product = { id: newId, ...newProduct, status: true };

      data.push(product);
      await fs.promises.writeFile(this.pathFile, JSON.stringify(data, null, 2), "utf-8");
      return product;
    } catch (error) {
      throw new Error(`Error al añadir el producto: ${error.message}`);
    }
  };

  // Actualizar producto por ID
  setProductById = async (idProduct, updatedProduct) => {
    try {
      const data = await this.getProducts();
      const productIndex = data.findIndex((prod) => prod.id === parseInt(idProduct));
      if (productIndex === -1) throw new Error(`Producto con id: ${idProduct} no encontrado`);

      data[productIndex] = { ...data[productIndex], ...updatedProduct };
      await fs.promises.writeFile(this.pathFile, JSON.stringify(data, null, 2), "utf-8");
      return data[productIndex];
    } catch (error) {
      throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
  };

  // Eliminar producto por ID
  deleteProductById = async (idProduct) => {
    try {
      const data = await this.getProducts();
      const productIndex = data.findIndex((prod) => prod.id === parseInt(idProduct));
      if (productIndex === -1) throw new Error(`Producto con id: ${idProduct} no encontrado`);

      data.splice(productIndex, 1);
      await fs.promises.writeFile(this.pathFile, JSON.stringify(data, null, 2), "utf-8");
      return { message: `Producto con id: ${idProduct} eliminado correctamente.` };
    } catch (error) {
      throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
  };
}

export default ProductManager;