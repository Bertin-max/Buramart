const homeProductList = document.getElementById("home-list");
const storedProduct = localStorage.getItem('products');
const main = document.getElementById('main-content');
const searchInput = document.getElementById('search-input');
const smallsearchInput = document.getElementById('small-search-input');
const viewAll =  document.getElementById('view-all');
let cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];
let originalContent = main.innerHTML;


const upDateCart = (index) => {
  const products = JSON.parse(localStorage.getItem('products'));
  const cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || []; // Initialize cartProducts if null
  
  const product = products[index];

  // Check if the product is already in the cart based on a unique property (e.g., name)
  const productExists = cartProducts.some(item => item.description === product.description);

  if (productExists) {
    alert("Product already Added");
    return;
  } else {
    cartProducts.push(product);
    localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
  }
};

function ShowSidebar(){
  const sidebar = document.querySelector('.sidebar')
  sidebar.style.display = 'flex'
}
function hideSidebar(){
    const sidebar = document.querySelector('.sidebar')
  sidebar.style.display = 'none'
}
const goBackToMain = () => {
   main.innerHTML = originalContent;
 
}
const showProductInDetails = (index) => {
  const products = JSON.parse(localStorage.getItem('products'));
  const product = products[index];

  main.innerHTML  = `
        <div class="product-details-container">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p><strong>Price: $${product.price}</strong></p>
      </div>
      <div class="contact-buttons1" >
        <a href="https://wa.me/25765381604" class="btn-contact"><svg xmlns="http://www.w3.org/2000/svg" height="20px" width="20px" fill="white"viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg></a>
        <a href="tel:+25768154810" class="btn-contact"><svg xmlns="http://www.w3.org/2000/svg" height="20px" width="20px" fill="white"viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg></a>
       <a class="btn-contact" onclick = "upDateCart(${index})"><svg height="20" width="20" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg></a>
       </div>
    </div>
      
  `;
  window.scrollTo({
    top: 0,
    behavior: 'smooth' });
}
const displayProducts = () => {
if (storedProduct) {
  // Convert JSON string back to array
  const products = JSON.parse(storedProduct);  // Fixed the variable name

  homeProductList.innerHTML = '';

  products.forEach((product,index) => {  // Now iterating over the correct variable
    homeProductList.innerHTML += `
      <div onclick = showProductInDetails(${index}) class="product-card">
        <div>
          <h3 style="padding: 0; margin: 0; gap: 0;">${product.name}</h3>
          <img  src="${product.image}" alt="${product.name}"> 
        </div> 
        <div class="product-details">
          <p class="price">$${product.price}</p>
          <div class="product-details">
            <a ><p class="description"> ${product.description.length > 50 ? product.description.substring(0, 50) + '...' : product.description}</p></a>
          </div>
        </div>
      </div>`;
  });
} else {
  alert('No product data found in Local Storage.');
}
} 
const categorySearch = () => {
  const products = JSON.parse(localStorage.getItem('products')) ;
  
  const foundProducts = products.filter(product => product.category === categoryInputValue);
 if(foundProducts.length === 0){
  homeProductList.innerHTML = "No Product Found";
  return
 }
  homeProductList.innerHTML = '';
    foundProducts.forEach((product,index) => {  // Now iterating over the correct variable
      homeProductList.innerHTML += `
        <div onclick = showProductInDetails(${index}) class="product-card">

          <div>
             <h3 style="padding: 0; margin: 0; gap: 0;">${product.name}</h3>
            <img  src="${product.image}" alt="${product.name}"> 
          </div> 
          <div class="product-details">
            <p class="price">$${product.price}</p>
            <div class="product-details">
              <a ><p class="description"> ${product.description.length > 50 ? product.description.substring(0, 50) + '...' : product.description}</p></a>
            </div>
          </div>
        </div>`;
    });
}
const searchProducts = () => {
  const products = JSON.parse(localStorage.getItem('products'));
  const searchInputValue = searchInput.value || smallsearchInput.value;

  // Find products and keep their original index
  const foundProducts = products
    .map((product, index) => ({ product, originalIndex: index })) // Map products with their original index
    .filter(item => item.product.name.toLowerCase() === searchInputValue.toLowerCase()); // Filter based on the search input (case-insensitive)

  if (foundProducts.length === 0) {
    homeProductList.innerHTML = "No Product Found";
    return;
  }

  homeProductList.innerHTML = '';
  foundProducts.forEach(({ product, originalIndex }) => {
    homeProductList.innerHTML += `
      <div onclick="showProductInDetails(${originalIndex})" class="product-card">
        <div>
          <h3 style="padding: 0; margin: 0;">${product.name}</h3>
          <img src="${product.image}" alt="${product.name}"> 
        </div> 
        <div class="product-details">
          <p class="price">$${product.price}</p>
          <div class="product-details">
            <a><p class="description">${product.description.length > 50 ? product.description.substring(0, 50) + '...' : product.description}</p></a>
          </div>
        </div>
      </div>`;
  });
}
 displayProducts()

  

