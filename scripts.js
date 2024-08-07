// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAUcAdcSR2jIiDWI3J_Wa78Xiy-saqMU78",
    authDomain: "rsvp-daacd.firebaseapp.com",
    projectId: "rsvp-daacd",
    storageBucket: "rsvp-daacd.appspot.com",
    messagingSenderId: "257111835647",
    appId: "1:257111835647:web:51b0d155e48363713eddca",
    measurementId: "G-5ZWXHTGDPG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Handle form submission for popup
document.getElementById('attendee-form-popup').addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('name-popup').value;
    const pax = document.getElementById('pax-popup').value;
    const status = document.getElementById('status-popup').value;
    const comment = document.getElementById('comment-popup').value;

    try {
        await addDoc(collection(db, 'attendees'), {
            name,
            pax: parseInt(pax, 10),
            status,
            comment
        });
        alert('Attendee details submitted successfully!');
        event.target.reset();
        togglePopup(); // Close the popup
        loadAttendees(); // Refresh attendees list
    } catch (error) {
        console.error('Error adding document: ', error);
    }
});

// Toggle popup visibility
function togglePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = popup.style.display === 'flex' ? 'none' : 'flex';
}

// Load attendees from Firestore
async function loadAttendees() {
    const goingContainer = document.getElementById('going-attendees');
    const notGoingContainer = document.getElementById('not-going-attendees');
    const totalGoingElem = document.getElementById('total-going');
    const totalNotGoingElem = document.getElementById('total-not-going');
    const totalPaxElem = document.getElementById('total-pax');

    goingContainer.innerHTML = '';
    notGoingContainer.innerHTML = '';
   
    let totalGoing = 0;
    let totalNotGoing = 0;
    let totalPax = 0;

    try {
        const querySnapshot = await getDocs(collection(db, 'attendees'));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const attendeeHTML = `
                <div>
                    <h3>${data.name}</h3>
                    <p><strong>Pax:</strong> ${data.pax || 'N/A'}</p>
                    <p><strong>Comment:</strong> ${data.comment || 'N/A'}</p>
                </div>
            `;

            if (data.status === 'Going') {
                goingContainer.innerHTML += attendeeHTML;
                totalGoing++;
            } else if (data.status === 'Not Going') {
                notGoingContainer.innerHTML += attendeeHTML;
                totalNotGoing++;
            }

            totalPax += data.pax || 0;
        });

        totalGoingElem.textContent = totalGoing;
        totalNotGoingElem.textContent = totalNotGoing;
        totalPaxElem.textContent = totalPax;
    } catch (error) {
        console.error('Error fetching documents: ', error);
    }
}

// Initial load
loadAttendees();
