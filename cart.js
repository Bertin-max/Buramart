import {  getUserDetails } from "./user.js";
async function loadUserData() {
  const userData = await getUserDetails();
  if (userData) {
     return  userData.userId;
      
  } else {
      console.log("No user logged in.");
  }
}
let accountId = await loadUserData()
console.log(accountId);
let cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];
const smallsearchInput = document.getElementById('small-search-input')
const cartList = document.getElementById("list");
const searchInput = document.getElementById('search-input');
const main = document.getElementById('main-content');
const searchResultsContainer = document.getElementById("doll");
const smallsearchResultsContainer = document.getElementById('small-doll');
const whatsappbtn = document.getElementById('whatsapp-btn');
const client = new Appwrite.Client();
client.setProject('67b35038002044fd8dfa');

const DATABASE_ID = '67b5a1b2003647bb7108';
const SELLER_PRODUCTS_ID = '67b5a252002e43ecbff9';
const db = new Appwrite.Databases(client, DATABASE_ID);
let products = [];

// Initial display of products on page load
const goBackToProducts = () => {
  displayProducts();  // This function should render the original product list
};
window.showProductInDetails = (index) => {
  
  //const products = JSON.parse(localStorage.getItem('cartProducts'));
  const product = products[index];
  
   

  main.innerHTML  = `
        <div class="product-details-container">
        <!-- X Button -->
      <button  onclick="location.reload()" style="position: absolute; top: 10px; right: 10px; background: red; color: white; border: none; padding: 5px 10px; font-size: 18px; cursor: pointer;">X</button>
      <div class="product-image">
        <img src="${product.image}" alt="${product.Name}">
      </div>
      <div class="product-info">
        <h2>${product.Name}</h2>
        <p>${product.description}</p>
        <p><strong>Price: BIF  ${product.price}</strong></p>
      </div>
      <div class="contact-buttons1" >
        <a id = "whatsapp-btn" href=" " class="btn-contact"><svg xmlns="http://www.w3.org/2000/svg" height="20px" width="20px" fill="white"viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg></a>
        <a href="tel:${product.phone}" class="btn-contact"><svg xmlns="http://www.w3.org/2000/svg" height="20px" width="20px" fill="white"viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg></a>
       
       </div>
    </div>
      
  `;
  const whatsappbtn = document.getElementById('whatsapp-btn');
  if (product.whatsapp) {
    whatsappbtn.href = `https://wa.me/${product.whatsapp}`;
    whatsappbtn.style.display = "inline-block"; // Show button
} else {
    whatsappbtn.style.display = "none"; // Hide button if no WhatsApp
}
  window.scrollTo({
    top: 0,
    behavior: 'smooth' });
}


window.deleteProduct = async (productId) => {
   /* cartProducts.splice(index, 1); // Remove the product from the array
    localStorage.setItem('cartProducts', JSON.stringify(cartProducts)); // Update local storage
    displayProducts(); // Re-render the product list
    
    cartProducts.length === 0 ? 
    setTimeout(() => {
        alert('Cart Cleared successfully!');
      }, 100) :
    setTimeout(() => {
      alert('Cart Product deleted successfully!');
    }, 100);  // Delay the alert slightly}*/
    try {
      const response = await db.updateDocument(
          DATABASE_ID,        // Replace with your Database ID
          SELLER_PRODUCTS_ID,      // Replace with your Collection ID
          productId,            // The document (product) ID to update
          {'AddedToCart': false}           // The fields to update
      );

      console.log("Product updated:", response);
      location.reload();
      alert("Product updated successfully!");
     
  } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
  };
  }
  async function fetchProducts() {
   
      try {
          const response = await db.listDocuments(DATABASE_ID, SELLER_PRODUCTS_ID, [
           
          window.Appwrite.Query.equal("AddedToCart", true)]);
          
           products = response.documents; // Extract the products list
           displayProducts(products)
          console.log(products)
      } catch (error) {
          console.error("Error fetching products:", error);
      }
    }
    
     fetchProducts()
