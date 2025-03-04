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

const categories = {
  electronics: ["Smartphones", "Laptops", "Tablets", "Cameras", "Headphones", "Smartwatches", "Gaming Consoles", "Televisions", "Speakers"],
  clothing: ["Men's Clothing", "Women's Clothing", "Kids' Clothing", "Shoes", "Bags", "Accessories", "Hats", "Watches", "Eyewear"],
  homeappliances: ["Refrigerators", "Microwaves", "Washing Machines", "Air Conditioners", "Vacuum Cleaners", "Dishwashers", "Water Heaters", "Fans", "Coffee Makers"],
  books: ["Fiction", "Non-Fiction", "Educational", "Comics & Graphic Novels", "Biographies", "Self-Help", "Science & Technology", "Children's Books", "Mystery & Thriller"],
  beauty: ["Skincare", "Makeup", "Haircare", "Fragrances", "Nail Care", "Men’s Grooming", "Beauty Tools", "Bath & Body", "Oral Care"],
  toys: ["Action Figures", "Dolls", "Board Games", "Building Blocks", "Remote Control Toys", "Educational Toys", "Outdoor Toys", "Plush Toys", "Musical Toys"],
  furniture: ["Living Room Furniture", "Bedroom Furniture", "Dining Room Furniture", "Office Furniture", "Outdoor Furniture", "Storage Solutions", "Kids' Furniture", "Mattresses", "Lighting"],
  sports: ["Fitness Equipment", "Outdoor Sports", "Team Sports", "Water Sports", "Winter Sports", "Cycling", "Racket Sports", "Combat Sports", "Running Gear"],
  health: ["Vitamins & Supplements", "Personal Care", "Medical Supplies", "Fitness & Nutrition", "Wellness Devices", "Weight Management", "First Aid", "Oral Hygiene", "Mental Health"],
  automotive: ["Car Accessories", "Motorcycle Accessories", "Car Care", "Tires & Wheels", "GPS & Navigation", "Car Electronics", "Oils & Fluids", "Replacement Parts", "Tools & Equipment"],
  food: ["Fresh Produce", "Dairy & Eggs", "Meat & Seafood", "Snacks", "Beverages", "Canned Goods", "Bakery Items", "Condiments & Spices", "Frozen Foods"]
};



let subcategoryterm = "";
let productNameOfProduct = '';
let categoryOfProduct = '';
let subcat = [];
const homeProductList = document.getElementById("home-list");
const storedProduct = localStorage.getItem('products');
const main = document.getElementById('main-content');
const modalOverlay = document.getElementById('modal-overlay');
const modalOverlay2 = document.getElementById('modal-overlay2');
const modalProductDetails = document.getElementById('modal-product-details');
const modalProductDetails2 = document.getElementById('modal-product-details2');
const closeModalBtn = document.getElementById('close-modal-btn');
const closeModalBtn2 = document.getElementById('close-modal-btn2');
const originalModalContent = modalProductDetails.innerHTML;
const averageStars = document.getElementById("average-stars");
let sellerId = '';
let selectedProductId = '';
let selectedProductCategory = '';
let searchInput = document.getElementById('search-input');
const smallsearchInput = document.getElementById('small-search-input');
const viewAll =  document.getElementById('view-all');
let cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];
let originalContent = main.innerHTML;
let originalContent2 = homeProductList.innerHTML;
const searchResultsContainer = document.getElementById("doll");
const smallsearchResultsContainer = document.getElementById('small-doll');
const loadingHtml = document.querySelectorAll('.product-card');
const loadMoreBtn = document.getElementById('load-more-btn');
const searchloadMoreBtn = document.getElementById('search-load-more-btn');
const categoryloadMoreBtn2 = document.getElementById('category2-load-more-btn');
const subcategoryloadMoreBtn = document.getElementById('subcategory-load-more-btn')  ;
const categoryloadMoreBtn = document.getElementById('category-load-more-btn');
const client = new Appwrite.Client();
client.setProject('67b35038002044fd8dfa');

