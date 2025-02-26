import fs from 'fs';

class CartManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  addCart = async () => {
    try {
      const fileData = await fs.promises.readFile(this.pathFile, 'utf-8');
      const carts = JSON.parse(fileData);

      // Calcular el nuevo ID autoincrementable
      const newId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;

      // Crear un nuevo carrito
      const newCart = {
        id: newId,
        products: []
      };

      carts.push(newCart);
      await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, 2), 'utf-8');

      return newCart;
    } catch (error) {
      throw new Error(`Error al agregar el carrito: ${error.message}`);
    }
  };

  getCartById = async (idCart) => {
    try {
      const fileData = await fs.promises.readFile(this.pathFile, 'utf-8');
      const carts = JSON.parse(fileData);

      const cart = carts.find(cart => cart.id === parseInt(idCart));
      if (!cart) throw new Error(`Carrito con id: ${idCart} no encontrado`);

      return cart.products;
    } catch (error) {
      throw new Error(`Error al obtener el carrito: ${error.message}`);
    }
  };

  addProductInCartById = async (idCart, product) => {
    try {
      const fileData = await fs.promises.readFile(this.pathFile, 'utf-8');
      const carts = JSON.parse(fileData);

      const cart = carts.find(cart => cart.id === parseInt(idCart));
      if (!cart) throw new Error(`Carrito con id: ${idCart} no encontrado`);

      const productInCart = cart.products.find(item => item.product === product.product);

      if (productInCart) {
        productInCart.quantity += product.quantity; // Incrementar cantidad si existe
      } else {
        cart.products.push(product); // Agregar nuevo producto si no existe
      }

      await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, 2), 'utf-8');
      return cart;
    } catch (error) {
      throw new Error(`Error al agregar el producto al carrito: ${error.message}`);
    }
  };

  deleteProductFromCart = async (idCart, productId) => {
    try {
      const fileData = await fs.promises.readFile(this.pathFile, 'utf-8');
      const carts = JSON.parse(fileData);

      const cart = carts.find(cart => cart.id === parseInt(idCart));
      if (!cart) throw new Error(`Carrito con id: ${idCart} no encontrado`);

      const productIndex = cart.products.findIndex(item => item.product === parseInt(productId));
      if (productIndex === -1) throw new Error(`Producto con id: ${productId} no encontrado en el carrito`);

      cart.products.splice(productIndex, 1); // Eliminar producto del carrito

      await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, 2), 'utf-8');
      return cart;
    } catch (error) {
      throw new Error(`Error al eliminar el producto del carrito: ${error.message}`);
    }
  };
}

export default CartManager;
