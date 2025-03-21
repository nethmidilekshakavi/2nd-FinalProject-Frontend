$(document).ready(function () {
    // Load cars when the page is ready


    $(document).ready(function () {
        loadCars();

        function loadCars() {
            $.ajax({
                url: "http://localhost:8080/api/c1/cars",
                type: "GET", // HTTP method
                success: function (data) {
                    const container = $("#carCardContainer").empty();


                    if (data.length === 0) {
                        container.append(`<p>No cars available.</p>`);
                        return;
                    }


                    data.forEach(car => {
                        const carCard = createCarCard(car);
                        container.append(carCard); // Append the generated card
                    });
                },
                error: function (xhr, status, error) {
                    alert(`Error loading cars: ${xhr.responseText || error || status}`);
                }
            });
        }

        function createCarCard(car) {
            return `
            <div class="vehicle-card" data-car-id="${car.carId}">
                <div class="vehicle-image">
                    <img src="data:image/jpeg;base64,${car.image}" alt="Car Image">
                </div>
                <div class="vehicle-details">
                    <h3>${car.model}</h3>
                    <div class="status-badge ${getBadgeClass(car.status)}">
                        ${car.status}
                    </div>
                    <div class="vehicle-info">
                        <p><strong>Registration:</strong> ${car.registrationNumber}</p>
                        <p><strong>Plate Number:</strong> ${car.plateNumber}</p>
                        <p><strong>Capacity:</strong> ${car.capacity} seats</p>
                        <p><strong>AC:</strong> ${car.airConditioning ? "Available" : "Not Available"}</p>
                        <p><strong>WiFi:</strong> ${car.wifi ? "Available" : "Not Available"}</p>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-update" data-car-id="${car.carId}">Update</button>
                        <button class="btn btn-delete" data-car-id="${car.carId}">Delete</button>
                    </div>
                </div>
            </div>
        `;
        }

        function getBadgeClass(status) {
            switch (status) {
                case 'AVAILABLE': return 'status-available';
                case 'NOT_AVAILABLE': return 'status-unavailable';
                case 'UNDER_MAINTENANCE': return 'status-maintenance';
                default: return 'status-unknown';
            }
        }
    });

    function getBadgeClass(status) {
        const badgeClasses = {
            "AVAILABLE": "status-available",
            "NOT_AVAILABLE": "status-unavailable",
            "UNDER_MAINTENANCE": "status-maintenance"
        };
        return badgeClasses[status] || "status-unknown";
    }

    function createCarCard(car) {
        return `
        <div class="vehicle-card" data-bus-id="${car.carId}">
            <div class="vehicle-image">
                <img src="data:image/jpeg;base64,${car.image}" alt="Bus Image">
            </div>
            <div class="vehicle-details">
                <h3>${car.model}</h3>
                <div class="status-badge ${getBadgeClass(car.status)}">${car.status}</div>
                <div class="vehicle-info">
                    <p><strong>Registration:</strong> ${car.registrationNumber}</p>
                    <p><strong>Plate Number:</strong> ${car.plateNumber}</p>
                    <p><strong>Capacity:</strong> ${car.capacity} seats</p>
                    <p><strong>AC:</strong> ${car.airConditioning || "Not Available"}</p>
                    <p><strong>WiFi:</strong> ${car.wifi || "Not Available"}</p>
                </div>
                <div class="card-actions">
                    <button class="btn btn-update" data-car-id="${car.carId}">Update</button>
                    <button class="btn btn-delete" data-car-id="${car.carId}">Delete</button>
                </div>
            </div>
        </div>
        `;
    }

    $("#carForm").submit(function (event) {
        event.preventDefault();
        const car = new FormData(this);

        $.ajax({
            url: "http://localhost:8080/api/v1/Cars",
            type: "POST",
            data: car,
            contentType: false,
            processData: false,
            success: function (newCar) {
                alert("Car added successfully!");

                $("#carCardContainer").prepend(createCarCard(newCar));
                $("#carForm")[0].reset();
                closeModal("CarModel");
            },
            error: function (xhr) {
                alert(`Error adding car: ${xhr.responseText || "An error occurred."}`);
            }
        });
    });

    document.addEventListener("DOMContentLoaded", function () {
        fetch('insuranceNames')
            .then(response => response.json())
            .then(data => {
                const select = document.getElementById("insurancec");
                select.innerHTML = ""; // Clear existing options
                data.forEach(option => {
                    let opt = document.createElement("option");
                    opt.value = option;
                    opt.textContent = option.replace("_", " "); // Format text
                    select.appendChild(opt);
                });
            })
            .catch(error => console.error('Error loading insurance options:', error));
    });

    $(document).on("click", ".btn-update", function () {
        const carId = $(this).data("car-id");
        loadCarDataIntoUpdateForm(carId);
    });


    function loadCarDataIntoUpdateForm(carId) {
        $.ajax({
            url: `http://localhost:8080/api/v1/Cars/${carId}`,
            type: "GET",
            success: function (carData) {
                $("#UpdateCarForm")[0].reset(); // Clear form first

                // Populate the update form fields with car data
                for (const [key, value] of Object.entries(carData)) {
                    if (key === "image") continue; // Skip image field, handle it separately if needed
                    $(`#${key}Update`).val(value);
                }

                $("#UpdateCarModel").show();
            },
            error: function (xhr) {
                alert(`Error loading car details: ${xhr.responseText}`);
            }
        });
    }

    // Handle the form submission for updating a car
    $("#UpdateCarForm").submit(function (event) {
        event.preventDefault();
        const carId = $("#carIdUpdate").val();
        const car = new FormData(this);

        $.ajax({
            url: `http://localhost:8080/api/v1/Cars/${carId}`,
            type: "PUT",
            data: car,
            contentType: false,
            processData: false,
            success: function () {
                alert("Car updated successfully!");
                loadCars(); // Reload all cars
                $("#UpdateCarForm")[0].reset();
                closeModal('UpdateCarModel');
            },
            error: function (xhr) {
                alert(`Error updating car: ${xhr.responseText}`);
            }
        });
    });

    $(document).on("click", ".btn-delete", function () {
        const carId = $(this).data("car-id");
        if (confirm("Are you sure you want to delete this car?")) {
            $.ajax({
                url: `http://localhost:8080/api/v1/Cars/${carId}`,
                type: "DELETE",
                success: function () {
                    alert("Car deleted successfully!");
                    loadCars(); // Reload all cars
                },
                error: function (xhr) {
                    alert(`Error deleting car: ${xhr.responseText}`);
                }
            });
        }
    });

    function closeModal(modalId) {
        $(`#${modalId}`).hide();
    }

    // Make closeModal available globally for use in HTML onclick attributes
    window.closeModal = closeModal;
});