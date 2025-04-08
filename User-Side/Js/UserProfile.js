let pickUpLocation = "";
let pickUpTime = "";
let DropLocation = "";
let DropTime = "";
let Amount = 0;

function createBookingCard(booking) {
    console.log("===========================" + booking);

    function getStatusClass(status) {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return 'status-confirmed';
            case 'pending':
                return 'status-pending';
            case 'cancelled':
                return 'status-cancelled';
            case 'completed':
                return 'status-completed';
            default:
                return '';
        }
    }

    function formatTime(timeString) {
        if (!timeString) return '';
        const date = new Date(`1970-01-01T${timeString}`);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', hour12: true
        });
    }

    function getActionButtons(status) {
        console.log(booking.id);
        status = status.toLowerCase();
        switch (status) {
            case 'confirmed':
                return ` 
                    <button class="btn btn-outline">View E-Ticket</button>
                    <button class="btn btn-primary" onclick="makePayment('${booking.id}')">Make Payment</button>
                `;
            case 'pending':
                return '<button class="btn btn-outline">Payment Details</button><button class="btn btn-primary">Pending</button>';
            case 'cancelled':
                return '<button class="btn btn-outline">View Details</button><a href=""><button class="btn btn-primary">Rebook</button></a>';
            case 'completed':
                return '<button class="btn btn-outline">View Receipt</button><button class="btn btn-primary">Book Again</button>';
            default:
                return '<button class="btn btn-outline">View Details</button><button class="btn btn-primary">Manage Booking</button>';
        }
    }

    const bookingId = booking.id;
    pickUpLocation = booking.pickupLocation;
    pickUpTime = booking.pickupTime;
    DropLocation = booking.returnLocation;
    DropTime = booking.returnTime;
    const status = booking.status || 'pending';
    const departureTime = formatTime(booking.pickupTime);
    const arrivalTime = formatTime(booking.returnTime); // Fixed here
    const dueAmount = booking.price;

    Amount = booking.price;

    sessionStorage.setItem("selectedBooking", JSON.stringify(booking));

    return `
        <div class="booking-item">
            <div class="booking-header">
                <div class="booking-id">${bookingId ? `Booking #${bookingId}` : ''}</div>
                <div class="booking-status ${getStatusClass(status)}">${status}</div>
            </div>

            <div class="booking-details">
                <div class="booking-detail"><span class="detail-label">Transport Type</span><span class="detail-value">${booking.model}</span></div>
                <div class="booking-detail"><span class="detail-label">Booking Date</span><span class="detail-value">${booking.date}</span></div>
                <div class="booking-detail"><span class="detail-label">PickUp Time</span><span class="detail-value">${departureTime}</span></div>
                <div class="booking-detail"><span class="detail-label">Due Amount</span><span class="detail-value">${dueAmount}</span></div>
            </div>

            <div class="booking-route">
                <div class="route-point">
                    <div class="point-marker"></div>
                    <div class="point-name">${booking.pickupLocation}</div>
                    <div class="point-time">${departureTime}</div>
                </div>
                <div class="route-line"></div>
                <div class="route-point">
                    <div class="point-marker"></div>
                    <div class="point-name">${booking.returnLocation}</div>
                    <div class="point-time">${arrivalTime}</div>
                </div>
            </div>

            <div class="booking-actions">${getActionButtons(status)}</div>
        </div>
    `;
}

function renderBookings(bookings) {
    const bookingListContainer = document.querySelector('.booking-list');

    // Ensure bookingListContainer exists before trying to update it
    if (bookingListContainer) {
        bookingListContainer.innerHTML = bookings.length ? bookings.map(createBookingCard).join('') : '<div class="no-bookings-message">You don\'t have any bookings yet.</div>';
    } else {
        console.error("Booking list container not found!");
    }
}

function fetchBookings(url) {
    return fetch(url, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')}})
        .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch bookings'));
}

function fetchAndDisplayBookings() {
    const bookingListContainer = document.querySelector('.booking-list');

    // Check if the container exists before attempting to manipulate it
    if (bookingListContainer) {
        bookingListContainer.innerHTML = '<div class="loading-message">Loading your bookings...</div>';

        Promise.all([
            fetchBookings('http://localhost:8080/api/b1/busBooking/getOnlyUserBooking'),
            fetchBookings('http://localhost:8080/api/v1/vanBooking/getOnlyUserBooking/van'),
            fetchBookings('http://localhost:8080/api/c1/carBooking/car/getOnlyUserBooking')
        ])
            .then(([busBookings, vanBookings, carBookings]) => {
                const allBookings = [...busBookings, ...vanBookings, ...carBookings];
                sessionStorage.setItem("allUserBookings", JSON.stringify(allBookings)); // Store globally
                renderBookings(allBookings);
            });

    }
}

function setupFilterButtons() {
    document.querySelectorAll('.filter-button').forEach(button => {
        button.addEventListener('click', function () {
            document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filterType = button.textContent.trim().toLowerCase();
            document.querySelectorAll('.booking-item').forEach(item => {
                const status = item.querySelector('.booking-status').textContent.trim().toLowerCase();
                item.style.display = (filterType === 'all bookings' ||
                    (filterType === 'upcoming' && (status === 'confirmed' || status === 'pending')) ||
                    (filterType === 'completed' && status === 'completed') ||
                    (filterType === 'cancelled' && status === 'cancelled')) ? 'block' : 'none';
            });
        });
    });
}

function makePayment(bookingId) {
    const allBookings = JSON.parse(sessionStorage.getItem("allUserBookings") || "[]");

    const selectedBooking = allBookings.find(b => b.id === bookingId);
    if (selectedBooking) {
        sessionStorage.setItem("selectedBooking", JSON.stringify(selectedBooking));
        sessionStorage.setItem("selectedBookingId", bookingId);
        window.location.href = "paymentSave.html";
    } else {
        console.error("Selected booking not found in sessionStorage!");
    }
}


document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayBookings();
    setupFilterButtons();
});
