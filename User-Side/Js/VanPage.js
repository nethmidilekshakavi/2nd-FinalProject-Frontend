
$(document).ready(function() {
    loadVansUser();
    setupFiltersVans();
});

// Filter functionality
function setupFiltersVans() {
    const filterItems = document.querySelectorAll('.filter-item');

    filterItems.forEach(item => {
        item.addEventListener('click', function () {
            // Remove active class from all filters
            filterItems.forEach(filter => filter.classList.remove('active'));

            // Add active class to clicked filter
            this.classList.add('active');

            // Get the filter value
            const filterValue = this.getAttribute('data-filter');

            // Filter buses based on selection
            filterVans(filterValue);
        });
    });
}

// Filter buses based on selected category
function filterVans(filterValue) {
    const vanCards = document.querySelectorAll('.vehicle-card');

    vanCards.forEach(card => {
        if (filterValue === 'all') {
            card.style.display = 'block';
        } else {
            const vanType = card.getAttribute('data-type');

            if (vanType === filterValue) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

function loadVansUser() {
    $.ajax({
        url: "http://localhost:8080/api/v1/Vans",
        type: "GET",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        },
        success: function(data) {
            const container = $("#vanCardContainerUserSide");
            container.empty();



            if (data.length === 0) {
                container.append("<p>No buses available at the moment. Please check back later.</p>");
                return;
            }

            const vanTypes = {
                "MINI": "mini",
                "STANDARD": "standard",
                "LUXURY": "luxury",
                "DOUBLE_DECKER": "double"
            };


            data.forEach(van => {

                const vanType = vanTypes[van.type] || "standard";

                const vanCard = showVanCard(van, vanType);
                container.append(vanCard);
            });

        },
        error: function(xhr, status, error) {
            console.error("Error loading vans:", error);
            $("#vanCardContainer").html(`
                    <div class="error-message">
                        <p>Failed to load buses. Please try again later.</p>
                        <p>Error: ${xhr.responseText || error || status}</p>
                    </div>
                `);
        }
    });
}

function showVanCard(van, vanType) {

    console.log(van)

    const features = [];

    features.push(`<div class="feature"><i class="fas fa-users"></i> ${van.capacity} Seats</div>`);

    if (van.airConditioning === "Available" || van.airConditioning === true) {
        features.push(`<div class="feature"><i class="fas fa-snowflake"></i> AC</div>`);
    }

    if (van.wifi === "Available" || van.wifi === true) {
        features.push(`<div class="feature"><i class="fas fa-wifi"></i> WiFi</div>`);
    }

    return `
            <div class="van-card vehicle-card" data-van-id="${van.vanId}" data-type="${vanType}">
                <div class="van-image vehicle-image">
                    <img src="data:image/jpeg;base64,${van.image}" alt="${van.model}">
                </div>
                <div class="van-details vehicle-details">
                    <h3 class="van-title">${van.model}</h3>
                    <div class="status-badge ${getBadgeClass(van.status)}">${formatStatus(van.status)}</div>
                    <div class="van-features">
                        ${features.join("")}
                    </div>
                    <div class="vehicle-info">
                        <p><strong>Registration:</strong> ${van.registrationNumber}</p>
                        <p><strong>Plate Number:</strong> ${van.plateNumber}</p>
                        <p><strong>Air Condition:</strong> ${van.airConditioning}</p>
                        <p><strong>Wifi:</strong> ${van.wifi}</p>
                    </div>
                    ${van.status === 'AVAILABLE' ?
        `<div class="van-price">Starting from Rs.${calculatePrice(van)} / day</div>
                         <a href="VanBooking.html?vanId=${van.vanId}&vanModel=${van.model}" class="btn">Book Now</a>` :
        `<div class="van-unavailable">Currently unavailable</div>`
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

