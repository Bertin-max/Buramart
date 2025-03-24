







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
  electronique: ["Smartphones", "Ordinateurs portables", "Tablettes", "Appareils photo", "Casques audio", "Montres connectées", "Consoles de jeu", "Télévisions", "Haut-parleurs"],
  vêtements: ["Vêtements homme", "Vêtements femme", "Vêtements enfants", "Chaussures", "Sacs", "Accessoires", "Chapeaux", "Montres", "Lunettes"],
  électroménager: ["Réfrigérateurs", "Micro-ondes", "Machines à laver", "Climatiseurs", "Aspirateurs", "Lave-vaisselle", "Chauffe-eau", "Ventilateurs", "Cafetières"],
  livres: ["Fiction", "Non-fiction", "Éducatif", "Bandes dessinées & Romans graphiques", "Biographies", "Développement personnel", "Science & Technologie", "Livres pour enfants", "Policier & Thriller"],
  beauté: ["Soins de la peau", "Maquillage", "Soins capillaires", "Parfums", "Soins des ongles", "Soins pour hommes", "Outils de beauté", "Bain & Corps", "Hygiène bucco-dentaire"],
  jouets: ["Figurines", "Poupées", "Jeux de société", "Blocs de construction", "Jouets télécommandés", "Jouets éducatifs", "Jouets d'extérieur", "Peluches", "Jouets musicaux"],
  meubles: ["Meubles de salon", "Meubles de chambre", "Meubles de salle à manger", "Meubles de bureau", "Meubles d'extérieur", "Solutions de rangement", "Meubles pour enfants", "Matelas", "Éclairage"],
  sport: ["Équipement de fitness", "Sports de plein air", "Sports collectifs", "Sports nautiques", "Cyclisme", "Sports de raquette", "Sports de combat", "Équipement de course"],
  santé: ["Vitamines & Compléments", "Soins personnels", "Fournitures médicales", "Fitness & Nutrition", "Dispositifs de bien-être", "Gestion du poids", "Premiers secours", "Hygiène bucco-dentaire", "Santé mentale"],
  automobile: ["Accessoires auto", "Accessoires moto", "Entretien auto", "Pneus & Roues", "GPS & Navigation", "Électronique auto", "Huiles & Fluides", "Pièces de rechange", "Outils & Équipements"],
  alimentation: ["Fruits & Légumes", "Produits laitiers & Œufs", "Viande & Fruits de mer", "Snacks", "Boissons", "Produits en conserve", "Boulangerie", "Condiments & Épices", "Produits surgelés"],
  
 
};



let subcategoryterm = "";
let productNameOfProduct = '';
let categoryOfProduct = '';
let subcategoryOfProduct = '';
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
const slidesContainer = document.getElementById('slides-container');
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
let productNamesArray = [];
let previousButton = null;
let lastDocumen = null;
let search = null;
window.updateDatabaseCartProduct = async function (productId) {
  if(!accountId){
    alert('Veuillez vous connecter pour ajouter au panier.');
    return;
  }
  try {
    await db.createDocument(DATABASE_ID, CART_ID, 'unique()', {
       productId: productId,
       UserId: accountId,
    })

      alert( "Produit ajouté au panier avec succès !");
  } catch (error) {
      console.error("Error updating product:", error);
      alert("Échec de l'ajout du produit au panier. Veuillez vérifier votre réseau");
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
      const buttonText = event.target.closest('.category-btn').textContent.trim().toLowerCase().replace('-', '');;
      console.log(buttonText)
      document.getElementById('product-title').textContent = `${buttonText}`;
      if ( buttonText === "tout"){
        document.getElementById("modal").classList.add("active");
        document.querySelector('#products h2').textContent = "Tout"
      location.reload()
      document.getElementById("modal").classList.remove("active");
        return
      }
    categoryOfProduct = buttonText;
    console.log(categoryOfProduct)
     productNameOfProduct = '';
     subcategoryOfProduct = "";
    
     previousButton = buttonClicked;
    
     
     showSubcategories(buttonText);
     if(previousButton){
      categoryOfProduct = buttonText;
      await showSimilarProducts ('noth', "noth")
      return
    }
   await    showSimilarProducts('noth', "noth")
  
  
  
    })})
    

}