const DATABASE_ID = '67b5a1b2003647bb7108';
const SELLER_PRODUCTS_ID = '67b5a252002e43ecbff9';
const SELLER_REGISTRATION_ID = '67b83126001bf9ce5516';
const CART_ID = '67c05ddb0001a5f11990';
const db = new Appwrite.Databases(client, DATABASE_ID);
const Query = window.Appwrite.Query;
let products = [];
let foundProducts = [];
let uniqueProducts = [];
let unrep = [] ;
let previousButton = null;
let lastDocumen = null;
let search = null;
window.updateDatabaseCartProduct = async function (productId) {
  if(!accountId){
    alert('please login to add the cart');
    return;
  }
  try {
    await db.createDocument(DATABASE_ID, CART_ID, 'unique()', {
       productId: productId,
       UserId: accountId,
    })

      alert("Product added to cart successfully!");
  } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to add product to cart.");
  };
}
window.showSidebar = function () {
  const sidebar = document.querySelector('.sidebar');
  sidebar.style.display = 'flex';
}
document.getElementById('showsidebarbtn').addEventListener('click', showSidebar)
const hidesidebarbtn = document.getElementById('hidesidebarbtn');

window.hideSidebar = function (){
    const sidebar = document.querySelector('.sidebar')
  sidebar.style.display = 'none'
}
hidesidebarbtn.addEventListener('click', hideSidebar)
window.goBackToMain = () => {
  document.getElementById('categories').style.display = "block";
  document.getElementById('home').style.display = "block";
  if( document.querySelector(".product-details-container")){
  document.getElementById("main-content").querySelector(".product-details-container").remove();}
  document.getElementById("subcategories").style.display = "none";



  const categoryButtons = document.querySelectorAll('.category-btn') 

  console.log(previousButton)
    // Attach the event listener
   // categoryloadMoreBtn2.addEventListener('click', categFunction);
  categoryButtons.forEach(button => {
    button.addEventListener('click',  async function(event) {
     
     homeProductList.innerHTML = '';
     lastDocum = null;
    
    
      const buttonClicked = event.target.closest('.category-btn');
      
      event.preventDefault()
      categoryloadMoreBtn2.style.display = "none";
      const buttonText = event.target.closest('.category-btn').textContent.trim();
      console.log(buttonText)
      document.getElementById('product-title').textContent = `products in ${buttonText}`;
      if ( buttonText === "View All"){
        document.getElementById("modal").classList.add("active");
        document.querySelector('#products h2').textContent = "Featured Products"
      location.reload()
      document.getElementById("modal").classList.remove("active");
        return
      }
     productNameOfProduct = 'noth';
     categoryOfProduct = buttonText;
     previousButton = buttonClicked;
    
     
     showSubcategories(buttonText);
     if(previousButton){
      await showSimilarProducts ('noth', buttonText)
      return
    }
   await    showSimilarProducts('noth', buttonText)
  
  
  
    })})
    

}

window.goBack = () => {
  // Show main categories again
  document.getElementById("categories").style.display = "block";
  document.getElementById("subcategories").style.display = "none";


   

  const categoryButtons = document.querySelectorAll('.category-btn') 

  console.log(previousButton)
    // Attach the event listener
   // categoryloadMoreBtn2.addEventListener('click', categFunction);
  categoryButtons.forEach(button => {
    button.addEventListener('click',  async function(event) {
     
     homeProductList.innerHTML = '';
     lastDocum = null;
    
    
      const buttonClicked = event.target.closest('.category-btn');
      
      event.preventDefault()
      categoryloadMoreBtn2.style.display = "none";
      const buttonText = event.target.closest('.category-btn').textContent.trim();
      console.log(buttonText)
      document.getElementById('product-title').textContent = `products in ${buttonText}`;
      if ( buttonText === "View All"){
        document.getElementById("modal").classList.add("active");
        document.querySelector('#products h2').textContent = "Featured Products"
      location.reload()
      document.getElementById("modal").classList.remove("active");
        return
      }
     productNameOfProduct = 'noth';
     categoryOfProduct = buttonText;
     previousButton = buttonClicked;
    
     
     showSubcategories(buttonText);
     if(previousButton){
      await showSimilarProducts ('noth', buttonText)
      return
    }
   await    showSimilarProducts('noth', buttonText)
  
  
  
    })})
    




}

function attachHoverEvents() {
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    card.addEventListener('mouseleave', () => {
      const dropdown = card.querySelector('.dropdown-content');
      if (dropdown) {
        dropdown.style.display = 'none';
      }
    });
  });
}


