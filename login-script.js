import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile, setPersistence, browserSessionPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

// Tab and Form Elements
const signInTabBtn = document.getElementById('signInTabBtn');
const signUpTabBtn = document.getElementById('signUpTabBtn');
const signInForm = document.getElementById('signInForm');
const signUpForm = document.getElementById('signUpForm');

// Sign In Form Elements
const loginBtn = document.getElementById('loginBtn');
const signInEmailInput = document.getElementById('signInEmail');
const signInPasswordInput = document.getElementById('signInPassword');
const rememberMeCheckbox = document.getElementById('rememberMeCheckbox');

// Sign Up Form Elements
const signupBtn = document.getElementById('signupBtn');
const signUpUsernameInput = document.getElementById('signUpUsername');
const signUpEmailInput = document.getElementById('signUpEmail');
const signUpPasswordInput = document.getElementById('signUpPassword');


// Tab switching logic
signInTabBtn.addEventListener('click', () => {
    signInTabBtn.classList.add('active');
    signUpTabBtn.classList.remove('active');
    signInForm.style.display = 'flex';
    signUpForm.style.display = 'none';
});

signUpTabBtn.addEventListener('click', () => {
    signUpTabBtn.classList.add('active');
    signInTabBtn.classList.remove('active');
    signUpForm.style.display = 'flex';
    signInForm.style.display = 'none';
});


// If user is already logged in, redirect them to the main app
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = 'index.html';
    }
});

// Login button
loginBtn.addEventListener('click', async () => {
    const email = signInEmailInput.value;
    const password = signInPasswordInput.value;
    
    // Determine the persistence level based on the checkbox
    const persistence = rememberMeCheckbox.checked ? browserLocalPersistence : browserSessionPersistence;

    try {
        // Set persistence BEFORE signing in
        await setPersistence(auth, persistence);
        await signInWithEmailAndPassword(auth, email, password);
        // onAuthStateChanged will handle the redirect
    } catch (error) {
        alert("Error logging in: " + error.message);
    }
});

// Signup button
signupBtn.addEventListener('click', async () => {
    const email = signUpEmailInput.value;
    const password = signUpPasswordInput.value;
    const username = signUpUsernameInput.value;

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
        // onAuthStateChanged will handle the redirect
    } catch (error) {
        alert("Error creating account: " + error.message);
    }
});
