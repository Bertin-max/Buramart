const productForm = document.getElementById("product-form");
const productList = document.getElementById("product-list");

let products = JSON.parse(localStorage.getItem('products')) || [];

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
        <div class = "product-header">
          <h3 style="padding: 0; margin: 0; gap: 0;">${product.name}</h3>
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
          <p class="description">${product.description}</p>
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
  document.getElementById('product-image').value = product.files[0];
  document.getElementById('product-description').value = product.description;
  
  displayProducts();
  setTimeout(() => {
    alert('You are editing the product. After submitting, it will be updated.');
  }, 100);  // Delay the alert slightly (100 milliseconds)
}
productForm.addEventListener("submit", (event) => {
    event.preventDefault();  // Prevent form from refreshing the page
  
    const productName = document.getElementById('product-name').value;
    const productPrice = document.getElementById('product-price').value;
    const productImageFile = document.getElementById('product-image').files[0];
    const productDescription = document.getElementById('product-description').value;
  
    if (productImageFile) {
      const reader = new FileReader();
  
      reader.onload = function(e) {
        const product = { 
          name: productName,
          price: productPrice,
          image: e.target.result,  // Store Base64 image
          description: productDescription,
        };
  
        products.push(product);  // Add product to array
        localStorage.setItem('products', JSON.stringify(products));  // Save to localStorage
  
        document.getElementById('product-form').reset();  // Clear the form
        setTimeout(() => {
            alert('Product uploaded successfully!');
          }, 100); 
        displayProducts();  // Show the uploaded product
      };
  
      reader.readAsDataURL(productImageFile);  // Convert image to Base64
    } else {
      alert('Please upload an image.');
    }
  });

// Initial display of products on page load
displayProducts();