window.showProductInDetails =  async function (productId) {
  search = null;
  lastDocum = null;
  if( document.querySelector(".product-details-container")){
    document.getElementById("main-content").querySelector(".product-details-container").remove();
  }
  document.getElementById('categories').style.display = "none";
  document.getElementById('home').style.display = "none";
  if(document.getElementById("subcategories")){
  document.getElementById("subcategories").style.display = "none";}
  loadMoreBtn.style.display = "none" ; 
  categoryloadMoreBtn2.style.display = "none";
  searchloadMoreBtn.style.display = "none";
  subcategoryloadMoreBtn.style.display = "none";
  categoryloadMoreBtn.style.display = "block";
  
  console.log(uniqueProducts)
  const product =  uniqueProducts.find(aproduct => aproduct.$id === productId) ||  products.find(aproduct => aproduct.$id === productId) ;
  if (!product) {
    console.error("Product not found:", productId);
    alert("Product not found!");
    return;
  }
  console.log(product)
  sellerId = product.UserId;
  selectedProductId = product.$id;
  selectedProductCategory = product.category;
  fetchAverageRating()
   productNameOfProduct = product.Name;
   categoryOfProduct = product.category;
  main.innerHTML  += `
        <div class="product-details-container">
          <button onclick = 'goBackToMain()' style="position: absolute; top: 10px; right: 10px; background: red; color: white; border: none; padding: 5px 10px; font-size: 18px; cursor: pointer;">X</button>
      <div class="product-image">
        <img src="${product.image}" alt="${product.Name}">
      </div>
      <div class="product-info">
        <h2>${product.Name}</h2>
         <div class="average-stars" id="average-stars">
        ${generateStars(product.averageRating)}(${product.totalRatings}R)
      </div>
        <p>${product.description}</p>
        <p><strong>Price: BIF${product.price}</strong></p>
      </div>
      <div class="contact-buttons1" >
        <a id = "whatsapp-btn" href="" class="btn-contact"><svg xmlns="http://www.w3.org/2000/svg" height="20px" width="20px" fill="white"viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg></a>
        <a href="tel:${product.whatsapp}" class="btn-contact"><svg xmlns="http://www.w3.org/2000/svg" height="20px" width="20px" fill="white"viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg></a>
       <a class="btn-contact" onclick = " updateDatabaseCartProduct('${product.$id}')"><svg height="20" width="20" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg></a>
        <div  class="dropdown" >
                          <button class="dropdown-icon">...</button>
                          <div class="dropdown-content">
                              <button class="show-details-btn" onclick = " event.stopPropagation();showSeller()" >About Seller</button>
                              <button class ="edit-btn" onclick = "rate()" >Rate</button>
                             
                          </div>
                      </div>
       </div>
    </div>
      
  `;
  document.addEventListener("click", (event) => {
    if (!event.target.matches('.dropdown-icon')) {
      const dropdowns = document.querySelectorAll('.dropdown-content');
      dropdowns.forEach((dropdown) => {
        dropdown.style.display = 'none';
      });
    }
  });
  
  document.querySelector('.product-details-container').addEventListener("click", (event) => {
    if (event.target.classList.contains("dropdown-icon")) {
      const dropdownContent = event.target.nextElementSibling;
      dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
    }
  });
  attachHoverEvents(); // Reattach hover events
  const whatsappbtn = document.getElementById('whatsapp-btn');
  if (product.whatsapp) {
    whatsappbtn.href = `https://wa.me/${product.whatsapp.replace(/\D/g, "")}`;
    console.log(product.whatsapp.replace(/\D/g, "") )
    whatsappbtn.style.display = "inline-block"; // Show button
} else {
    whatsappbtn.remove() // Hide button if no WhatsApp
}


  await showSimilarProducts(product.Name, product.category);
  console.log(product.Name)

console.log(uniqueProducts)
document.querySelector('#products h2').textContent = "similar Products"

  window.scrollTo({
    top: 0,
    behavior: 'smooth' });
}
window.generateStars = (averageRating) => {
  let starsHtml = "";
  for (let i = 1; i <= 5; i++) {
      starsHtml += `<span class="${i <= Math.round(averageRating) ? 'gold' : 'white'}  ">★</span>`;
  }
  return starsHtml;
}

