document.getElementById('loadingModal').style.display = 'flex'; // Show loading modal

import { getUserDetails } from "./user.js";
import { getSellerInfo } from "./user.js";

// Load User Data
async function loadUserData() {
    const userData = await getUserDetails();
    return userData ? userData.userEmail : null;
}

let registered = false;

async function setSellerDetails() {
    const sellerInfo = await getSellerInfo();

    if (sellerInfo) {
        
        registered = sellerInfo.isRegistered;

        console.log("Updated Values:");
        console.log("Phone:", phoneNumber);
        console.log("WhatsApp:", whatsappNumber);
        console.log("Registered:", registered);
    }
}


await setSellerDetails();
document.getElementById('loadingModal').style.display = 'none';
const client = new Appwrite.Client();
client.setProject('67b35038002044fd8dfa');

const DATABASE_ID = '67b5a1b2003647bb7108';
const SELLER_REGISTRATION_ID = '67b83126001bf9ce5516';
const SELLER_IMAGES_ID = '67b839fd000162e91499';
const db = new Appwrite.Databases(client, DATABASE_ID);
const storage = new Appwrite.Storage(client);

let accountEmail = await loadUserData();
console.log(accountEmail);
if(!accountEmail){
    alert('please Login before registering');
    window.location.href = "index.html";
}

if (registered && accountEmail) {
   window.displaySeller = async function ()  {
        try {
            const response = await db.listDocuments(DATABASE_ID, SELLER_REGISTRATION_ID, [
                window.Appwrite.Query.equal("email", accountEmail),
                window.Appwrite.Query.equal("Registered", true),
            ]);

            const seller = response.documents;
            console.log(seller);

            if (seller.length > 0) {
                document.getElementById('step1').style.display = 'none';
                document.getElementById('step4').style.display = 'block';

                document.getElementById('step4').innerHTML = `
                    <h3>Your Information</h3>
                    <img id="reviewProfilePreview" src="${seller[0].profile ? seller[0].profile : "icons/user.svg"}" alt="Profile Preview" 
                 
                        style="display: block; width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin: auto;">
                    <p><strong>Full Name:</strong> <span id="reviewFullName">${seller[0].Name}</span></p>
                    <p><strong>Business Name:</strong> <span id="reviewBusinessName">${seller[0].businessName}</span></p>
                    <p><strong>Phone Number:</strong> <span id="reviewPhoneNumber">${seller[0].phoneNumber}</span></p>
                    <p><strong>WhatsApp Number:</strong> <span id="reviewWhatsappNumber">${seller[0].whatsAppNumber}</span></p>
                    <p><strong>Email:</strong> <span id="reviewEmail">${seller[0].email}</span></p>
                    <p><strong>Location:</strong> <span id="reviewLocation">${seller[0].location}</span></p>
                    <p><strong>Business Description:</strong> <span id="reviewDescription">${seller[0].businessDescription}</span></p>
                     <a href="index.html" style = "margin-right: 20px">Go back</a>
                    <button type="button" onclick="editProfile('${seller[0].$id}')">Edit</button>
                    <button id="update-btn">Update</button>
                `;
                console.log(seller[0].$id)
                document.getElementById('update-btn').addEventListener('click', async (event) => {
                    event.preventDefault(); // Prevents JavaScript from reloading
                    const sellerId = seller[0].$id; // Replace with the correct seller ID dynamically
                    await updateProfile(sellerId);
                });
            }
        } catch (error) {
            console.error("Error fetching seller status:", error);
        }
    }
displaySeller()
 // Hide loading modal after checks
}

// Function to Fill Form for Editing
window.editProfile = async (sellerId) => {
   
    db.getDocument(DATABASE_ID, SELLER_REGISTRATION_ID, sellerId)
        .then((seller) => {
            document.getElementById('fullName').value = seller.Name;
            document.getElementById('businessName').value = seller.businessName;
            document.getElementById('phoneNumber').value = seller.phoneNumber;
            document.getElementById('whatsappNumber').value = seller.whatsAppNumber;
            document.getElementById('email').value = seller.email;
            document.getElementById('location').value = seller.location;
            document.getElementById('description').value = seller.businessDescription;
            document.getElementById('profilePreview').src = 'icons/user.svg';
            document.getElementById('profilePicture').value = '';
            document.getElementById('step1').style.display = 'block';
            document.getElementById('step4').style.display = 'none';
        })
        .catch((error) => console.error("Error fetching seller details:", error));

        try {
            const document = await db.getDocument(DATABASE_ID, SELLER_REGISTRATION_ID, sellerId);
            console.log('Document data:', document.profile);
            if(document.profile !== 'http://127.0.0.1:5500/icons/user.svg'){
            const url = new URL(document.profile);
            const pathSegments = url.pathname.split('/');
            const fileId = pathSegments[pathSegments.indexOf('files') + 1];

            if (fileId) {
                // Delete the file from the storage bucket
                await storage.deleteFile(SELLER_IMAGES_ID, fileId);
            }}
        } catch (error) {
            console.error('Error retrieving document:', error.message);
        }
};

