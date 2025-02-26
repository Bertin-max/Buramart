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
       category: productCategory,
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
     category: productCategory,
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
 try {
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
              const imageURL = await getDownloadURL(uploadTask.snapshot.ref);
            } catch (error) {
              console.error("Error uploading product:", error);
              document.getElementById('upload-status').innerText = "Upload failed. Please try again.";
          }