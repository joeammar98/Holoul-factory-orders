// --- DO NOT EDIT ---
// This connects to your Firebase project using the keys you provided.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc, deleteDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
const ordersCollection = collection(db, 'orders');
// --- END OF DO NOT EDIT ---


// --- APP LOGIC ---
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
    const time = order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleTimeString('en-US') : 'Just now';
    
    card.innerHTML = `
      <p style="font-weight: bold; font-size: 18px; margin: 0;">${order.text}</p>
      <p style="font-size: 14px; color: #555; margin: 5px 0 10px;">Received: ${time}</p>
      <button class="send-button" data-id="${orderId}">Mark as Complete</button>
    `;
    
    orderList.appendChild(card);
  });
});

// Handle clicking "Mark as Complete"
orderList.addEventListener('click', async (e) => {
    if(e.target.tagName === 'BUTTON') {
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