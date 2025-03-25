
    $(document).ready(function() {

    loadBusesUser();

    setupFilters();
});

    // Filter functionality
    function setupFilters() {
    const filterItems = document.querySelectorAll('.filter-item');

    filterItems.forEach(item => {
    item.addEventListener('click', function() {
    // Remove active class from all filters
    filterItems.forEach(filter => filter.classList.remove('active'));

    // Add active class to clicked filter
    this.classList.add('active');

    // Get the filter value
    const filterValue = this.getAttribute('data-filter');

    // Filter buses based on selection
    filterBuses(filterValue);
});
});
}

    // Filter buses based on selected category
    function filterBuses(filterValue) {
    const busCards = document.querySelectorAll('.vehicle-card');

    busCards.forEach(card => {
    if (filterValue === 'all') {
    card.style.display = 'block';
} else {
    // This assumes each bus card has a data-type attribute
    // You'll need to add this attribute when creating the cards
    const busType = card.getAttribute('data-type');

    if (busType === filterValue) {
    card.style.display = 'block';
} else {
    card.style.display = 'none';
}
}
});
}


    function loadBusesUser() {
    $.ajax({
        url: "http://localhost:8080/api/v1/Buses",
        type: "GET",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        },
        success: function(data) {
            const container = $("#busCardContainerUserSide");
            container.empty();

            if (data.length === 0) {
                container.append("<p>No buses available at the moment. Please check back later.</p>");
                return;
            }

            const busTypes = {
                "MINI": "mini",
                "STANDARD": "standard",
                "LUXURY": "luxury",
                "DOUBLE_DECKER": "double"
            };


            data.forEach(bus => {

                const busType = busTypes[bus.type] || "standard";

                const busCard = showBusCard(bus, busType);
                container.append(busCard);
            });

            },
        error: function(xhr, status, error) {
            console.error("Error loading buses:", error);
            $("#busCardContainer").html(`
                    <div class="error-message">
                        <p>Failed to load buses. Please try again later.</p>
                        <p>Error: ${xhr.responseText || error || status}</p>
                    </div>
                `);
        }
    });
}

    function showBusCard(bus, busType) {

    const features = [];

    features.push(`<div class="feature"><i class="fas fa-users"></i> ${bus.capacity} Seats</div>`);

    if (bus.airConditioning === "Available" || bus.airConditioning === true) {
    features.push(`<div class="feature"><i class="fas fa-snowflake"></i> AC</div>`);
}

    if (bus.wifi === "Available" || bus.wifi === true) {
    features.push(`<div class="feature"><i class="fas fa-wifi"></i> WiFi</div>`);
}



    return `
            <div class="bus-card vehicle-card" data-bus-id="${bus.busId}" data-type="${busType}">
                <div class="bus-image vehicle-image">
                    <img src="data:image/jpeg;base64,${bus.image}" alt="${bus.model}">
                </div>
                <div class="bus-details vehicle-details">
                    <h3 class="bus-title">${bus.model}</h3>
                    <div class="status-badge ${getBadgeClass(bus.status)}">${formatStatus(bus.status)}</div>
                    <div class="bus-features">
                        ${features.join("")}
                    </div>
                    <div class="vehicle-info">
                        <p><strong>Registration:</strong> ${bus.registrationNumber}</p>
                        <p><strong>Plate Number:</strong> ${bus.plateNumber}</p>
                        <p><strong>Air Condition:</strong> ${bus.airConditioning}</p>
                        <p><strong>Wifi:</strong> ${bus.wifi}</p>
                    </div>
                    ${bus.status === 'AVAILABLE' ?
    `<div class="bus-price">Starting from Rs.${calculatePrice(bus)} / day</div>
                         <a href="booking.html?busId=${bus.busId}" class="btn">Book Now</a>` :
    `<div class="bus-unavailable">Currently unavailable</div>`
}
                </div>
            </div>
        `;
}

    // Format status for display
    function formatStatus(status) {
    if (!status) return "Unknown";

    // Convert SNAKE_CASE to Title Case
    return status.split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}


    function calculatePrice(bus) {

    let basePrice = 150;


    if (bus.capacity) {
    basePrice += bus.capacity * 2;
}


    if (bus.airConditioning === "Available" || bus.airConditioning === true) {
    basePrice += 100;
}

    if (bus.wifi === "Available" || bus.wifi === true) {
    basePrice += 150;
}

    return basePrice;
}


    function getBadgeClass(status) {
    const badgeClasses = {
    "AVAILABLE": "status-available",
    "NOT_AVAILABLE": "status-unavailable",
    "UNDER_MAINTENANCE": "status-maintenance"
};
    return badgeClasses[status] || "status-unknown";
}