let lastDocument = null; // Store last document for pagination
let loading = false; // Prevent multiple requests

async function fetchProducts() {
    if (loading) return; // If already fetching, do nothing
    loading = true; // Set loading to true to prevent multiple fetches
   
    try {
      document.getElementById("modal").classList.add("active");
        let queries = [
          window.Appwrite.Query.orderDesc("$createdAt"),
            window.Appwrite.Query.limit(6),
          
           // Fetch 10 products at a time
        ];

        // Use cursorAfter only if lastDocument is not null
        if (lastDocument) {
            queries.push(window.Appwrite.Query.cursorAfter(lastDocument.$id));
        }
       
        let response = await db.listDocuments(DATABASE_ID, SELLER_PRODUCTS_ID, queries);
        products = [...products, ...response.documents];
        console.log(products)
        if (response.documents.length > 0) {
            lastDocument = response.documents[response.documents.length - 1]; // Update last document
            console.log("Updated lastDocument:", lastDocument);
            displayProducts(response.documents); // Function to render products on UI
        } if(response.documents.length < 6) {
          loadMoreBtn.style.display = "none";
            console.log("No more products to load.");
        }
        document.getElementById("modal").classList.remove("active");
    } catch (error) {
        console.error("Error fetching products:", error);
        document.getElementById("modal").classList.remove("active");
    }
    
    loading = false; // Reset loading after request is done
}

// Initial fetch
fetchProducts();
loadMoreBtn.addEventListener('click', fetchProducts)




const displayProducts = (products) => {

  
 loadingHtml.forEach((el) => el.style.display = "none")
console.log(products)

  products.forEach((product,index) => {  // Now iterating over the correct variable
    homeProductList.innerHTML += `
      <div onclick = showProductInDetails('${product.$id}') class="product-card">
        <div>
          <h3 style="padding: 0; margin: 0; gap: 0;">${product.Name}</h3>
          <img  src="${product.image}" alt="${product.Name}"> 
        </div> 
        <div class="product-details">
          <p class="price">BIF       ${product.price}</p>
          <div class="average-stars-display" id="average-stars">
        ${generateStars(product.averageRating)}(${product.totalRatings}R)
      </div>
          <div class="product-details">
            <p class="description"> ${product.description.length > 50 ? product.description.substring(0, 50) + '...' : product.description}</p>
          </div>
        </div>
      </div>`;
  });

} 


   let loadi = false;
   let lastDocum = null;
   
   window.showSimilarProducts = async function(productName, category) {
    document.getElementById("modal").classList.add("active");
    loadMoreBtn.style.display = "none" ; 
       categoryloadMoreBtn2.style.display = "none";
       searchloadMoreBtn.style.display = "none";
       subcategoryloadMoreBtn.style.display = "none";
    if(loadi)return
    loadi = true;
  productName = productName;
  category = category;
   
    categoryloadMoreBtn.style.display = "block"
    try {
      const orQuery = Query.or([
        Query.equal('Name', productName),
        Query.equal('category', category)]
    );
    const queries = [
      orQuery,
      Query.orderDesc('CreatedAt'),
      window.Appwrite.Query.limit(2),
    ];
    if (lastDocum) {
      queries.push(window.Appwrite.Query.cursorAfter(lastDocum.$id));
  }
  console.log(lastDocum);
  if(lastDocum == null && search == null ){
  homeProductList.innerHTML = '';}
  
      const nameOrCategoryResponse = await db.listDocuments(
        
          DATABASE_ID,
          SELLER_PRODUCTS_ID,
          queries)
         
          foundProducts = nameOrCategoryResponse.documents;
          console.log(foundProducts)
                // 4. Remove duplicate products (in case some appear in both searches)
           
             
             
                let seenIds = new Set();
                
                for (let product of foundProducts) {
                    if (!seenIds.has(product.$id)) {
                      unrep.push(product)
                        uniqueProducts.push(product);
                        seenIds.add(product.$id);
                    }
                }
         
          if (nameOrCategoryResponse.documents.length > 0) {
              lastDocum = nameOrCategoryResponse.documents[nameOrCategoryResponse.documents.length - 1]; // Update last document
              console.log("Updated lastDocument:", lastDocum);
             
            displayProducts(nameOrCategoryResponse.documents)
              // Function to render products on UI
          } if(nameOrCategoryResponse.documents.length < 2) {
            categoryloadMoreBtn.style.display = "none";
              console.log("No more products to load.");
          }
      
      console.log(nameOrCategoryResponse.documents)
      document.getElementById("modal").classList.remove("active");
  
        // 3. Merge results, prioritizing name matches
     
        console.log(uniqueProducts)
    } catch (error) {
        console.error("Error fetching products:", error);
        homeProductList.innerHTML = "Error loading products. Please try again.";
        document.getElementById("modal").classList.remove("active");
    }
    loadi = false;
  };
  categoryloadMoreBtn.addEventListener('click', () =>
  
    showSimilarProducts(productNameOfProduct, categoryOfProduct)
  );


