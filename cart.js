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
const CART_ID = '67c05ddb0001a5f11990';
const db = new Appwrite.Databases(client, DATABASE_ID);
let products = [];

// Initial display of products on page load
const goBackToProducts = () => {
  displayProducts();  // This function should render the original product list
};
window.showProductInDetails = (productId) => {
  console.log(products)
  //const products = JSON.parse(localStorage.getItem('cartProducts'));
  const product = products.find(product => product.$id === productId);
  console.log(product);
   

  main.innerHTML  = `
        <div  class="product-details-container">
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
       
        <a href="tel:${product.phone}" class="btn-contact"><svg xmlns="http://www.w3.org/2000/svg" height="20px" width="20px" fill="white"viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg></a>
       
       </div>
    </div>
      
  `;
 /* const whatsappbtn = document.getElementById('whatsapp-btn');
  if (product.whatsapp) {
    whatsappbtn.href = `https://wa.me/${product.whatsapp}`;
    whatsappbtn.style.display = "inline-block"; // Show button
} else {
    whatsappbtn.style.display = "none"; // Hide button if no WhatsApp
}*/
  window.scrollTo({
    top: 0,
    behavior: 'smooth' });
}


window.deleteProduct = async (productId) => {
  if(document.getElementById('product')){
    document.getElementById("main-content").querySelector(".product-details-container").remove();
  }
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
    document.getElementById("modal").classList.add("active");
    try {
      const response = await db.listDocuments(DATABASE_ID,CART_ID, [
        window.Appwrite.Query.equal('productId', productId)
      ]);
      console.log(response.documents)
      let productIdToDelete = response.documents[0].$id;
      await db.deleteDocument(DATABASE_ID, CART_ID, productIdToDelete);
          

      location.reload();
      alert("Produit retiré de votre panier avec succès !");
      document.getElementById("modal").classList.remove("active");
  } catch (error) {
    document.getElementById("modal").classList.remove("active");
      console.error("Error updating product:", error);
      alert("Échec de la suppression du produit de votre panier. Veuillez réessayer");
  };
  }
  async function fetchProducts() {
    document.getElementById("modal").classList.add("active");
    try {
        const resp = await db.listDocuments(DATABASE_ID, CART_ID, [
            window.Appwrite.Query.equal("UserId", accountId)
        ]);

        const productes = resp.documents;
        console.log(productes);

        const crtproducts = await Promise.all(
            productes.map(async (el) => {
                const response = await db.listDocuments(DATABASE_ID, SELLER_PRODUCTS_ID, [
                    window.Appwrite.Query.equal("$id", el.productId)
                ]);
                return response.documents[0]; // Return the fetched product
            })
        );
        if(crtproducts.length === 0){
          cartList.innerHTML = '<p style="margin: auto; text-align: center; font-size: 18px; color: gray;">Votre panier est vide</p>';
          return
        }
        products = crtproducts;
        console.log(products);
        displayProducts(crtproducts); // Now products are fully fetched
        document.getElementById("modal").classList.remove("active");

    } catch (error) {
        console.error("Error fetching products:", error);
        document.getElementById("modal").classList.remove("active");
    }
}

fetchProducts();

function displayProducts(products) {
    cartList.innerHTML = '';
    products.forEach((product, index) => {
        cartList.innerHTML += `
        <div class="cart-item">
            <div onclick="showProductInDetails('${product.$id}')">
                <img src="${product.image}" alt="${product.Name}">
                <h3>${product.Name}</h3>
                <p class="price">BIF  ${product.price}</p>
                
            </div>
            <div>
                    <button class="remove-btn" onclick="deleteProduct('${product.$id}')">supprimer</button>
                </div>
        </div>`;
    });
}


window.searchProducts = () => {
 
  const searchInputValue = searchInput.value || smallsearchInput.value;

  // Map products with their original index before filtering
  const foundProducts = products
    .map((product, index) => ({ product, originalIndex: index })) // Keep track of original index
    .filter(item => item.product.Name.toLowerCase() === searchInputValue.toLowerCase()); // Case-insensitive search

  if (foundProducts.length === 0) {
    cartList.innerHTML = "Vous n'avez aucun produit sous ce nom.";
    return;
  }

  cartList.innerHTML = '';
  foundProducts.forEach(({ product, originalIndex }) => {  // Use originalIndex here
    cartList.innerHTML += `
      <div class="cart-item"  >
        <img src="${product.image}" alt="${product.Name}">
        <h3>${product.Name}</h3>
        <p class="price">${product.price}</p>
        <button class="remove-btn" onclick="deleteProduct('${product.$id}')">supprimer</button>
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