function displayProducts(products) {
   /* cartList.innerHTML = ''; // Clear the current list before adding new products  
    cartProducts.forEach((product, index) => {
      cartList.innerHTML += `
        <div class="cart-item" onclick= "showProductInDetails(${index})">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p class="price">BIF  ${product.price}</p>
        <button class="remove-btn" onclick = deleteProduct(${index})>Remove</button>
      </div>`
      
    });*/
     cartList.innerHTML = ''
    products.forEach((product, index) => {
     
      cartList.innerHTML += `
        <div class="cart-item" >
        <div  onclick= "showProductInDetails(${index})">
        <img src="${product.image}" alt="${product.Name}">
        <h3>${product.Name}</h3>
        <p class="price">BIF  ${product.price}</p>
        <div>
        <button class="remove-btn" onclick = deleteProduct('${product.$id}','${product.image}')>Remove</button>
      </div>`})
  }

window.searchProducts = () => {
 
  const searchInputValue = searchInput.value || smallsearchInput.value;

  // Map products with their original index before filtering
  const foundProducts = products
    .map((product, index) => ({ product, originalIndex: index })) // Keep track of original index
    .filter(item => item.product.Name.toLowerCase() === searchInputValue.toLowerCase()); // Case-insensitive search

  if (foundProducts.length === 0) {
    cartList.innerHTML = "You Have no Product under such name";
    return;
  }

  cartList.innerHTML = '';
  foundProducts.forEach(({ product, originalIndex }) => {  // Use originalIndex here
    cartList.innerHTML += `
      <div class="cart-item"  >
        <img src="${product.image}" alt="${product.Name}">
        <h3>${product.Name}</h3>
        <p class="price">${product.price}</p>
        <button class="remove-btn" onclick="deleteProduct('${product.$id}')">Remove</button>
      </div>`; 
  });
}
const liveSearch = () => {
  const searchTerm = searchInput.value.trim().toLowerCase() ; // Get and clean user input
 

  // Clear previous results
  searchResultsContainer.innerHTML = "";

  if (searchTerm === "") {
      return; // Exit if input is empty
  }

  // Filter products whose names start with the search term
  const matchedProducts = [];
const seenNames = new Set();

products.forEach(product => {
 if (product.Name.toLowerCase().startsWith(searchTerm) && !seenNames.has(product.Name)) {
     matchedProducts.push(product);
     seenNames.add(product.Name);
 }
});

  // Display matched products
  matchedProducts.forEach((product) => {
      const productElement = document.createElement("div");
      productElement.textContent = product.Name;
      productElement.classList.add("search-result-item"); // Add styling class
      productElement.onclick = () => {
          searchInput.value = product.Name; // Set input to selected product
          searchResultsContainer.innerHTML = ""; // Clear search results
          searchProducts(); // Trigger the main search function
      };
      searchResultsContainer.appendChild(productElement);
  });
};
const smallliveSearch = () => {
  const searchTerm = smallsearchInput.value.trim().toLowerCase() ; // Get and clean user input
 

  // Clear previous results
  smallsearchResultsContainer.innerHTML = "";

  if (searchTerm === "") {
      return; // Exit if input is empty
  }

  // Filter products whose names start with the search term
  const matchedProducts = [];
const seenNames = new Set();

products.forEach(product => {
 if (product.Name.toLowerCase().startsWith(searchTerm) && !seenNames.has(product.Name)) {
     matchedProducts.push(product);
     seenNames.add(product.Name);
 }
});

  // Display matched products
  matchedProducts.forEach((product) => {
      const productElement = document.createElement("div");
      productElement.textContent = product.Name;
      productElement.classList.add("search-result-item"); // Add styling class
      productElement.onclick = () => {
          searchInput.value = product.Name; // Set input to selected product
          searchResultsContainer.innerHTML = ""; // Clear search results
          searchProducts(); // Trigger the main search function
      };
      smallsearchResultsContainer.appendChild(productElement);
  });
};
// Add event listener for live search
searchInput.addEventListener("input", liveSearch);
smallsearchInput.addEventListener('input',smallliveSearch)