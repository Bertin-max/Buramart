const client = new Appwrite.Client();
client.setProject('67b35038002044fd8dfa');

const DATABASE_ID = '67b5a1b2003647bb7108';
const SELLER_PRODUCTS_ID = '67b5a252002e43ecbff9';
const SELLER_REGISTRATION_ID = '67b83126001bf9ce5516';
const CART_ID = '67c05ddb0001a5f11990';
const db = new Appwrite.Databases(client, DATABASE_ID);
const Query = window.Appwrite.Query;


const pushNotificationRadio = document.getElementById("push-notification");

// Check stored preference on page load
document.addEventListener("DOMContentLoaded", () => {
    const isEnabled = localStorage.getItem("pushNotifications") === "true";
    pushNotificationRadio.checked = isEnabled;
});

// Handle push notification toggle
pushNotificationRadio.addEventListener("change", async function () {
    if (this.checked) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            localStorage.setItem("pushNotifications", "true");
            console.log("Push notifications enabled");
        } else {
            this.checked = false;
            console.log("Push notifications denied");
        }
    } else {
        localStorage.setItem("pushNotifications", "false");
        console.log("Push notifications disabled");
    }
});
let offresSpeciales = 'offresSpeciales';
// Function to fetch the latest "Special Deals" product
async function fetchLatestSpecialDeal() {
    try {
        const response = await db.listDocuments(
            DATABASE_ID,  // Replace with your Appwrite database ID
            SELLER_PRODUCTS_ID, // Replace with your products collection ID
            [
              Query.orderDesc("CreatedAt"),
                Query.equal("category", offresSpeciales)  
            ]
        );

        if (response.documents.length > 0) {
            const latestProduct = response.documents[0];
            console.log(latestProduct)
            checkAndNotify(latestProduct);
        }
    } catch (error) {
        console.error("Error fetching special deals:", error);
    }
}

// Function to check if a product is new and send notification
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

// Run the check every 5 minutes (only if push notifications are enabled)
setInterval(() => {
    if (localStorage.getItem("pushNotifications") === "true") {
       fetchLatestSpecialDeal();
    }
}, 300); // 5 minutes