const categoryButtons = document.querySelectorAll('.category-btn') 


  // Attach the event listener
 // categoryloadMoreBtn2.addEventListener('click', categFunction);
categoryButtons.forEach(button => {
  button.addEventListener('click',  async function(event) {
    if(previousButton){
   homeProductList.innerHTML = '';
   lastDocum = null;
  
};

    const buttonClicked = event.target.closest('.category-btn');
    
    event.preventDefault()
    categoryloadMoreBtn2.style.display = "none";
    const buttonText = event.target.closest('.category-btn').textContent.trim().toLowerCase().replace('-', '');
    console.log(buttonText)
    document.getElementById('product-title').textContent = `products in ${buttonText}`;
    if ( buttonText === "View All"){
      document.getElementById("modal").classList.add("active");
      document.querySelector('#products h2').textContent = "Featured Products"
    location.reload()
    document.getElementById("modal").classList.remove("active");
      return
    }
    
    showSubcategories(buttonText);
   productNameOfProduct = 'noth';
   categoryOfProduct = buttonText;
   previousButton = buttonClicked;
   if(previousButton){
    await showSimilarProducts ('noth', buttonText)
    return
  }
 await    showSimilarProducts('noth', buttonText)



  })})
  
// categorySearch()


let loadin = false;
window.searchProducts = async function() {
  document.getElementById('products').scrollIntoView({ behavior: 'smooth', block: 'start' });
  searchloadMoreBtn.style.display = "none";
  categoryloadMoreBtn.style.display = "none";
  categoryloadMoreBtn2.style.display = "none";
 subcategoryloadMoreBtn.style.display = "none";
  loadMoreBtn.style.display = "none";
  uniqueProducts = [];
  lastDocum = null;
  document.getElementById("modal").classList.add("active");
 
  goBackToMain();

  const searchInputValue = searchInput.value || smallsearchInput.value;
 
  if (!searchInputValue) {
      alert("Please enter a product name to search.");
      return;
  }
 
  document.getElementById('product-title').textContent = searchInputValue;
  
 homeProductList.innerHTML = '';
      if (loadin) return; // If already fetching, do nothing
      loadin = true; // Set loading to true to prevent multiple fetches
     console.log(searchInputValue)
      try {
          let queries = [
            window.Appwrite.Query.orderDesc("CreatedAt"),
              window.Appwrite.Query.limit(30),
              window.Appwrite.Query.equal('Name', searchInputValue)
             // Fetch 10 products at a time
          ];
  
          
      
          let response = await db.listDocuments(DATABASE_ID, SELLER_PRODUCTS_ID, queries);
        
        
          if (response.documents.length > 0) {
            search = true;
            
              response.documents.forEach((prod) =>
              uniqueProducts.push(prod)
              ) // Update last document
              console.log("Updated lastDocument:", lastDocumen);
              displayProducts(response.documents); // Function to render products on UI
          } 
         
          document.getElementById("modal").classList.remove("active");
      } catch (error) {
          console.error("Error fetching products:", error);
          homeProductList.innerHTML = "Error loading products. Please try again.";
          document.getElementById("modal").classList.remove("active");
      }
      
      loadin = false; // Reset loading after request is done
      searchResultsContainer.style.display = "none";
      smallsearchResultsContainer.style.display = "none"
};



