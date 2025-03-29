  
  
  const client = new Appwrite.Client();
client.setProject('67b35038002044fd8dfa'); // Your project ID

export const account = new Appwrite.Account(client);

async function getUserDetails() {
    try {
        const user = await account.get();
        return { userId: user.$id, userEmail: user.email };
    } catch (error) {
        console.error("Not logged in:", error);
        return null;
    }
}

export { getUserDetails };

let IsRegistered = false; 
const DATABASE_ID = '67b5a1b2003647bb7108';
const SELLER_REGISTRATION_ID = '67b83126001bf9ce5516';

const db = new Appwrite.Databases(client, DATABASE_ID);
async function getSellerInfo() {
    try {
        const userData = await getUserDetails();
        if (!userData) {
            console.log("No user logged in.");
            return null;
        }

        console.log("User Email:", userData.userEmail); 

        const response = await db.listDocuments(DATABASE_ID, SELLER_REGISTRATION_ID, [
            window.Appwrite.Query.equal("email", userData.userEmail),
            window.Appwrite.Query.equal("Registered", true), 
        ]);

        console.log("Fetched Seller Documents:", response.documents);

        if (response.documents.length > 0) {
            let sellerData = response.documents[0]; // Get the first (and likely only) seller entry
            
            let sellerInfo = {
                isRegistered: true,
                phone: sellerData.phoneNumber || "Not provided",
                whatsapp: sellerData.whatsAppNumber || "Not provided",
                sellerId: sellerData.$id,
              
            };

            console.log("Seller Info:", sellerInfo);
            return sellerInfo;
        } else {
            return { isRegistered: false };
        }
    } catch (error) {
        console.error("Error fetching seller info:", error);
        return null;
    }
}
async function getAccountStatus() {
    try {
        const userData = await getUserDetails();
        if (!userData) {
            console.log("No user logged in.");
            return null;
        }

        console.log("User Email:", userData.userEmail); 

        const response = await db.listDocuments(DATABASE_ID, SELLER_REGISTRATION_ID, [
            window.Appwrite.Query.equal("email", userData.userEmail),
            window.Appwrite.Query.equal("alreadyClaimed", true), 
        ]);

        console.log("Fetched Seller Documents:", response.documents);

        if (response.documents.length > 0) {
            let sellerData = response.documents[0]; // Get the first (and likely only) seller entry
            
            let sellerInfo = {
                
                alreadyClaimed: sellerData.alreadyClaimed,
            };

            console.log("Seller Info:", sellerInfo);
            return sellerInfo;
        } else {
            return { alreadyClaimed: false };
        }
    } catch (error) {
        console.error("Error fetching account status:", error);
        return null;
    }
}
// ✅ Export the function
export { getSellerInfo };
export { getAccountStatus};

client.setProject('67b35038002044fd8dfa');


const SELLER_PRODUCTS_ID = '67b5a252002e43ecbff9';

const CART_ID = '67c05ddb0001a5f11990';

const Query = window.Appwrite.Query;
let latestProductId = localStorage.getItem("latestProductId") || ''; // Load stored ID first
const offresSpeciale = "offresSpeciales";

// Function to fetch the latest "Special Deals" product
async function fetchLatestSpecialDeal() {
    try {
        const response = await db.listDocuments(
            DATABASE_ID,
            SELLER_PRODUCTS_ID,
            [
                Query.orderDesc("CreatedAt"),
                Query.equal("category", offresSpeciale)
            ]
        );

        if (response.documents.length > 0) {
            const latestProduct = response.documents[0];

            // Access stored product ID from localStorage
            let storedProductId = localStorage.getItem("latestProductId");

            // If the latest product is the same as the stored one, do nothing
            if (storedProductId === latestProduct.$id) {
                console.log("No new product, skipping...");
                return;
            }

            // Update latestProductId and store it in localStorage
            latestProductId = latestProduct.$id;
            localStorage.setItem("latestProductId", latestProductId);
           

            console.log("New special deal:", latestProduct);

            if (navigator.serviceWorker.controller) {
                console.log("Sending data to Service Worker:", {
                  title: "🔥 Buramart",
                  body: `${latestProduct.subCategory}: ${latestProduct.Name} - ${latestProduct.price}Fbu`,
                  icon: "/icons/store.png",
                  imageUrl: latestProduct.image1,
                  productId: latestProduct.$id
                });

                navigator.serviceWorker.controller.postMessage({
                  title: "🔥 Buramart",
                  body: `${latestProduct.subCategory}: ${latestProduct.Name} - ${latestProduct.price}Fbu`,
                  icon: "/icons/stores.png",
                  imageUrl: latestProduct.image1,
                  productId: latestProduct.$id
                });
            }
        }
    } catch (error) {
        console.error("Error fetching special deals:", error);
    }
}

// Load the latest product from localStorage on page load
window.addEventListener("load", () => {
    const storedProduct = localStorage.getItem("latestProduct");
    if (storedProduct) {
        console.log("Loaded latest product from storage:", JSON.parse(storedProduct));
    }
});


// Function to check if a product is new and send notification
/*
function checkAndNotify(product) {
    const lastNotifiedId = localStorage.getItem("lastNotifiedProductId");
    const isPushEnabled = localStorage.getItem("pushNotifications") === "true";
    localStorage.setItem("lastNotifiedProductId", product.$id);
    if (isPushEnabled && lastNotifiedId !== product.$id) {
    
        sendPushNotification(product);
        
    }else{
      console.log('different')
    }
}

// Function to send push notification
function sendPushNotification(product) {
    if (Notification.permission === "granted") {
      console.log("granted")
        new Notification(`Buramart`, {
            body: `🔥${product.subCategory} ${product.Name} - ${product.price}$`,
             // Path to the Buramart icon (store.png in icons folder)
            image: product.image1,  // Path to the product image
            tag: product.subCategory,  // Optional: Tag for unique notifications
        });
    }else{
      console.log('notifiication not allowed')
    }
}
*/

// Run the check every 5 minutes (only if push notifications are enabled)
setInterval(() => {
    if (localStorage.getItem("pushNotifications") === "true") {
        fetchLatestSpecialDeal();
    }
}, 300); // 5 minutes

console.log('user')