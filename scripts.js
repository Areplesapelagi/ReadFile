document.addEventListener("DOMContentLoaded", function() {
    const overlay = document.getElementById("overlay");
    const mainContent = document.getElementById("main-content");
    const openButton = document.getElementById("open-button");

    // Ensure the overlay is visible and the main content is hidden on page load
    overlay.style.display = "flex";
    mainContent.style.display = "none";

    openButton.addEventListener("click", function() {
        overlay.style.transition = "opacity 0.5s ease"; // Apply a transition for the fade effect
        overlay.style.opacity = "0"; // Start the fade out effect

        // Wait for the transition to complete before hiding the overlay and showing the main content
        setTimeout(function() {
            overlay.style.display = "none";
            mainContent.style.display = "block";
        }, 500); // Match the timeout with the duration of the fade effect
    });
});

// Toggle popup visibility for Add Attendee
function togglePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = popup.style.display === 'flex' ? 'none' : 'flex';
}

// Toggle popup visibility for Attendees List
function toggleAttendeesPopup() {
    const attendeesPopup = document.getElementById('attendees-popup');
    attendeesPopup.style.display = attendeesPopup.style.display === 'flex' ? 'none' : 'flex';
}

// Toggle popup visibility for Contact
function toggleContactPopup() {
    const contactPopup = document.getElementById('contact-popup');
    contactPopup.style.display = contactPopup.style.display === 'flex' ? 'none' : 'flex';
}

// Toggle popup visibility for Location
function toggleLocationPopup() {
    const locationPopup = document.getElementById('location-popup');
    locationPopup.style.display = locationPopup.style.display === 'flex' ? 'none' : 'flex';
}

// Toggle popup visibility for Comments
function toggleCommentsPopup() {
    const commentsPopup = document.getElementById('comments-popup');
    commentsPopup.style.display = commentsPopup.style.display === 'flex' ? 'none' : 'flex';
}


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
async function loadComments() {
    const commentsContainer = document.getElementById('comments-list');

    commentsContainer.innerHTML = '';

    try {
        const querySnapshot = await getDocs(collection(db, 'attendees'));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const commentHTML = `
                <div>
                    <p><strong>Comment:</strong> ${data.comment || 'N/A'}</p>
                </div>
            `;
            commentsContainer.innerHTML += commentHTML;
        });
    } catch (error) {
        console.error('Error fetching comments: ', error);
    }
}
// Initial load
loadAttendees();
