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
                alert('Inscription réussie ! Veuillez vous connecter.');

                showLogin();
                document.getElementById("modal").classList.remove("active");
            } catch (error) {
                console.error(error);
                document.getElementById("modal").classList.remove("active");
                alert(`Échec de l'inscription ! : ce compte existe deja ou veuillez verifier que votre email est valide et votre mot de passe doit etre plus long que 8 charactere`);
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
        alert('Connexion réussie !');
        window.location.href = "index.html"; // Change URL to your target page

        document.getElementById('logout-btn').style.display = 'block';
        document.getElementById('login-form').style.display = 'none'

        // Update UI with email
        document.getElementById('user-email-display').innerText = `Connecter: ${email}`;
        document.getElementById("modal").classList.remove("active");
        
    } catch (error) {
        console.error(error);
        document.getElementById("modal").classList.remove("active");
        alert(`Échec de la connexion ! Vérifiez le mot de passe ou l'email. `);
    }
});

// Logout Function
async function handleLogout() {
    document.getElementById("modal").classList.add("active");
    try {
        await account.deleteSession('current');
        alert('Déconnecte !');
        document.getElementById('logout-btn').style.display = 'none';

        // Reset UI
        document.getElementById('user-email-display').innerText = '';
        document.getElementById('login-box').style.display = 'block';
       document.getElementById('login-form').style.display = 'block'
       document.getElementById("modal").classList.remove("active");
    } catch (error) {
        console.error(error);
        document.getElementById("modal").classList.remove("active");
        alert('Échec de la déconnexion ! Veuillez réessayer');
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
            document.getElementById('user-email-display').innerText = `Connecte: ${user.email}`;
         
            
            alert(`Bon retour !, ${user.email}`);
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



