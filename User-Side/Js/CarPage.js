$(document).ready(function() {
    loadCarsUser();
    setupFiltersCars();
});

function setupFiltersCars() {
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
            filterCars(filterValue);
        });
    });
}

function filterCars(filterValue) {
    const carCards = document.querySelectorAll('.vehicle-card');

    carCards.forEach(card => {
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

function loadCarsUser() {
    $.ajax({
        url: "http://localhost:8080/api/c1/cars",
        type: "GET",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        },
        success: function(data) {
            const container = $("#carCardContainerUserSide");
            container.empty();



            if (data.length === 0) {
                container.append("<p>No buses available at the moment. Please check back later.</p>");
                return;
            }

            const carTypes = {
                "MINI": "mini",
                "STANDARD": "standard",
                "LUXURY": "luxury",
                "DOUBLE_DECKER": "double"
            };


            data.forEach(car => {

                const carType = carTypes[car.type] || "standard";

                const vanCard = showCarCard(car, carType);
                container.append(vanCard);
            });

        },
        error: function(xhr, status, error) {
            console.error("Error loading vans:", error);
            $("#carCardContainer").html(`
                    <div class="error-message">
                        <p>Failed to load buses. Please try again later.</p>
                        <p>Error: ${xhr.responseText || error || status}</p>
                    </div>
                `);
        }
    });
}

function showCarCard(car, carType) {

    console.log(car)

    const features = [];

    features.push(`<div class="feature"><i class="fas fa-users"></i> ${car.capacity} Seats</div>`);

    if (car.airConditioning === "Available" || car.airConditioning === true) {
        features.push(`<div class="feature"><i class="fas fa-snowflake"></i> AC</div>`);
    }

    if (car.wifi === "Available" || car.wifi === true) {
        features.push(`<div class="feature"><i class="fas fa-wifi"></i> WiFi</div>`);
    }

    return `
            <div class="car-card vehicle-card" data-car-id="${car.carId}" data-type="${carType}">
                <div class="car-image vehicle-image">
                    <img src="data:image/jpeg;base64,${car.image}" alt="${car.model}">
                </div>
                <div class="car-details vehicle-details">
                    <h3 class="car-title">${car.model}</h3>
                    <div class="status-badge ${getBadgeClass(car.status)}">${formatStatus(car.status)}</div>
                    <div class="car-features">
                        ${features.join("")}
                    </div>
                    <div class="vehicle-info">
                        <p><strong>Registration:</strong> ${car.registrationNumber}</p>
                        <p><strong>Plate Number:</strong> ${car.plateNumber}</p>
                        <p><strong>Air Condition:</strong> ${car.airConditioning}</p>
                        <p><strong>Wifi:</strong> ${car.wifi}</p>
                    </div>
                    ${car.status === 'AVAILABLE' ?
        `<div class="car-price">Starting from Rs.${calculatePrice(car)} / day</div>
                         <a href="CarBooking.html?carId=${car.carId}&carModel=${car.model}" class="btn">Book Now</a>` :
        `<div class="car-unavailable">Currently unavailable</div>`
    }
                </div>
            </div>
        `;
}


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

