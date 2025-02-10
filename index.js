const homeProductList = document.getElementById("home-list");
const storedProduct = localStorage.getItem('products');

if (storedProduct) {
  // Convert JSON string back to array
  const products = JSON.parse(storedProduct);  // Fixed the variable name

  homeProductList.innerHTML = '';

  products.forEach((product) => {  // Now iterating over the correct variable
    homeProductList.innerHTML += `
      <div class="product-card">
        <div>
          <h3 style="padding: 0; margin: 0; gap: 0;">${product.name}</h3>
          <a href="product.html"><img src="${product.image}" alt="${product.name}"></a> 
        </div> 
        <div class="product-details">
          <p class="price">$${product.price}</p>
          <div class="product-details">
            <a href="product.html"><p class="description">${product.description || ''}</p></a>
          </div>
        </div>
      </div>`;
  });
} else {
  alert('No product data found in Local Storage.');
}