window.goBack = () => {
  // Show main categories again
  document.getElementById("categories").style.display = "block";
  document.getElementById("subcategories").style.display = "none";
document.getElementById('home').style.display = "block"

   

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
      const buttonText = event.target.closest('.category-btn').textContent.trim().toLowerCase().replace('-', '');
      console.log(buttonText)
      document.getElementById('product-title').textContent = `${buttonText}`;
      if ( buttonText === "tout"){
        document.getElementById("modal").classList.add("active");
        document.querySelector('#products h2').textContent = "Tout"
      location.reload()
      document.getElementById("modal").classList.remove("active");
        return
      }
     productNameOfProduct = 'noth';
     subcategoryOfProduct = '';
     categoryOfProduct = buttonText;
     previousButton = buttonClicked;
    
     
     showSubcategories(buttonText);
     if(previousButton){
      await showSimilarProducts ('noth', "noth")
      return
    }
   await    showSimilarProducts('noth', "noth")
  
  
  
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
    alert("Produit non trouvé");
    return;
  }
  console.log(product)
  sellerId = product.UserId;
  selectedProductId = product.$id;
  const productUrl = `https://buramart.netlify.app/?id=${product.$id}`
  selectedProductCategory = product.category;
  fetchAverageRating()
   productNameOfProduct = product.Name;
   categoryOfProduct = "";
   subcategoryOfProduct = product.subCategory;
  main.innerHTML  += `
        <div class="product-details-container">
          <button onclick = 'goBackToMain()' style="position: absolute; top: 10px; right: 10px; background: red; color: white; border: none; padding: 5px 10px; font-size: 18px; cursor: pointer;">X</button>
      <div class="product-image">
        <img src="${product.image1}" alt="${product.Name}" id = "prev-img">
         <button id="prevButton">&#10094;</button>
        <button id="nextButton">&#10095;</button>
      </div>
      <div class="product-info">
        <h2>${product.Name}</h2>
         <div class="average-stars" onclick = "rate()" id="average-stars">
        ${generateStars(product.averageRating)}(${product.totalRatings}R)
      </div>
        <p>${product.description}</p>
        <p><strong>Price: BIF${product.price}</strong></p>
      </div>
      <div class="contact-buttons1" >
        <a id="copy-link-button" class="btn-contact"> <svg height = 20px width = 20px fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"/></svg> </button>
        <a href="tel:${product.phone}" class="btn-contact"><svg xmlns="http://www.w3.org/2000/svg" height="20px" width="20px" fill="white"viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg></a>
       <a class="btn-contact" onclick = " updateDatabaseCartProduct('${product.$id}')"><svg height="20" width="20" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg></a>
        <div  class="dropdown" >
                          <button class="dropdown-icon" onclick = " event.stopPropagation();showSeller()">...</button>
                          <div class="dropdown-content">
                              <button class="show-details-btn"  >Infrormation sur le vendeur</button>
                             
                             
                          </div>
                      </div>
       </div>
    </div>
      
  `;
  /*document.addEventListener("click", (event) => {
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
  });*/
  const nextBtn = document.getElementById('nextButton');
  const prevBtn = document.getElementById('prevButton');
  function disableButtons() {
    nextBtn.disabled = true;
    prevBtn.disabled = true;
    setTimeout(() => {
      nextBtn.disabled = false;
      prevBtn.disabled = false;
    }, 300); // Adjust delay if needed
  }
  // Prevent interactions with the rest of the page
  document.body.style.overflow = 'hidden'; // Disable scrolling
  
  // Function to move slides
  let previousImageNumber = 1;
  
  // Determine total number of images dynamically
  let totalNumberOfImages = 1;
  for (let i = 2; i <= 4; i++) {
    if (product[`image${i}`]) {
      totalNumberOfImages = i;
    }
  }
  console.log(totalNumberOfImages);
  
  // Hide buttons if only one image exists
  if (totalNumberOfImages === 1) {
    nextBtn.style.display = "none";
    prevBtn.style.display = "none";
  }
  
  // Function to update image source
  function moveimages() {
    document.getElementById('prev-img').src = product[`image${previousImageNumber}`];
  }
  
  // Next button click event
  


  function handleNext() {
    if (nextBtn.disabled) return; // Prevent multiple clicks
    disableButtons();
    if (previousImageNumber === totalNumberOfImages) {
      previousImageNumber = 1;
    } else {
      previousImageNumber++;
    }
    moveimages(); // Call only once
  }
  function handlePrev() {
    if (prevBtn.disabled) return; // Prevent multiple clicks
    disableButtons();
    if (previousImageNumber === 1) {
      previousImageNumber = totalNumberOfImages;
    } else {
      previousImageNumber--;
    }
    moveimages(); // Call only once
  }
  // Ensure only one event listener per button
