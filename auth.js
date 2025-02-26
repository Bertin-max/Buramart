const loginText = document.getElementById("login-text");

// Sign Up
const signupForm = document.getElementById('signup-box');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert('User signed up successfully!');
      signupForm.reset();
    })
    .catch((error) => {
      alert(error.message);
    });
});

// Login
const loginForm = document.getElementById('login-box');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert('User logged in successfully!');
      loginForm.reset();
    })
    .catch((error) => {
      alert(error.message);
    });
});
function logout() {
    auth.signOut()
      .then(() => {
        alert('You have been logged out!');
        // Redirect to login or homepage
        window.location.href = 'auth.html';  // Redirect to the login/signup page
      })
      .catch((error) => {
        alert(error.message);  // Show error if logout fails
      });
  }
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("User is logged in:", user.email);
      // You can update UI here to reflect login status
     loginText.innerHTML = user.email
      // Hide login and signup forms
      document.getElementById('loginbtn').style.display = 'none';
     
      document.getElementById('logout-btn').style.display = 'block';  // Show logout button
    } else {
      console.log("No user is logged in.");
      document.getElementById('logout-btn').style.display = 'none';  // Hide logout button
    }
  });