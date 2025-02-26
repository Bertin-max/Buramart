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

// ✅ Export the function
export { getSellerInfo };