nextBtn.removeEventListener("click", handleNext);
prevBtn.removeEventListener("click", handlePrev);

nextBtn.addEventListener("click", handleNext);
prevBtn.addEventListener("click", handlePrev);
  const copyLinkButton = document.querySelector('#copy-link-button');
  copyLinkButton.addEventListener('click', function() {
    // Get the product ID from the closest parent product div
    
    
   
    
    copyToClipboard(productUrl);
});
// Get all 'Copy Link' buttons
const copyLinkButtons = document.querySelectorAll('.copy-link-button');

// Add event listener for each 'Copy Link' button
copyLinkButtons.forEach(button => {
    button.addEventListener('click', function(event) {
        // Get the product ID from the closest parent product div
        const productId = event.target.closest('.product').getAttribute('data-id');
        
        // Construct the product URL
        const productUrl = `https://buramart.netlify.app/?id=${productId}`;
        
        // Copy the URL to the clipboard
        copyToClipboard(productUrl);
    });
});



// Function to copy text to the clipboard using the Clipboard API
async function copyToClipboard(text) {
    try {
        // Write the text to the clipboard
        await navigator.clipboard.writeText(text);
        
        // Optionally, notify the user that the link has been copied
        alert('Product link copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy the product link!');
    }
}


  attachHoverEvents(); // Reattach hover events
  /*
  const whatsappbtn = document.getElementById('whatsapp-btn');
  if (product.whatsapp) {
    whatsappbtn.href = `https://wa.me/${product.whatsapp.replace(/\D/g, "")}`;
    console.log(product.whatsapp.replace(/\D/g, "") )
    whatsappbtn.style.display = "inline-block"; // Show button
} else {
    whatsappbtn.remove() // Hide button if no WhatsApp
}
*/

  await showSimilarProducts(product.Name, product.subcategory);
  console.log(product.Name)

