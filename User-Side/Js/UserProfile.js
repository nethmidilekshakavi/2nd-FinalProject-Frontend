// Function to create a booking card
function createBookingCard(booking) {
    // Determine the status class
    function getStatusClass(status) {
        switch(status.toLowerCase()) {
            case 'confirmed':
                return 'status-confirmed';
            case 'pending':
                return 'status-pending';
            case 'cancelled': // Note the extra 'l' to match your data
                return 'status-cancelled';
            case 'completed':
                return 'status-completed';
            default:
                return '';
        }
    }

    // Format date to readable format
    function formatDate(dateString) {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                // Handle numeric timestamps (if needed)
                const timestamp = parseInt(dateString);
                if (!isNaN(timestamp)) {
                    return new Date(timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                }
                return dateString; // Return as-is if we can't parse it
            }

            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            console.error("Error formatting date:", e);
            return dateString;
        }
    }

    // Format time to 12-hour format
    function formatTime(timeString) {
        if (!timeString) return '';

        try {
            // Check if it's a full ISO string
            if (timeString.includes('T')) {
                const date = new Date(timeString);
                return date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });
            }

            // Handle HH:MM format
            if (timeString.includes(':')) {
                const [hours, minutes] = timeString.split(':');
                const hourNum = parseInt(hours);
                const ampm = hourNum >= 12 ? 'PM' : 'AM';
                const displayHour = hourNum % 12 || 12;
                return `${displayHour}:${minutes} ${ampm}`;
            }

            // Handle numeric timestamp (if needed)
            const timestamp = parseInt(timeString);
            if (!isNaN(timestamp)) {
                return new Date(timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });
            }

            return timeString; // Return as-is if we can't parse it
        } catch (e) {
            console.error("Error formatting time:", e);
            return timeString;
        }
    }

    // Get the appropriate action buttons based on booking status
    function getActionButtons(status) {
        status = status.toLowerCase();

        if (status === 'confirmed') {
            return `
            <button class="btn btn-outline">View E-Ticket</button>
            <button class="btn btn-primary" onclick="makePayment()">Make Payment</button>
        `;
        } else if (status === 'pending') {
            return `
            <button class="btn btn-outline">Payment Details</button>
            <button class="btn btn-primary">Pending</button>
        `;
        } else if (status === 'cancelled') {
            return `
            <button class="btn btn-outline">View Details</button>
            <button class="btn btn-primary">Rebook</button>
        `;
        } else if (status === 'completed') {
            return `
            <button class="btn btn-outline">View Receipt</button>
            <button class="btn btn-primary">Book Again</button>
        `;
        } else {
            return `
            <button class="btn btn-outline">View Details</button>
            <button class="btn btn-primary">Manage Booking</button>
        `;
        }
    }



    // Format passenger information
    function formatPassengers(booking) {
        const adults = booking.adultCount || booking.adults || 1; // Default to 1 adult
        const children = booking.childCount || booking.children || 0;

        let passengerText = '';
        if (adults > 0) {
            passengerText += `${adults} Adult${adults > 1 ? 's' : ''}`;
        }
        if (children > 0) {
            passengerText += passengerText ? ', ' : '';
            passengerText += `${children} Child${children > 1 ? 'ren' : ''}`;
        }

        return passengerText;
    }

        console.log(booking)


    const bookingId = booking.id;
    const status = booking.status || 'confirmed';
    const transportType = booking.model;
    const pick = booking.pickupTime;
    const journeyDate = booking.date
    const amount = parseFloat(booking.totalAmount || booking.amount || booking.price || 0).toFixed(2);
    const fromLocation = booking.pickupLocation
    const toLocation = booking.returnLocation
    const departureTime = formatTime(booking.pickupTime);
    const arrivalTime = formatTime(booking.returnTime)
    const passengers = formatPassengers(booking);
    const statusClass = getStatusClass(status);

    // Create and return the booking card HTML
    return `
        <div class="booking-item">
            <div class="booking-header">
                <div class="booking-id">${bookingId ? `Booking #${bookingId}` : ''}</div>
                <div class="booking-status ${statusClass}">${status}</div>
            </div>
            <div class="booking-details">
                <div class="booking-detail">
                    <span class="detail-label">Transport Type</span>
                    <span class="detail-value">${transportType}</span>
                </div>
                <div class="booking-detail">
                    <span class="detail-label">Booking Date</span>
                    <span class="detail-value">${journeyDate}</span>
                </div>
                <div class="booking-detail">
                    <span class="detail-label">PickUp Time</span>
                    <span class="detail-value">${pick}</span>
                </div>
                <div class="booking-detail">
                    <span class="detail-label">${status.toLowerCase() === 'cancelled' ? 'Amount Refunded' : 'Amount Paid'}</span>
                    <span class="detail-value">$${amount}</span>
                </div>
            </div>
            <div class="booking-route">
                <div class="route-point">
                    <div class="point-marker"></div>
                    <div class="point-name">${fromLocation}</div>
                    <div class="point-time">${departureTime}</div>
                </div>
                <div class="route-line"></div>
                <div class="route-point">
                    <div class="point-marker"></div>
                    <div class="point-name">${toLocation}</div>
                    <div class="point-time">${arrivalTime}</div>
                </div>
            </div>
            <div class="booking-actions">
                ${getActionButtons(status)}
            </div>
        </div>
    `;
}

// Example usage: Render all bookings
function renderBookings(bookings) {
    const bookingListContainer = document.querySelector('.booking-list');

    if (!bookings || bookings.length === 0) {
        bookingListContainer.innerHTML = `
            <div class="no-bookings-message">
                You don't have any bookings yet.
            </div>
        `;
        return;
    }

    // Create HTML for each booking and join them
    const bookingsHTML = bookings.map(booking => createBookingCard(booking)).join('');

    // Insert all booking cards into the container
    bookingListContainer.innerHTML = bookingsHTML;

    // Add event listeners to buttons (if needed)
    addBookingEventListeners();
}

// Add event listeners to booking action buttons
function addBookingEventListeners() {
    // View E-Ticket buttons
    document.querySelectorAll('.btn-outline').forEach(button => {
        button.addEventListener('click', function() {
            const bookingItem = this.closest('.booking-item');
            const bookingId = bookingItem.querySelector('.booking-id')?.textContent.replace('Booking #', '') || '';
            console.log(`View details for booking: ${bookingId}`);
            // You can implement actual view functionality here
        });
    });

    // Primary action buttons
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', function() {
            const bookingItem = this.closest('.booking-item');
            const bookingId = bookingItem.querySelector('.booking-id')?.textContent.replace('Booking #', '') || '';
            const action = this.textContent.trim();
            console.log(`${action} for booking: ${bookingId}`);
            // You can implement the primary action here
        });
    });
}

// Fetch bookings from API
function fetchAndDisplayBookings() {
    // Show loading state
    const bookingListContainer = document.querySelector('.booking-list');
    bookingListContainer.innerHTML = `
        <div class="loading-message">
            Loading your bookings...
        </div>
    `;

    // Fetch bookings from API
    fetch('http://localhost:8080/api/b1/busBooking/getOnlyUserBooking', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch bookings');
            }
            return response.json();
        })
        .then(data => {
            console.log("User bookings received:", data);
            renderBookings(data);
        })
        .catch(error => {
            console.error("Error fetching bookings:", error);
            bookingListContainer.innerHTML = `
            <div class="error-message">
                Failed to load your bookings. Please try again later.
            </div>
        `;
        });
}

// Add filter functionality
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-button');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            const filterType = button.textContent.trim().toLowerCase();
            const bookingItems = document.querySelectorAll('.booking-item');

            // Show/hide bookings based on filter
            bookingItems.forEach(item => {
                const status = item.querySelector('.booking-status').textContent.trim().toLowerCase();

                if (filterType === 'all bookings') {
                    item.style.display = 'block';
                } else if (filterType === 'upcoming' && (status === 'confirmed' || status === 'pending')) {
                    item.style.display = 'block';
                } else if (filterType === 'completed' && status === 'completed') {
                    item.style.display = 'block';
                } else if (filterType === 'cancelled' && (status === 'cancelled' || status === 'cancelled')) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    fetchAndDisplayBookings();
    setupFilterButtons();
});

function makePayment() {
    alert("Redirecting to Payment Gateway...");
    // Here you can redirect to the payment page
    window.location.href = "/payment";
}