const showFilteredSearchHistory = async () => {
  const collectionId = "67c2c8900005644a66d9";
  const documentId = "67c2cbee00257344ec2b";

  try {
      // Get stored product names
      const doc = await db.getDocument(DATABASE_ID, collectionId, documentId);
      const productNames = doc.names || [];
  console.log(productNames)
      // Filter results based on search query
      const results = productNames
     
  let searchTerm = searchInput.value.trim().toLowerCase() 

  searchResultsContainer.innerHTML = "";

  // If input is empty, show full history
  let filteredHistory = searchTerm 
      ? results.filter(item => item.toLowerCase().startsWith(searchTerm)) 
      : results;

  // Display results
  filteredHistory.forEach(term => {
      let item = document.createElement("div");
      item.classList.add("search-result-item");
      item.textContent = term;
      item.onclick = () => {
        searchResultsContainer.style.display = 'none'
          searchInput.value = term;
          window.searchProducts(); // Perform search when clicking a history item
      };
      searchResultsContainer.appendChild(item);
  });

  searchResultsContainer.style.display = filteredHistory.length > 0 ? "block" : "none";
      console.log("Search results:", results);
      // Display search results in UI
  } catch (error) {
      console.error("Error fetching search data:", error);
  }
  
};

// Call this function when user types in the search bar


// Show full history when the user first focuses on the input


// Filter history as the user types
searchInput.addEventListener("input", function () {
  if (searchInput.value.length > 0) {
    console.log("showFilteredSearchHistory called");
     showFilteredSearchHistory();
  } else {
    console.log("showFilteredSearchHistory not called");
      clearSearchHistory(); // Add this function to clear the displayed results
  }
});
function clearSearchHistory() {
  // Example: Remove search history results from the UI
  document.getElementById("doll").innerHTML = ""; 
  document.getElementById('doll').style.display = "none";
}






const showSmallFilteredSearchHistory = async () => {
  const collectionId = "67c2c8900005644a66d9";
  const documentId = "67c2cbee00257344ec2b";

  try {
      // Get stored product names
      const doc = await db.getDocument(DATABASE_ID, collectionId, documentId);
      const productNames = doc.names || [];
  console.log(productNames)
      // Filter results based on search query
      const results = productNames
     
  let searchTerm = smallsearchInput.value.trim().toLowerCase() 

  smallsearchResultsContainer.innerHTML = "";

  // If input is empty, show full history
  let filteredHistory = searchTerm 
      ? results.filter(item => item.toLowerCase().startsWith(searchTerm)) 
      : results;

  // Display results
  filteredHistory.forEach(term => {
      let item = document.createElement("div");
      item.classList.add("search-result-item");
      item.textContent = term;
      item.onclick = () => {
        smallsearchResultsContainer.style.display = 'none'
          smallsearchInput.value = term;
          window.searchProducts(); // Perform search when clicking a history item
      };
      smallsearchResultsContainer.appendChild(item);
  });

  smallsearchResultsContainer.style.display = filteredHistory.length > 0 ? "block" : "none";
      console.log("Search results:", results);
      // Display search results in UI
  } catch (error) {
      console.error("Error fetching search data:", error);
  }
  
};

// Call this function when user types in the search bar


// Show full history when the user first focuses on the input


// Filter history as the user types
smallsearchInput.addEventListener("input", function () {
  if (smallsearchInput.value.length > 0) {
    console.log("showFilteredSearchHistory called");
     showSmallFilteredSearchHistory();
  } else {
    console.log("showFilteredSearchHistory not called");
      clearSmallSearchHistory(); // Add this function to clear the displayed results
  }
});
function clearSmallSearchHistory() {
  // Example: Remove search history results from the UI
  document.getElementById("small-doll").innerHTML = ""; 
 
}







 

window.rate = async function ()  {
  if(!accountId){
    alert('please Login to rate');
    return
  }
  if(document.getElementById('seller')){
  document.getElementById('seller').remove()};
  console.log(modalOverlay);
  modalOverlay.style.display = 'flex'; // Remove extra space in 'flex '
  console.log(modalProductDetails);
 
    // Dummy placeholder values before fetching real data
   
     
    
  // Add an event listener to the close button
  closeModalBtn.addEventListener('click', closeModal);

  console.log(modalOverlay.outerHTML);

  // Prevent interactions with the rest of the page
  document.body.style.overflow = 'hidden'; // Disable scrolling
};

function closeModal() {
  // Hide the modal overlay
  modalOverlay.style.display = 'none';
  
  // Re-enable scrolling on the body
  document.body.style.overflow = 'auto';
  
  
}

