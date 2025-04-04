function createBookingCard(booking) {
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
        try {
            if (timeString.includes('T')) {
                return new Date(timeString).toLocaleTimeString('en-US', {
                    hour: '2-digit', minute: '2-digit', hour12: true
                });
            }
            if (timeString.includes(':')) {
                const [hours, minutes] = timeString.split(':');
                const hourNum = parseInt(hours);
                const ampm = hourNum >= 12 ? 'PM' : 'AM';
                const displayHour = hourNum % 12 || 12;
                return `${displayHour}:${minutes} ${ampm}`;
            }
            return timeString;
        } catch (e) {
            console.error("Error formatting time:", e);
            return timeString;
        }
    }

    function getActionButtons(status) {
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
                return '<button class="btn btn-outline">View Details</button><button class="btn btn-primary">Rebook</button>';
            case 'completed':
                return '<button class="btn btn-outline">View Receipt</button><button class="btn btn-primary">Book Again</button>';
            default:
                return '<button class="btn btn-outline">View Details</button><button class="btn btn-primary">Manage Booking</button>';
        }
    }


    const bookingId = booking.id;
    const status = booking.status || 'pending';
    const departureTime = formatTime(booking.pickupTime);
    const arrivalTime = formatTime(booking.returnTime);
    const amount = parseFloat(booking.totalAmount || 0).toFixed(2);

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
                <div class="booking-detail"><span class="detail-label">${status.toLowerCase() === 'cancelled' ? 'Amount Refunded' : 'Amount Paid'}</span><span class="detail-value">$${amount}</span></div>
            </div>
            <div class="booking-actions">${getActionButtons(status)}</div>
        </div>
    `;
}

function renderBookings(bookings) {
    const bookingListContainer = document.querySelector('.booking-list');
    bookingListContainer.innerHTML = bookings.length ? bookings.map(createBookingCard).join('') : '<div class="no-bookings-message">You don\'t have any bookings yet.</div>';
}

function fetchBookings(url) {
    return fetch(url, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')}})
        .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch bookings'));
}

function fetchAndDisplayBookings() {
    document.querySelector('.booking-list').innerHTML = '<div class="loading-message">Loading your bookings...</div>';

    Promise.all([
        fetchBookings('http://localhost:8080/api/b1/busBooking/getOnlyUserBooking'),
        fetchBookings('http://localhost:8080/api/v1/vanBooking/getOnlyUserBooking/van'),
        fetchBookings('http://localhost:8080/api/c1/carBooking/car/getOnlyUserBooking')
    ])
        .then(([busBookings, vanBookings, carBookings]) =>
            renderBookings([...busBookings, ...vanBookings, ...carBookings])
        )
        .catch(() =>
            document.querySelector('.booking-list').innerHTML = '<div class="error-message">Failed to load your bookings. Please try again later.</div>'
        );
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
    console.log("Booking ID:", bookingId);
    if (bookingId && bookingId.trim() !== "") {
    sessionStorage.setItem("selectedBookingId", bookingId);
    window.location.href = "payment.html";
} else {
    console.error("Error: Booking ID is invalid or not found!");
    alert("Error: Booking ID not found!");
}
}



document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayBookings();
    setupFilterButtons();
});