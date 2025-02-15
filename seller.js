import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getStorage ,ref, uploadBytesResumable, getDownloadURL} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-storage.js";


const firebaseConfig = {
  apiKey: "AIzaSyCwQ9Mg5JguRfoCkihnTRdr1YQNYDiGOWo",
  authDomain: "buramart-bd714.firebaseapp.com",
  projectId: "buramart-bd714",
  storageBucket: "buramart-bd714.appspot.com",
  messagingSenderId: "555062567759",
  appId: "1:555062567759:web:a24d239674e68fb6db1b3a",
  measurementId: "G-5XPTB3F4GL"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
if (typeof firebase === "undefined") {
  console.error("Firebase SDK not loaded!");
} else {
  console.log("Firebase loaded successfully.");
}

const productForm = document.getElementById("product-form");
const productList = document.getElementById("product-list");
const searchInput = document.getElementById('search-input');
const smallsearchInput = document.getElementById('small-search-input');
const main = document.getElementById('main-content')
let products = []
function showProductInDetails(index) {
  // Find the product by its inde.log(x
  const product = products[index];

  // Get the modal overlay and content container
  const modalOverlay = document.getElementById('modal-overlay');
  const modalProductDetails = document.getElementById('modal-product-details');

  // Set the modal content with the product details
  modalProductDetails.innerHTML = `
    <h3>${escapeHTML(product.name)}</h3>
    <img src="${product.image}" alt="Product Image" >
    <p><strong>Price:</strong> $${product.price}</p>
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

async function displayProducts() {
  productList.innerHTML = ''; // Clear existing products

  try {
      const querySnapshot = await db.collection('products').orderBy('timestamp', 'desc').get();
      products = []; // Clear the old products array

      querySnapshot.forEach((doc) => {
          const product = doc.data();
          product.id = doc.id; // Store Firestore document ID for editing/deleting
          products.push(product);
      });

      products.forEach((product, index) => {
          productList.innerHTML += `
              <div class="product-card">
                  <div class="product-header">
                      <h3>${escapeHTML(product.name)}</h3>
                      <img src="${product.imageUrl}" alt="Product Image">
                      <div class="dropdown">
                          <button class="dropdown-icon">...</button>
                          <div class="dropdown-content">
                              <button class="show-details-btn" onclick="event.stopPropagation(); showProductInDetails(${index})">Show Details</button>
                              <button class="edit-btn" onclick="event.stopPropagation(); editProduct(${index})">Edit</button>
                              <button class="delete-btn" onclick="event.stopPropagation(); deleteProduct('${product.id}')">Delete</button>
                          </div>
                      </div>
                  </div>
                  <div class="product-details">
                      <p class="price">$${product.price}</p>
                      <p class="description">${product.description.length > 50 ? product.description.substring(0, 50) + '...' : product.description}</p>
                  </div>
              </div>
          `;
      });

      attachHoverEvents(); // Reattach hover events
  } catch (error) {
      console.error("Error fetching products:", error);
      productList.innerHTML = "Failed to load products.";
  }
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

async function deleteProduct(productId) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
      await db.collection('products').doc(productId).delete(); // Delete from Firestore
      alert('Product deleted successfully!');
      displayProducts(); // Refresh product list
  } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
  }
}


function editProduct(index) {
  
  
    const product = products[index];

    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-category').value = product.category;

    const existingImagePreview = document.getElementById('existing-image-preview');
    if (!existingImagePreview) {
        const imgElement = document.createElement('img');
        imgElement.id = 'existing-image-preview';
        imgElement.src = product.imageUrl;  // Display existing image
        imgElement.style.maxWidth = '200px';
        imgElement.style.marginTop = '10px';
        document.getElementById('product-image').insertAdjacentElement('afterend', imgElement);
    } else {
        existingImagePreview.src = product.imageUrl;
    }

    // Save the product ID for updating
    document.getElementById('product-form').dataset.productId = product.id;

  displayProducts();
  setTimeout(() => {
    alert('You are editing the product. After submitting, it will be updated.');
  }, 100);
};



productForm.addEventListener("submit", async (event) => {
  event.preventDefault();  // Prevent form from refreshing the page

  const productName = document.getElementById('product-name').value;
  const productPrice = document.getElementById('product-price').value;
  const productImageFile = document.getElementById('product-image').files[0];
  const productDescription = document.getElementById('product-description').value;
  const productCategory = document.getElementById('product-category').value;
  
  let existingImagePreview = document.getElementById("existing-image-preview");
  
  if (!productImageFile && !existingImagePreview) {
      alert('Please select an image!');
      return;
  }

  if (productImageFile && !existingImagePreview) {
      document.getElementById('upload-status').innerText = "Uploading...";

      try {
          // Create a reference to Firebase Storage
          const storageRef = ref(storage, `product-images/${productImageFile.name}`);
          
          // Start the file upload
          const uploadTask = uploadBytesResumable(storageRef, productImageFile);
          
          // Monitor the upload progress
          uploadTask.on('state_changed',
              (snapshot) => {
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  document.getElementById('upload-status').textContent = `Uploading: ${progress.toFixed(2)}%`;
              },
              (error) => {
                  console.error("Upload failed:", error);
                  document.getElementById('upload-status').textContent = "Image upload failed.";
              },
              async () => {
                  // Get the download URL after the image is uploaded
                  const imageURL = await getDownloadURL(uploadTask.snapshot.ref);

                  // Store the product data in Firestore
                  await addDoc(collection(db, "products"), {
                      name: productName,
                      description: productDescription,
                      price: parseFloat(productPrice),
                      imageURL: imageURL,
                      timestamp: new Date()
                  });

                  // Display success message and reset the form
                  document.getElementById('upload-status').innerText = "Product uploaded successfully!";
                  document.getElementById('product-form').reset(); // Clear form
              }
          );
      } catch (error) {
          console.error("Error uploading product:", error);
          document.getElementById('upload-status').innerText = "Upload failed. Please try again.";
      }
  }
});


const searchProducts = () => {
  const products = JSON.parse(localStorage.getItem('products'));
  const searchInputValue = searchInput.value || smallsearchInput.value;

  // Map products with their original index before filtering
  const foundProducts = products
    .map((product, index) => ({ product, originalIndex: index })) // Keep track of original index
    .filter(item => item.product.name.toLowerCase() === searchInputValue.toLowerCase()); // Case-insensitive search

  if (foundProducts.length === 0) {
    productList.innerHTML = "You Have no Product under such name";
    return;
  }

  productList.innerHTML = '';
  foundProducts.forEach(({ product, originalIndex }) => {  // Use originalIndex here
    productList.innerHTML += `
      <div class="product-card" onclick="showProductInDetails(${originalIndex})">
        <div class="product-header">
          <h3 style="padding: 0; margin: 0;">${escapeHTML(product.name)}</h3>
          <img src="${product.image}" alt="Product Image">
          <div class="dropdown">
            <button class="dropdown-icon">...</button>
            <div class="dropdown-content">
              <button class="edit-btn" onclick="event.stopPropagation();editProduct(${originalIndex})">Edit</button>
              <button class="delete-btn" onclick="event.stopPropagation();deleteProduct(${originalIndex})">Delete</button>
            </div>
          </div>
        </div>
        <div class="product-details">
          <p class="price">$${product.price}</p>
          <p class="description">${product.description.length > 50 ? product.description.substring(0, 50) + '...' : product.description}</p>
        </div>
      </div>`; 
  });
}

// Initial display of products on page load
displayProducts();
