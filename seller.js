// Initialize Supabase
const supabaseUrl = 'https://quxaofzrtrccipvogbcb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1eGFvZnpydHJjY2lwdm9nYmNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3MTA2NjEsImV4cCI6MjA1NTI4NjY2MX0.AqCnvnnfwE5uVK-6eQxOQJkYfIsyEWqHIjyFapGyRuM'; // Replace with your new key
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

console.log('Supabase initialized:', supabase);
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





// seller.js


productForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('product-name').value;
  const description = document.getElementById('product-description').value;
  const price = parseFloat(document.getElementById('product-price').value);
  const category = document.getElementById('product-category').value;
  const imageFile = document.getElementById('product-image').files[0];

  // Validate inputs
  if (!name || !price || !imageFile) {
    alert('Please fill in all fields and select an image.');
    return;
  }

  // Upload image to Supabase storage
  const { data: imageUpload, error: imageError } = await supabase.storage
    .from('product-images')
    .upload(`products/${imageFile.name}`, imageFile);

  if (imageError) {
    console.error('Image upload failed:', imageError.message);
    alert('Image upload failed.');
    return;
  }

  const imageUrl = `https://https://quxaofzrtrccipvogbcb.supabase.co/storage/v1/object/public/product-images/products/${imageFile.name}`;

  // Insert product into the database
  const { error: insertError } = await supabase.from('products').insert([
    {
      name,
      description,
      price,
      category,
      image_url: imageUrl,
    },
  ]);

  if (insertError) {
    console.error('Failed to add product:', insertError.message);
    alert('Failed to add product.');
  } else {
    alert('Product uploaded successfully!');
    productForm.reset();
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
