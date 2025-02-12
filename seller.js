const productForm = document.getElementById("product-form");
const productList = document.getElementById("product-list");
const searchInput = document.getElementById('search-input');
const smallsearchInput = document.getElementById('small-search-input');
let products = JSON.parse(localStorage.getItem('products')) || [];

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

function displayProducts() {
  productList.innerHTML = ''; // Clear the current list before adding new products
  
  products.forEach((product, index) => {
    productList.innerHTML += `
      <div class="product-card">
        <div class="product-header">
          <h3 style="padding: 0; margin: 0; gap: 0;">${escapeHTML(product.name)}</h3>
          <img src="${product.image}" alt="Product Image">
          <div class="dropdown">
            <button class="dropdown-icon">...</button>
            <div class="dropdown-content">
              <button class="edit-btn" onclick="event.stopPropagation();editProduct(${index})">Edit</button>
              <button class="delete-btn" onclick="event.stopPropagation();deleteProduct(${index})">Delete</button>
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
  attachHoverEvents();
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

function deleteProduct(index) {
  products.splice(index, 1); // Remove the product from the array
  localStorage.setItem('products', JSON.stringify(products)); // Update local storage
  displayProducts(); // Re-render the product list
  setTimeout(() => {
    alert('Product deleted successfully!');
  }, 100);  // Delay the alert slightly
}

function editProduct(index) {
  const product = products[index];
  products.splice(index, 1);
  localStorage.setItem('products', JSON.stringify(products));

  document.getElementById('product-name').value = product.name;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-description').value = product.description;

  // Display the existing image as a preview
  const existingImagePreview = document.getElementById('existing-image-preview');
  if (!existingImagePreview) {
    const imgElement = document.createElement('img');
    imgElement.id = 'existing-image-preview';
    imgElement.src = product.image;  // Display the existing image
    imgElement.style.maxWidth = '200px';
    imgElement.style.marginTop = '10px';
    document.getElementById('product-image').insertAdjacentElement('afterend', imgElement);
  } else {
    existingImagePreview.src = product.image;
  }

  displayProducts();
  setTimeout(() => {
    alert('You are editing the product. After submitting, it will be updated.');
  }, 100);
}

productForm.addEventListener("submit", (event) => {
  event.preventDefault();  // Prevent form from refreshing the page

  const productName = document.getElementById('product-name').value;
  const productPrice = document.getElementById('product-price').value;
  const productImageFile = document.getElementById('product-image').files[0];
  const productDescription = document.getElementById('product-description').value;

  // Check if there's an existing image preview (from editing)
  const existingImagePreview = document.getElementById('existing-image-preview');
  const existingImageSrc = existingImagePreview ? existingImagePreview.src : null;
  const productImages = document.getElementById("product-image");
  if (productImageFile) {
    // If a new image is uploaded, read and use it
    const reader = new FileReader();

    reader.onload = function(e) {
      const product = { 
        name: productName,
        price: productPrice,
        image: e.target.result,  // Use new uploaded image
        description: productDescription,
      };

      products.push(product);
      localStorage.setItem('products', JSON.stringify(products));
      document.getElementById('product-form').reset();
      
      if (existingImagePreview) existingImagePreview.remove();  // Remove image preview after submission

      setTimeout(() => {
        alert('Product updated successfully!');
      }, 100);
      
      displayProducts();
    };

    reader.readAsDataURL(productImageFile);  // Convert image to Base64
  } else if (existingImageSrc) {
    productImages.required = false;
    // If no new image is uploaded, keep the existing image
    const product = { 
      name: productName,
      price: productPrice,
      image: existingImageSrc,  // Keep existing image
      description: productDescription,
    };

    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
    document.getElementById('product-form').reset();
    existingImagePreview.remove();  // Remove image preview after submission

    setTimeout(() => {
      alert('Product updated successfully!');
    }, 100);

    displayProducts();
  } else {
    alert('Please upload an image.');
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
      <div class="product-card">
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
