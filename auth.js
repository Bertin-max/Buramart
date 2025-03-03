import { account } from "./user.js";
// Signup Event Listener

document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.querySelector('#signup-box form');

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            document.getElementById("modal").classList.add("active");
            try {
              
                await account.create('unique()', email, password);
                alert('Signup successful! Please log in.');

                showLogin();
                document.getElementById("modal").classList.remove("active");
            } catch (error) {
                console.error(error);
                document.getElementById("modal").classList.remove("active");
                alert(`Signup failed! : ${error}`);
            }
        });
    } else {
        console.error("Signup form not found!");
    }
});


// Login Event Listener
document.querySelector('#login-box form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    document.getElementById("modal").classList.add("active");
    try {
        await account.createEmailPasswordSession(email, password);
        alert('Login successful!');
        window.location.href = "index.html"; // Change URL to your target page

        document.getElementById('logout-btn').style.display = 'block';
        document.getElementById('login-form').style.display = 'none'

        // Update UI with email
        document.getElementById('user-email-display').innerText = `Logged in as: ${email}`;
        document.getElementById("modal").classList.remove("active");
        
    } catch (error) {
        console.error(error);
        document.getElementById("modal").classList.remove("active");
        alert(`Login failed! : ${error}`);
    }
});

// Logout Function
async function handleLogout() {
    document.getElementById("modal").classList.add("active");
    try {
        await account.deleteSession('current');
        alert('Logged out successfully!');
        document.getElementById('logout-btn').style.display = 'none';

        // Reset UI
        document.getElementById('user-email-display').innerText = '';
        document.getElementById('login-box').style.display = 'block';
       document.getElementById('login-form').style.display = 'block'
       document.getElementById("modal").classList.remove("active");
    } catch (error) {
        console.error(error);
        document.getElementById("modal").classList.remove("active");
        alert('Logout failed! Please try again');
    }
}

// Check if User is Logged In
(async () => {
    try {
        const user = await account.get();
        if (user) {
            document.getElementById('logout-btn').style.display = 'block';
            document.getElementById('signup-box').style.display = 'none';
            document.getElementById('login-box').style.display = 'block'
           document.getElementById('login-form').style.display = 'none'
            // Display logged-in user's email
            document.getElementById('user-email-display').innerText = `Logged in as: ${user.email}`;
         
            
            alert(`Welcome back, ${user.email}`);
        }
    } catch {
        console.log('Not logged in');
    }
})();

// Functions to Show/Hide Forms
window.showLogin = () => {
    document.getElementById('signup-box').style.display = 'none';
    document.getElementById('login-box').style.display = 'block';
}

function showSignup() {
    document.getElementById('login-box').style.display = 'none';
    document.getElementById('signup-box').style.display = 'block';
}

// Event Listeners for UI Buttons
document.getElementById('show-login-prompt').addEventListener('click', showLogin)
document.getElementById("show-signup-prompt").addEventListener('click', showSignup);
document.getElementById('logout-btn').addEventListener('click', handleLogout);



