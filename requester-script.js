import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA...some-long-code...", // Your actual apiKey would be here
  authDomain: "holoul-factory-orders.firebaseapp.com",
  projectId: "holoul-factory-orders",
  storageBucket: "holoul-factory-orders.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:a1b2c3d4e5f6g7h8i9j0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const ordersCollection = collection(db, 'orders');

// Get elements from the HTML page
const orderDrinkBtn = document.getElementById('orderDrinkBtn');
const comeToOfficeBtn = document.getElementById('comeToOfficeBtn');
const modal = document.getElementById('orderModal');
const closeModalBtn = document.querySelector('.close-button');
const sendOrderBtn = document.getElementById('sendOrderBtn');
const signOutBtn = document.getElementById('signOutBtn');
const welcomeMessage = document.getElementById('welcome-message');

// Check user's login status
let currentUser = null;
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        currentUser = user;
        // Welcome the user by their chosen username (displayName)
        welcomeMessage.textContent = `Welcome, ${currentUser.displayName}`;
    } else {
        // User is signed out, redirect to login page
        window.location.href = 'login.html';
    }
});

// Sign Out button
signOutBtn.addEventListener('click', async () => {
    await signOut(auth);
});

// Show the order pop-up when "Order a Drink" is clicked
orderDrinkBtn.addEventListener('click', () => {
  modal.style.display = 'block';
});

// Hide the pop-up when the 'X' is clicked
closeModalBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Hide the pop-up if clicked outside the box
window.addEventListener('click', (event) => {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
});

// Send a "Come to Office" request
comeToOfficeBtn.addEventListener('click', async () => {
    if (!currentUser) {
        alert('You must be logged in to send a request.');
        return;
    }
    if (confirm('Are you sure you want to ask the office boy to come to the office?')) {
        try {
            await addDoc(ordersCollection, {
                text: "Request: Come to My Office",
                username: currentUser.displayName, // Use displayName
                createdAt: serverTimestamp()
            });
            alert('Request sent!');
        } catch (e) {
            console.error("Error sending request: ", e);
            alert('Error: Could not send request.');
        }
    }
});

// Send a drink order
sendOrderBtn.addEventListener('click', async () => {
    if (!currentUser) {
        alert('You must be logged in to send an order.');
        return;
    }

    const coffeeQty = document.getElementById('coffeeQty').value;
    const teaQty = document.getElementById('teaQty').value;
    const waterQty = document.getElementById('waterQty').value;

    let orderText = 'Order: ';
    let items = [];
    if (coffeeQty > 0) items.push(`${coffeeQty} Coffee`);
    if (teaQty > 0) items.push(`${teaQty} Tea`);
    if (waterQty > 0) items.push(`${waterQty} Water`);

    if (items.length === 0) {
        alert('Please order at least one item.');
        return;
    }
  
    orderText += items.join(', ');

    try {
        await addDoc(ordersCollection, {
            text: orderText,
            username: currentUser.displayName, // Use displayName
            createdAt: serverTimestamp()
        });
        alert('Order sent successfully!');
        modal.style.display = 'none';
        // Reset quantities
        document.getElementById('coffeeQty').value = 0;
        document.getElementById('teaQty').value = 0;
        document.getElementById('waterQty').value = 0;
    } catch (e) {
        console.error("Error sending order: ", e);
        alert('Error: Could not send order.');
    }
});
