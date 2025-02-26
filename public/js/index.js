const socket = io();

const formNewProduct = document.getElementById("formNewProduct");

// Enviar nuevo producto al servidor
formNewProduct.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(formNewProduct);
  const productData = {};

  formData.forEach((value, key) => {
    productData[key] = value;
  });

  socket.emit("newProduct", productData); 
});


socket.on("productAdded", (newProduct) => {
  const productsList = document.getElementById("productsList");
  const newProductItem = document.createElement("li");

  newProductItem.setAttribute("id", `product-${newProduct.id}`);
  newProductItem.setAttribute("data-id", newProduct.id);
  newProductItem.innerHTML = `
    ${newProduct.title} - $${newProduct.price}
    ${newProduct.thumbnail ? `<br><img src="${newProduct.thumbnail}" alt="${newProduct.title}" width="100">` : ""}
    <button class="delete-product-btn">Eliminar</button>
  `;

  productsList.appendChild(newProductItem);
});


socket.on("productDeleted", (deletedProductId) => {
  const productItem = document.getElementById(`product-${deletedProductId}`);
  if (productItem) {
    productItem.remove();
  }
});


document.getElementById("productsList").addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-product-btn")) {
    const productItem = event.target.closest("li");
    const productId = productItem.getAttribute("data-id");

    // Emitir evento para eliminar producto
    socket.emit("deleteProduct", productId);
  }
});