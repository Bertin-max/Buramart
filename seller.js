import { account, getUserDetails } from "./user.js";
import { getSellerInfo } from "./user.js";

async function loadUserData() {
    const userData = await getUserDetails();
    if (userData) {
       return  userData.userId;
        
    } else {
        console.log("No user logged in.");
    }
}

let phoneNumber = "";
let whatsappNumber = "";
let registered = false;
let sellerId = "";

async function setSellerDetails() {
    const sellerInfo = await getSellerInfo();

    if (sellerInfo) {
        phoneNumber = sellerInfo.phone;
        whatsappNumber = sellerInfo.whatsapp;
        registered = sellerInfo.isRegistered;
        sellerId = sellerInfo.sellerId;
        console.log("Updated Values:");
        console.log("Phone:", phoneNumber);
        console.log("WhatsApp:", whatsappNumber);
        console.log("Registered:", registered);
    }
}


  await setSellerDetails(); // Wait until data is fetched
  




let accountId = await loadUserData()
console.log(accountId);


const client = new Appwrite.Client();
client.setProject('67b35038002044fd8dfa');

const DATABASE_ID = '67b5a1b2003647bb7108';
const SELLER_PRODUCTS_ID = '67b5a252002e43ecbff9';
const BUCKET_ID = '67b5a6a900035fb44480';
const db = new Appwrite.Databases(client, DATABASE_ID); // Replace with your actual Database ID
const storage = new Appwrite.Storage(client);
let oldImageUrl = '';

if(!registered){
  alert('Veuillez vous inscrire pour vendre');
  window.location.href = "seller-registration.html";
  
}
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
  offresSpeciales: [
    "Réduction immédiate",
    "Achat 1, obtenez 1 gratuit",
    "Offre limitée",
    "Codes promo",
    "Remises exceptionnelles",
    "Offres de dernière minute",
    "Ventes privées"
  ],
};

window.updateSubcategories = () => {
  const categorySelect = document.getElementById("product-category");
  const subcategorySelect = document.getElementById("subcategory");
  
  // Get selected category value
  const selectedCategory = categorySelect.value;
  console.log(selectedCategory)
  subcategorySelect.disabled = !selectedCategory;
  // Clear existing subcategories
  subcategorySelect.innerHTML = '<option value="">Sélectionnez une sous-catégorie</option>';
console.log(categories[selectedCategory])
  // If a valid category is selected, populate subcategories
  if (selectedCategory && categories[selectedCategory]) {
      categories[selectedCategory].forEach(sub => {
          let option = document.createElement("option");
          option.value = sub;
          option.textContent = sub;
          subcategorySelect.appendChild(option);
      });
  }
}

updateSubcategories();

const productForm = document.getElementById("product-form");
const productList = document.getElementById("product-list");
const searchInput = document.getElementById('search-input');
const smallsearchInput = document.getElementById('small-search-input');
const main = document.getElementById('main-content');
const searchResultsContainer = document.getElementById("doll");
const smallsearchResultsContainer = document.getElementById('small-doll');
let products = []
 
document.getElementById('product-image').addEventListener('change', function(event) {
  const file = event.target.files[0];
  const preview = document.getElementById('image-preview');

  if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
          preview.src = e.target.result;
          preview.style.display = 'block';
      };
      reader.readAsDataURL(file);
  } else {
      preview.style.display = 'none';
  }
});
function extractFileId(imageUrl) {
  const parts = imageUrl.split("/files/");  // Split at "/files/"
  if (parts.length < 2) return null;        // If URL is invalid, return null

  const filePart = parts[1].split("/view")[0];  // Extract file ID before "/view"
  return filePart; 
}

window.deleteProduct = async function(productId, imageUrl) {
  
  if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;
console.log(imageUrl)
  try {
      await db.deleteDocument(DATABASE_ID, SELLER_PRODUCTS_ID, productId);
      alert("Produit supprime avec succes!");
      const fileId = extractFileId(imageUrl);
      if (fileId) {
          await storage.deleteFile(BUCKET_ID, fileId);
      }
      // Refresh the product list
      fetchProducts(); 
  } catch (error) {
      console.error("Error deleting product:", error);
      alert("Échec de la suppression du produit.");
  }
}

window.showProductInDetails = async function(index) {
  // Find the product by its inde.log(x
  const product = products[index];

  // Get the modal overlay and content container
  const modalOverlay = document.getElementById('modal-overlay');
  const modalProductDetails = document.getElementById('modal-product-details');

  // Set the modal content with the product details
  modalProductDetails.innerHTML = `
    <h3>${(product.Name)}</h3>
    <img src="${product.image}" alt="Product Image" >
    <p><strong>Prix:</strong> BIF ${product.price}</p>
    <p><strong>Categorie:</strong>${product.category}</p>
    <p><strong>Sous-category:</strong>${product.subCategory}</p>
    <p><strong>Description:</strong> ${product.description}</p>
  `;

  // Show the modal overlay
  modalOverlay.style.display = 'flex';

  // Add an event listener to the close button
  const closeModalBtn = document.getElementById('close-modal-btn');
  closeModalBtn.addEventListener('click', closeModal);

  // Prevent interactions with the rest of the page
  document.body.style.overflow = 'hidden'; // Disable scrolling
}

