import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA_5cqElmTf_UW8chdEBH1lcY4cWx3RI88",
  authDomain: "holoul-factory-orders.firebaseapp.com",
  projectId: "holoul-factory-orders",
  storageBucket: "holoul-factory-orders.firebasestorage.app",
  messagingSenderId: "1069932100494",
  appId: "1:1069932100494:web:937a4f69fe206836ef42df"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const usernameInput = document.getElementById('username');

// If user is already logged in, redirect them to the main app
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = 'index.html';
    }
});

// Login button
loginBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
        // onAuthStateChanged will handle the redirect
    } catch (error) {
        alert("Error logging in: " + error.message);
    }
});

// Signup button logic now saves the username
signupBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    const username = usernameInput.value;

    if (username === "") {
        alert("Please enter a username to create an account.");
        return;
    }
    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // After creating the user, update their profile with the username
        await updateProfile(userCredential.user, {
            displayName: username
        });
        // The onAuthStateChanged will now handle the redirect, and the user will have a display name.
    } catch (error) {
        alert("Error creating account: " + error.message);
    }
});