// Replace with logged-in user ID

const RATINGS_ID = "67bc3012002f2ad8694d";
async function checkUserRating() {
  const response = await db.listDocuments(DATABASE_ID, RATINGS_ID, [
      Appwrite.Query.equal("UserId", accountId),
      Appwrite.Query.equal("productId", selectedProductId)
  ]);
  return response.documents.length > 0 ? response.documents[0] : null;
}

window.submitRating = async function() {
 
  const selectedRating = document.querySelector('input[name="rating"]:checked');
  if (!selectedRating) {
      alert("Please select a rating before submitting.");
      return;
  }
  document.getElementById("modal").classList.add("active");
  const rating = parseInt(selectedRating.value);
  console.log(rating)
  const existingRating = await checkUserRating();
  if (existingRating) {
      alert("You have already rated this product.");
      document.getElementById("modal").classList.remove("active");
      return;
      
  }
  await db.createDocument(DATABASE_ID, RATINGS_ID, 'unique()', {
      UserId: accountId,
      productId: selectedProductId,
      rating: rating
  });
 
  alert("Rating submitted! To see the new rating, refresh and search for the product Again");
  fetchAverageRating();
  
 uniqueProducts = [];

  document.getElementById("modal").classList.remove("active");
 
 
}

async function fetchAverageRating() {
  console.log(selectedProductId)
  const response = await db.listDocuments(DATABASE_ID, RATINGS_ID, [
      Appwrite.Query.equal("productId", selectedProductId)
  ]);
  console.log(response.documents)
  const ratings = response.documents.map(doc => doc.rating);
  const totalRatings = ratings.length;
  const average = ratings.reduce((a, b) => a + b, 0) / totalRatings || 0;
  
  document.getElementById("average-rating").innerText = `Average Rating: ${average.toFixed(1)} (${totalRatings} ratings)`;
  
  // Update star display
  
  console.log(averageStars)
  averageStars.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
      const star = document.createElement("span");
      star.innerText = "★";
      if (i <= Math.round(average)) {
        star.classList.add("gold");
        console.log(star.classList.value)
    } else {
        star.classList.add("white"); // or any other class for unfilled stars
    }
   
      averageStars.appendChild(star);
  }
  try {
    await db.updateDocument(DATABASE_ID, SELLER_PRODUCTS_ID, selectedProductId, {
        averageRating: Math.round(average), 
        totalRatings: totalRatings,
    });
    console.log("Updated product average rating successfully.");
} catch (error) {
    console.error("Failed to update product rating:", error);
}

}

document.getElementById("submit-rating").addEventListener("click", submitRating);

  fetchAverageRating();


  window.showSeller = async () => {
    modalOverlay2.style.display = 'flex';
   
    // Dummy placeholder values before fetching real data
   
    console.log(sellerId)
    try {
        
      document.getElementById("modal").classList.add("active");
        // Fetch seller data from Appwrite
        const respo = await db.listDocuments(DATABASE_ID, SELLER_REGISTRATION_ID,[
          window.Appwrite.Query.equal('$id', sellerId)
        ]);
         const response = respo.documents;
         console.log(response)
        // Check if seller data exists
        if (!respo) {
            modalProductDetails2.innerHTML += `<p>Error: Seller not found</p>`;
            return;
        }

        // Update modal with fetched seller data
        modalProductDetails2.innerHTML += `
            <div id = 'seller'>
                <h3>Review Seller Information</h3>
                <img src="${response[0].profile || '/icons/user.svg'}" alt="Profile Preview" 
                     style="display: block; width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin: auto;">
                ${response[0].Name ? `<p><strong>Full Name:</strong> ${response[0].Name}</p>` : ""}
                ${response[0].businessName ? `<p><strong>Business Name:</strong> ${response[0].businessName}</p>` : ""}
                ${response[0].phoneNumber ? `<p><strong>Phone Number:</strong> ${response[0].phoneNumber}</p>` : ""}
                ${response[0].whatsAppNumber ? `<p><strong>WhatsApp Number:</strong> ${response[0].whatsAppNumber}</p>` : ""}
                ${response[0].email ? `<p><strong>Email:</strong> ${response[0].email}</p>` : ""}
                ${response[0].location ? `<p><strong>Location:</strong> ${response[0].location}</p>` : ""}
                ${response[0].businessDescription ? `<p><strong>Business Description:</strong> ${response[0].businessDescription}</p>` : ""}
            </div>
        `;
        document.getElementById("modal").classList.remove("active");
    } catch (error) {
        console.error("Error fetching seller:", error);
        document.getElementById("modal").classList.remove("active");
        modalProductDetails2.innerHTML = `<p>Error fetching seller details</p>`;
    }

    // Prevent interactions with the rest of the page
    document.body.style.overflow = 'hidden';

    // Add close event
    closeModalBtn2.addEventListener('click', closeModal2);
};
function closeModal2() {
  // Hide the modal overlay
  modalOverlay2.style.display = 'none';
  
  // Re-enable scrolling on the body
  document.body.style.overflow = 'auto';
  
  
}

