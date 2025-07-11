import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc, deleteDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA_5cqElmTf_UW8chdEBH1lcY4cWx3RI88",
  authDomain: "holoul-factory-orders.firebaseapp.com",
  projectId: "holoul-factory-orders",
  storageBucket: "holoul-factory-orders.firebasestorage.app",
  messagingSenderId: "1069932100494",
  appId: "1:1069932100494:web:937a4f69fe206836ef42df"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const ordersCollection = collection(db, 'orders');

const orderList = document.getElementById('orderList');

// Create a query to get orders sorted by time (newest first)
const q = query(ordersCollection, orderBy('createdAt', 'desc'));

// Listen for real-time updates
onSnapshot(q, (snapshot) => {
    // Clear the current list
    orderList.innerHTML = '';
  
    if (snapshot.empty) {
        orderList.innerHTML = `<div class="order-card-placeholder"><p>No active orders.</p></div>`;
        return;
    }

    // Add each order to the list
    snapshot.forEach(docSnap => {
        const order = docSnap.data();
        const orderId = docSnap.id;
    
        const card = document.createElement('div');
        card.className = 'order-card';
    
        // Format the time
        const time = order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now';
    
        // Display the username
        card.innerHTML = `
          <p class="order-text">${order.text}</p>
          <p class="order-meta">From: <strong>${order.username}</strong></p> 
          <p class="order-meta">Received: ${time}</p>
          <button class="complete-button" data-id="${orderId}">Mark as Complete</button>
        `;
    
        orderList.appendChild(card);
    });
});

// Handle clicking "Mark as Complete"
orderList.addEventListener('click', async (e) => {
    if(e.target.tagName === 'BUTTON' && e.target.classList.contains('complete-button')) {
        const id = e.target.getAttribute('data-id');
        if (confirm('Are you sure you want to complete this order?')) {
            try {
                await deleteDoc(doc(db, 'orders', id));
            } catch (err) {
                console.error("Error removing document: ", err);
            }
        }
    }
});