console.log(uniqueProducts)
document.querySelector('#products h2').textContent = "Produits similaire"

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
          window.Appwrite.Query.orderDesc("totalRatings"),
            window.Appwrite.Query.limit(18),
          
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
        } if(response.documents.length < 18) {
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

window.shuffleArray = function(array) {
  for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // Get random index
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}


const displayProducts = (products) => {

  let shuffledProducts = shuffleArray([...products]); 
 loadingHtml.forEach((el) => el.style.display = "none")
console.log(products)

  shuffledProducts.forEach((product,index) => {  // Now iterating over the correct variable
    homeProductList.innerHTML += `
      <div onclick = showProductInDetails('${product.$id}') class="product-card">
        <div>
          <h3 style="padding: 0; margin: 0; gap: 0;">${product.Name}</h3>
          <img  src="${product.image1}" alt="${product.Name}"> 
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
   
   window.showSimilarProducts = async function(productName, subcategory) {
    document.getElementById("modal").classList.add("active");
    loadMoreBtn.style.display = "none" ; 
       categoryloadMoreBtn2.style.display = "none";
       searchloadMoreBtn.style.display = "none";
       subcategoryloadMoreBtn.style.display = "none";
    if(loadi)return
    loadi = true;
  productName = productName;
  subcategory = subcategory;
   
    categoryloadMoreBtn.style.display = "block"
    try {
      let orQuery = Query.or([
        Query.equal('Name', productName),
        Query.equal('subCategory', subcategoryOfProduct)
    ]);
    if(categoryOfProduct){
      orQuery = Query.or([
        Query.equal('Name', productName),
        Query.equal('category', categoryOfProduct)
    ]);
   
    }
    console.log(categoryOfProduct)
    const queries = [
      orQuery,
      Query.orderDesc('CreatedAt'),
      window.Appwrite.Query.limit(10),
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
          } if(nameOrCategoryResponse.documents.length < 10) {
            categoryloadMoreBtn.style.display = "none";
              console.log("No more products to load.");
          }
      
      console.log(nameOrCategoryResponse.documents)
      document.getElementById("modal").classList.remove("active");
  
        // 3. Merge results, prioritizing name matches
     
        console.log(uniqueProducts)
    } catch (error) {
        console.error("Error fetching products:", error);
        homeProductList.innerHTML = "Erreur lors du chargement des produits. Veuillez réessayer.";
        document.getElementById("modal").classList.remove("active");
    }
    loadi = false;
  };
  categoryloadMoreBtn.addEventListener('click', () =>{
    if(categoryOfProduct){
      showSimilarProducts('noth', 'noth');
    }
    showSimilarProducts(productNameOfProduct, subcategoryOfProduct)}
  );


const categoryButtons = document.querySelectorAll('.category-btn') 


  // Attach the event listener
 // categoryloadMoreBtn2.addEventListener('click', categFunction);
categoryButtons.forEach(button => {
  button.addEventListener('click',  async function(event) {
    if(previousButton){
   
   lastDocum = null;
  
};
homeProductList.innerHTML = '';
    const buttonClicked = event.target.closest('.category-btn');
    
    event.preventDefault()
    categoryloadMoreBtn2.style.display = "none";
    const buttonText = event.target.closest('.category-btn').textContent.trim().toLowerCase().replace('-', '');
    console.log(buttonText);
    
    document.getElementById('product-title').textContent = `${buttonText}`;
    if ( buttonText === "tout"){
      document.getElementById("modal").classList.add("active");
      document.querySelector('#products h2').textContent = "Tout"
    location.reload()
    document.getElementById("modal").classList.remove("active");
      return
    }
    
    showSubcategories(buttonText);
   productNameOfProduct = 'noth';
   subcategoryOfProduct = '';
   categoryOfProduct = buttonText;
   previousButton = buttonClicked;
   if(previousButton){
    await showSimilarProducts ('noth', "noth")
    return
  }
 await    showSimilarProducts('noth', "noth")



  })})
  
// categorySearch()


let loadin = false;
let searchValue = "";
let attempt = 0;
window.searchProducts = async function() {
  productNameOfProduct = '';
   subcategoryOfProduct = '';
  categoryOfProduct = '';
  document.getElementById('categories').style.display = "none";
  document.getElementById('home').style.display = "none";
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
  document.getElementById('categories').style.display = "none";
  document.getElementById('home').style.display = "none";
  const searchInputValue = searchValue || searchInput.value || smallsearchInput.value;
 
  if (!searchInputValue) {
      alert("Veuillez entrer un nom de produit pour effectuer la recherche.");
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
              window.Appwrite.Query.limit(20),
              window.Appwrite.Query.search('Name', searchInputValue)
             // Fetch 10 products at a time
          ];
  
          
      
          let response = await db.listDocuments(DATABASE_ID, SELLER_PRODUCTS_ID, queries);
         
          if (response.documents.length === 0) {
            console.log("No exact match found, searching word by word...");
      
            const words = searchInputValue.trim().split(/\s+/); // Split input into words
      
            for (let i = 0; i < words.length && attempt < 5; i++) {
              let word = words[i];
              console.log(`Attempt ${attempt + 1}: Checking if '${word}' is a valid product name...`);
      
              if (productNamesArray.includes(word)) { // Check if word is in productNamesArray
                console.log(`Match found: ${word}, restarting search...`);
                searchValue = word;
                attempt++
                searchProducts(); // Restart search with found word, increment attempt
                return; // Stop further execution
              }
             
            }
      
            console.log("No matching words found in product names array after 5 attempts.");
            homeProductList.innerHTML = "Aucun produit trouvé.";
            attempt = 0;
            searchValue = "";
          }

           else {
            attempt = 0;
            searchValue = "";
            search = true;
             console.log(response.documents)
              response.documents.forEach((prod) =>
              uniqueProducts.push(prod)
              ) // Update last document
              console.log("Updated lastDocument:", lastDocumen);
              displayProducts(response.documents); // Function to render products on UI
          } 
         
          document.getElementById("modal").classList.remove("active");
      } catch (error) {
          console.error("Error fetching products:", error);
          homeProductList.innerHTML ="Erreur lors du chargement des produits. Veuillez réessayer.";
          document.getElementById("modal").classList.remove("active");
      }
      
      loadin = false; // Reset loading after request is done
      searchResultsContainer.style.display = "none";
      smallsearchResultsContainer.style.display = "none"
};

document.getElementById("search-input").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
      event.preventDefault(); // Prevents default form submission (if inside a form)
      if (this.value.trim() !== "") {
          searchProducts();
      }
  }
});
document.getElementById("small-search-input").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
      event.preventDefault(); // Prevents default form submission (if inside a form)
      if (this.value.trim() !== "") {
          searchProducts();
      }
  }
});
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
      productNamesArray = results;
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
// Ensure the search input exists before adding the event listener
if (searchInput) {
  searchInput.addEventListener("input", function () {
    let inputValue = searchInput.value.trim(); // Trim input value

    if (inputValue.length > 0) {
      console.log("showFilteredSearchHistory called");
      showFilteredSearchHistory();  // Ensure this function exists
    } else {
      console.log("showFilteredSearchHistory not called");
      clearSearchHistory();
    }
  });
}

function clearSearchHistory() {
  let searchHistoryContainer = document.getElementById("doll");
  
  if (searchHistoryContainer) {
    searchHistoryContainer.style.display = "none";
    searchHistoryContainer.innerHTML = ""; // Clear previous search results
  }
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
      productNamesArray = results;
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
  if (smallsearchInput.value.trim().length > 0) {  // Trimmed input check
    console.log("showFilteredSearchHistory called");
    showSmallFilteredSearchHistory();
  } else {
    console.log("showFilteredSearchHistory not called");
    clearSmallSearchHistory(); 
  }
});
function clearSmallSearchHistory() {
  // Example: Remove search history results from the UI
  document.getElementById("small-doll").innerHTML = ""; 
 
}







 

window.rate = async function ()  {
  if(!accountId){
    alert('Veuillez vous connecter pour évaluer');
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
      alert("Veuillez sélectionner une note avant de soumettre.");
      return;
  }
  document.getElementById("modal").classList.add("active");
  const rating = parseInt(selectedRating.value);
  console.log(rating)
  const existingRating = await checkUserRating();
  if (existingRating) {
      alert("Vous avez deja evaluer ce produit");
      document.getElementById("modal").classList.remove("active");
      return;
      
  }
  await db.createDocument(DATABASE_ID, RATINGS_ID, 'unique()', {
      UserId: accountId,
      productId: selectedProductId,
      rating: rating
  });
 
  alert("Évaluation soumise ! Pour voir la nouvelle évaluation, actualisez et recherchez à nouveau le produit.");
  fetchAverageRating();
  
 

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
  
  document.getElementById("average-rating").innerText = `Note Moyenne: ${average.toFixed(1)} (${totalRatings} R)`;
  
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
    console.log("Note moyenne du produit mise à jour avec succès.");
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
            modalProductDetails2.innerHTML += `<p>Erreur : Vendeur non trouvé</p>`;
            return;
        }

        // Update modal with fetched seller data
        modalProductDetails2.innerHTML = `
            <div id = 'seller'>
                <h3>Vérifier les informations du vendeur</h3>
                <img src="${response[0].profile || '/icons/user.svg'}" alt="Profile Preview" 
                     style="display: block; width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin: auto;">
                ${response[0].Name ? `<p><strong>Nom:</strong> ${response[0].Name}</p>` : ""}
                ${response[0].businessName ? `<p><strong>Nom du Business:</strong> ${response[0].businessName}</p>` : ""}
                ${response[0].phoneNumber ? `<p><strong>Numero de telephone:</strong> ${response[0].phoneNumber}</p>` : ""}
               
                ${response[0].email ? `<p><strong>Email:</strong> ${response[0].email}</p>` : ""}
                ${response[0].location ? `<p><strong>Location:</strong> ${response[0].location}</p>` : ""}
                ${response[0].businessDescription ? `<p><strong> Description du Business:</strong> ${response[0].businessDescription}</p>` : ""}
            </div>
        `;
        document.getElementById("modal").classList.remove("active");
    } catch (error) {
        console.error("Error fetching seller:", error);
        document.getElementById("modal").classList.remove("active");
        modalProductDetails2.innerHTML = `<p>Erreur lors de la récupération des détails du vendeur, Verifier votre connection</p>`;
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
  categoryOfProduct = "";
  // Hide categories
  document.getElementById("categories").style.display = "none";
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
             window.Appwrite.Query.limit(10),
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
         } if(response.documents.length < 10 ) {
             subcategoryloadMoreBtn.style.display = "none";
             console.log("No more products to load.");
         }
         document.getElementById("modal").classList.remove("active");
     } catch (error) {
      document.getElementById("modal").classList.remove("active");
         console.error("Error fetching products:", error);
         alert('Erreur lors de la récupération des produits. Veuillez vérifier votre connexion Internet')
     }
 
     loa = false; // Reset loading after request is done
}
let offresSpeciales = 'offresSpeciales';
    async function bonusFetch(offresSpeciales) {
      try {
          const response = await db.listDocuments(
              DATABASE_ID, // Replace with your database ID
              SELLER_PRODUCTS_ID, // Replace with your collection ID
              [ Query.orderDesc("CreatedAt"),
                Query.equal("category", offresSpeciales)]
          );
          console.log(response.documents)
          
response.documents.forEach((deal) => {
  uniqueProducts.push(deal)
   slidesContainer.innerHTML += `
   <div class="slide" onclick = "showProductInDetails('${deal.$id}')">
            <img src="${deal.image1}" alt="Deal 1">
            <div class="slide-text"> ${deal.description} </div>
          </div>
   `
})
         
      } catch (error) {
          console.error("Error fetching products:", error);
          return [];
      }
  }
await bonusFetch(offresSpeciales)


    const slides = document.querySelector(".slides");
    const images = document.querySelectorAll(".slide"); // Change to .slide instead of img
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    
    let index = 0;
    const totalSlides = images.length;
    
    // Function to move slides
    function moveSlides() {
      slides.style.transform = `translateX(-${index * 100}%)`;
    }
    
    // Auto-slide function
    function autoSlide() {
      index = (index + 1) % totalSlides; // Loop back to start
      moveSlides();
    }
    
    // Next and Previous Buttons
    nextBtn.addEventListener("click", () => {
      index = (index + 1) % totalSlides;
      moveSlides();
    });
    
    prevBtn.addEventListener("click", () => {
      index = (index - 1 + totalSlides) % totalSlides;
      moveSlides();
    });
    
    // Auto-slide every 3 seconds
    let slideInterval = setInterval(autoSlide, 7000);
    
    // Pause on hover, resume on leave
    document.querySelector(".hero-slider").addEventListener("mouseenter", () => {
      clearInterval(slideInterval);
    });
    document.querySelector(".hero-slider").addEventListener("mouseleave", () => {
      slideInterval = setInterval(autoSlide, 7000);
    });
    

  
      let deferredPrompt;
      const installButton = document.getElementById("install-button");
  
      if (!installButton) {
          console.error("❌ Install button not found!");
          
      }
  
// Detect if the app is already installed on iOS
if (window.navigator.standalone) {
    console.log("Running as PWA on iOS");
} else if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    if (navigator.userAgent.includes("CriOS")) {
        // User is on Chrome on iOS
        alert("To install Buramart, please open this site in Safari, tap 'Share', and select 'Add to Home Screen'.");
    } else {
        // User is on Safari on iOS
        alert("To install Buramart, tap 'Share' and select 'Add to Home Screen'.");
    }
}
window.addEventListener("beforeinstallprompt", () => console.log("beforeinstallprompt fired!"));
window.addEventListener("beforeinstallprompt", (event) => {
  console.log("beforeinstallprompt event fired!");
  // Prevent the default prompt from appearing
  
  // Save the event for triggering the install prompt later
  deferredPrompt = event;

  // Show the install button only if the app is not installed
  if (!window.matchMedia("(display-mode: standalone)").matches) {
    document.getElementById("install-button").style.display = "block";
  }
});
  
console.log(document.getElementById('install-button'))
// Handle install button click
window.install = () => {
  if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
                console.log("User accepted the install prompt");
            }
            deferredPrompt = null;
            document.getElementById("install-button").style.display = "none";
        });
    
      }
};

// Hide button if already installed
if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) {
    document.getElementById("install-button").style.display = "none";
}
 
function getProductIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// Function to fetch product data using Appwrite's getDocument
async function fetchProductData(productId) {

  try {
      const product = await db.getDocument(DATABASE_ID,SELLER_PRODUCTS_ID, productId); // Replace with your collection ID
      return product;
  } catch (error) {
      console.error('Error fetching product data:', error);
      return null;
  }
}



// Main function to load the product and display it
async function loadProductAndDisplay() {
  const productId = getProductIdFromUrl();
  console.log(productId) // Get product ID from URL
  if (productId) {
      const productData = await fetchProductData(productId); // Fetch the product data
      
      if (productData) {
          // Wrap the fetched product in an array to pass to displayProducts
          document.getElementById("categories").style.display = "none";
 
document.getElementById('home').style.display = "none"
          
          homeProductList.innerHTML = "";
          displayProducts([productData]);
          loadMoreBtn.style.display = 'none'
      }
  }
}


loadProductAndDisplay();