function closeModal() {
  // Hide the modal overlay
  const modalOverlay = document.getElementById('modal-overlay');
  modalOverlay.style.display = 'none';

  // Re-enable scrolling on the body
  document.body.style.overflow = 'auto';
}
function escapeHTML(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
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
async function fetchProducts() {
  document.getElementById("modal").classList.add("active");
const query = Appwrite.Query.equal('UserId', accountId);
  try {
      const response = await db.listDocuments(DATABASE_ID, SELLER_PRODUCTS_ID, [
        window.Appwrite.Query.orderDesc("CreatedAt"),
      window.Appwrite.Query.equal("UserId", sellerId)]);
      console.log(accountId)
       products = response.documents; // Extract the products list
      displayProducts(products);
      console.log(products)
      document.getElementById("modal").classList.remove("active");
  } catch (error) {
      console.error("Error fetching products:", error);
      document.getElementById("modal").classList.remove("active");
  }
}

 fetchProducts()
 window.generateStars = (averageRating) => {
  let starsHtml = "";
  for (let i = 1; i <= 5; i++) {
      starsHtml += `<span class="${i <= Math.round(averageRating) ? 'gold' : 'white'}">★</span>`;
  }
  return starsHtml;
}
 function displayProducts(products) {
  productList.innerHTML = ''; // Clear existing products

  

      products.forEach((product, index) => {
          productList.innerHTML += `
              <div class="product-card">
                  <div class="product-header">
                      <h3>${product.Name}</h3>
                      <img src="${product.image}" alt="Product Image">
                      <div class="dropdown">
                          <button class="dropdown-icon">...</button>
                          <div class="dropdown-content">
                              <button class="show-details-btn" onclick="event.stopPropagation(); showProductInDetails(${index})">Show Details</button>
                              <button class="edit-btn" onclick="event.stopPropagation(); editProduct(${index})" ;>Edit</button>
                              <button class="delete-btn" onclick="event.stopPropagation(); deleteProduct('${product.$id}','${product.image}')">Delete</button>
                          </div>
                      </div>
                  </div>
                  <div class="product-details">
                      <p class="price">BIF ${product.price}</p>
                       <div class="average-stars" id="average-stars">
        ${generateStars(product.averageRating)}(${product.totalRatings}R)
      </div>
                      <p class="description">${product.description.length > 50 ? product.description.substring(0, 50) + '...' : product.description}</p>
                  </div>
              </div>
          `;
      });

      attachHoverEvents(); // Reattach hover events
 
}



document.addEventListener("click", (event) => {
  if (!event.target.matches('.dropdown-icon')) {
    const dropdowns = document.querySelectorAll('.dropdown-content');
    dropdowns.forEach((dropdown) => {
      dropdown.style.display = 'none';
    });
  }
});

productList.addEventListener("click", (event) => {
  if (event.target.classList.contains("dropdown-icon")) {
    const dropdownContent = event.target.nextElementSibling;
    dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
  }
});




window.editProduct = async function(index) {
  const product = products[index];

  // Fill the form with existing product details
  document.getElementById('product-name').value = product.Name;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-description').value = product.description;
  document.getElementById('product-category').value = '';
 
  document.getElementById('subcategory').value = product.subCategory;
  document.getElementById('image-preview').src = product.image;
  oldImageUrl = product.image;
  document.getElementById('image-preview').style.display = 'flex';
  // Show image preview
  console.log(document.getElementById('image-preview'))
console.log(product.image)
  // Store the product ID in dataset to delete later
  document.getElementById('product-form').dataset.productId = product.$id;
  document.getElementById('product-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
  alert("Vous êtes en train de modifier le produit. Lorsque vous soumettrez, l'ancienne version sera supprimée et vous perdrez toutes les étoiles que vous avez obtenues sur le produit.");
}






const updateSearchKeywords = async (productName) => {
    
    const collectionId = "67c2c8900005644a66d9";
    const documentId = "67c2cbee00257344ec2b"; // The single document storing all names

    try {
        // Get the current names array
        const doc = await db.getDocument(DATABASE_ID, collectionId, documentId);
        let namesArray = doc.names || [];

        // Add the new product name
        if (!namesArray.includes(productName)) {
            namesArray.push(productName);
            await db.updateDocument(DATABASE_ID, collectionId, documentId, {
                names: namesArray
            });
            console.log("Product name added to search index!");
        }
    } catch (error) {
        console.error("Error updating search collection:", error);
    }
};

// Example: Call this function when a seller uploads a product




productForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  console.log(registered)
  if(!registered){
    alert("Veuillez vous connecter et vous inscrire en tant que vendeur")
     productForm.reset();
      document.getElementById('image-preview').style.display = 'none';
      window.location.href = "index.html";
    return
  }
  const name = document.getElementById('product-name').value;
  const description = document.getElementById('product-description').value;
  const price = parseFloat(document.getElementById('product-price').value);
  const category = document.getElementById('product-category').value;
  const subCategory = document.getElementById('subcategory').value;
  const imageFile = document.getElementById('product-image').files[0];

  if (!name || !price) {
      alert('Veuillez remplir tous les details.');
      return;
  }
  updateSearchKeywords(name);
  let imageUrl = '';
  const productIdToDelete = productForm.dataset.productId; // Get product ID from dataset

  try {
    document.getElementById("modal").classList.add("active");
    document.getElementById('submit-btn').style.display = "none";
      // If editing, first delete the old product
      if (productIdToDelete) {
          await db.deleteDocument(DATABASE_ID, SELLER_PRODUCTS_ID, productIdToDelete);
          console.log(`Deleted old product: ${productIdToDelete}`);
      }

      // Upload new image if a new one is selected
      if (imageFile) {
          const uploadResponse = await storage.createFile(BUCKET_ID, 'unique()', imageFile);
          imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${uploadResponse.$id}/view?project=67b35038002044fd8dfa`;
          const fileId = extractFileId(oldImageUrl);
          if (fileId) {
              await storage.deleteFile(BUCKET_ID, fileId);
          }
      } else {
          // Keep existing image if no new image was uploaded
          imageUrl = document.getElementById('image-preview')?.src || '';
      }

      // Create new product entry
      await db.createDocument(DATABASE_ID, SELLER_PRODUCTS_ID, 'unique()', {
          UserId: sellerId,
          Name: name,
          image: imageUrl,
          category: category,
          description: description,
          price: price,
          phone: phoneNumber,
          subCategory: subCategory,
          whatsapp: whatsappNumber,
          CreatedAt: new Date(),
          random: Math.random(),
      });

      alert('Produit téléchargé avec succès !');
      document.getElementById('uploaded-products').scrollIntoView({ behavior: 'smooth', block: 'start' });
      fetchProducts(); // Refresh product list

      productForm.reset();
      document.getElementById('image-preview').style.display = 'none'
      delete productForm.dataset.productId; // Clear product ID
      const existingImagePreview = document.getElementById('existing-image-preview');
      if (existingImagePreview) existingImagePreview.remove(); // Remove preview image
      document.getElementById("modal").classList.remove("active");
      document.getElementById('submit-btn').style.display = "block";

  } catch (error) {
    document.getElementById('submit-btn').style.display = "block";
      console.error('Error updating product:', error);
      alert(`Échec du téléchargement du produit. Veuillez réessayer. ${error}`);
      document.getElementById("modal").classList.remove("active");
  }
});




window.searchProducts = async function () {
 
  const searchInputValue = searchInput.value || smallsearchInput.value;

  // Map products with their original index before filtering
  const foundProducts = products
    .map((product, index) => ({ product, originalIndex: index })) // Keep track of original index
    .filter(item => item.product.Name.toLowerCase() === searchInputValue.toLowerCase()); // Case-insensitive search
console.log(foundProducts)
  if (foundProducts.length === 0) {
    productList.innerHTML = "Vous n'avez aucun produit sous ce nom";
    return;
  }

  productList.innerHTML = '';
  foundProducts.forEach((product, originalIndex) => {
    productList.innerHTML += `
        <div class="product-card">
            <div class="product-header">
                <h3>${product.product.Name}</h3>
                <img src="${product.product.image}" alt="Product Image">
                <div class="dropdown">
                    <button class="dropdown-icon">...</button>
                    <div class="dropdown-content">
                        <button class="show-details-btn" onclick="event.stopPropagation(); showProductInDetails(${product.originalIndex})">Show Details</button>
                        <button class="edit-btn" onclick="event.stopPropagation(); editProduct(${product.originalIndex})">Edit</button>
                        <button class="delete-btn" onclick="event.stopPropagation(); deleteProduct('${product.product.$id}')">Delete</button>
                    </div>
                </div>
            </div>
            <div class="product-details">
                <p class="price">$${product.product.price}</p>
                       <div class="average-stars" id="average-stars">
        ${generateStars(product.product.averageRating)}(${product.product.totalRatings}R)
      </div>
                <p class="description">${product.product.description.length > 50 ? product.product.description.substring(0, 50) + '...' : product.product.description}</p>
            </div>
        </div>
    `;
});
window.location.href = "#uploaded-products"
}
const liveSearch = async () => {
  const searchTerm = searchInput.value.trim().toLowerCase(); // Get and clean user input
 

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

 smallsearchInput.addEventListener('input',smallliveSearch)
// Add event listener for live search
searchInput.addEventListener("input", liveSearch);