// **Update Function for Existing Seller**
window.updateProfile = async (sellerId) => {
    const fullName = document.getElementById('fullName').value;
    const businessName = document.getElementById('businessName').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const whatsAppNumber = document.getElementById('whatsappNumber').value;
    const email = document.getElementById('email').value || accountEmail;
    const location = document.getElementById('location').value;
    const businessDescription = document.getElementById('description').value;
    const imageFile = document.getElementById('profilePicture').files[0];

    if (!fullName || !phoneNumber || !location) {
        alert('Please fill in your name, phone number, and location.');
        return;
    }

    try {
        let imageUrl = document.getElementById('profilePreview').src; // Keep existing image if not updated

        if (imageFile) {

            const uploadResponse = await storage.createFile(SELLER_IMAGES_ID, 'unique()', imageFile);
            imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${SELLER_IMAGES_ID}/files/${uploadResponse.$id}/view?project=67b35038002044fd8dfa`;
        }
        
        // **Update existing seller document**
        await db.updateDocument(DATABASE_ID, SELLER_REGISTRATION_ID, sellerId, {
            Name: fullName,
            businessName: businessName,
            phoneNumber: phoneNumber,
            whatsAppNumber: whatsAppNumber,
            email: email,
            location: location,
            businessDescription: businessDescription,
            profile: imageUrl
        });

        alert('Profile updated successfully!');
          // Wait before fetching new data (to prevent UI refresh from showing old data)
          displaySeller();
          document.getElementById('loadingModal').style.display = 'none'; // Hide loading modal after checks
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile.');
    }
};







window.nextStep = function(step) {
    document.querySelectorAll('.step').forEach(el => el.style.display = 'none');
    document.getElementById('step' + step).style.display = 'block';
    
    if (step === 4) {
        document.getElementById('reviewFullName').textContent = document.getElementById('fullName').value;
        document.getElementById('reviewBusinessName').textContent = document.getElementById('businessName').value;
        document.getElementById('reviewPhoneNumber').textContent = document.getElementById('phoneNumber').value;
        document.getElementById('reviewWhatsappNumber').textContent = document.getElementById('whatsappNumber').value;
        document.getElementById('reviewEmail').textContent =        document.getElementById('email').value || accountEmail;
        document.getElementById('reviewLocation').textContent = document.getElementById('location').value;
        document.getElementById('reviewDescription').textContent = document.getElementById('description').value;
    }
}

window.prevStep = function (step) {
    document.querySelectorAll('.step').forEach(el => el.style.display = 'none');
    document.getElementById('step' + step).style.display = 'block';
    document.getElementById('profilePreview').src = 'icons/user.svg';
    document.getElementById('reviewProfilePreview').src = 'icons/user.svg';
    document.getElementById('profilePicture').value = "";
}
document.getElementById('register-btn').addEventListener('click', async (event) => {
    event.preventDefault();
  
  const fullName = document.getElementById('fullName').value;
    const businessName = document.getElementById('businessName').value;
   const  phoneNumber = document.getElementById('phoneNumber').value;
   const  whatsAppNumber = document.getElementById('whatsappNumber').value;
   const  email = document.getElementById('email').value || accountEmail;
    const location = document.getElementById('location').value;
    const businessDescription = document.getElementById('description').value;
    const imageFile = document.getElementById('profilePicture').files[0];
  
    if (!fullName || !phoneNumber || !location) {
        alert('Please fill in your name or phoneNumber or location.');
        return;
    }
  
    let imageUrl = '';
    
  
    try {
        
  
        // Upload new image if a new one is selected
        if (imageFile) {
            const uploadResponse = await storage.createFile(SELLER_IMAGES_ID, 'unique()', imageFile);
            imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${SELLER_IMAGES_ID}/files/${uploadResponse.$id}/view?project=67b35038002044fd8dfa`;
            
        } 
  
        // Create new product entry
        await db.createDocument(DATABASE_ID, SELLER_REGISTRATION_ID, 'unique()', {
           
            Name: fullName,
            businessName:businessName,
            phoneNumber: phoneNumber,
            whatsAppNumber:whatsAppNumber,
            email: email,
             location: location,
             businessDescription: businessDescription,
        });
  
        alert('Product updated successfully!');
        // Refresh product list
  
        document.getElementById('sellerRegistrationForm').reset();
       
  
    } catch (error) {
        console.error('Error updating product:', error);
        alert('Failed to update product.');
    }
  });