window.showSubcategories = (category) =>  {
  // Hide categories
  document.getElementById("categories").style.display = "none";
  document.getElementById("subcategories-header").textContent = category;
console.log(category)
  // Get subcategories for the selected category
  const subcategories = categories[category.toLowerCase().replace(/[-]/,'')] || [];
  subcat = subcategories;
console.log(subcategories)
  // Show subcategories
  const subcategoriesList = document.getElementById("subcategories-list");
  subcategoriesList.innerHTML = ""; // Clear previous subcategories

  subcategories.forEach(subcategory => {
      const button = document.createElement("button");
      button.innerText = subcategory;
      button.classList.add("category-btn")
      button.onclick = () => searchBySubcategory(subcategory,button);
    
      subcategoriesList.appendChild(button);
  });

  document.getElementById("subcategories").style.display = "block";
}

let previoussub = false;

let lastDoc = null;
let loa = false;


async function searchBySubcategory (subcategory,button)  {
  location.href='#products';
  lastDocum = null;
  uniqueProducts = []
  if(previoussub !== false){
    previoussub.classList.remove('first')
  }
  previoussub = button
  button.classList.add('first');
  console.log(document.getElementById('product-title'))
  document.getElementById('product-title').textContent = subcategory;
  homeProductList.innerHTML = '';
  loadMoreBtn.style.display = "none" ; 
     categoryloadMoreBtn.style.display = "none";
     searchloadMoreBtn.style.display = "none";
   
  categoryloadMoreBtn2.style.display = 'none';
  subcategoryloadMoreBtn.style.display = 'block';
  subcategoryterm = subcategory;
 console.log(subcategoryterm);

    
    lastDoc = null;
 console.log(subcategoryterm ? subcategoryterm: 'nothing')
 

await subfunction()
subcategoryloadMoreBtn.removeEventListener("click", subfunction);
subcategoryloadMoreBtn.addEventListener("click", subfunction);
}


async function subfunction ()  {
  document.getElementById("modal").classList.add("active");
  if(lastDoc == null){
homeProductList.innerHTML = '';}
     if (loa) return; // If already fetching, do nothing
     loa = true; // Set loading to true to prevent multiple fetches
    
     try {
         let queries = [
           window.Appwrite.Query.orderDesc("CreatedAt"),
             window.Appwrite.Query.limit(2),
             window.Appwrite.Query.equal('subCategory', subcategoryterm)
            // Fetch 10 products at a time
         ];
 
         // Use cursorAfter only if lastDocument is not null
         if (lastDoc) {
             queries.push(window.Appwrite.Query.cursorAfter(lastDoc.$id));
         }
        
        
         let response = await db.listDocuments(DATABASE_ID, SELLER_PRODUCTS_ID, queries);
         console.log( response.documents);
        
         if (response.documents.length > 0) {
             lastDoc = response.documents[response.documents.length - 1];
             response.documents.forEach((prod) => {
              uniqueProducts.push(prod)
             })   // Update last document
             console.log("Updated lastDocument:", lastDoc);
             displayProducts(response.documents); // Function to render products on UI
         } if(response.documents.length < 2 ) {
             subcategoryloadMoreBtn.style.display = "none";
             console.log("No more products to load.");
         }
         document.getElementById("modal").classList.remove("active");
     } catch (error) {
      document.getElementById("modal").classList.remove("active");
         console.error("Error fetching products:", error);
         alert('please check Your Internet Connection')
     }
     
     loa = false; // Reset loading after request is done
    }