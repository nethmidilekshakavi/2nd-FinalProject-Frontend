$(document).ready(function () {
    loadCars();
    loadInsuranceNames();

    function loadCars() {
        $.ajax({
            url: "http://localhost:8080/api/c1/cars",
            type: "GET",
            success: function (data) {
                const container = $("#carCardContainer").empty();

                if (data.length === 0) {
                    container.append(`<p>No cars available.</p>`);
                    return;
                }

                data.forEach(car => {
                    const carCard = createCarCard(car);
                    container.append(carCard);
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
                    <div class="status-badge ${getBadgeClass(car.status)}">${car.status}</div>
                    <div class="vehicle-info">
                        <p><strong>Registration:</strong> ${car.registrationNumber}</p>
                        <p><strong>Plate Number:</strong> ${car.plateNumber}</p>
                        <p><strong>Capacity:</strong> ${car.capacity} seats</p>
                        <p><strong>AC:</strong> ${car.airConditioning || "Not Available"}</p>
                        <p><strong>WiFi:</strong> ${car.wifi || "Not Available"}</p>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-update" data-car-id="${car.carId}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-delete" data-car-id="${car.carId}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `;
    }

    function getBadgeClass(status) {
        const badgeClasses = {
            "AVAILABLE": "status-available",
            "NOT_AVAILABLE": "status-unavailable",
            "UNDER_MAINTENANCE": "status-maintenance"
        };
        return badgeClasses[status] || "status-unknown";
    }

    $("#carForm").submit(function (event) {
        event.preventDefault();

        let car = new FormData();
        car.append('carId', $("#carId").val());
        car.append('air', $("#airConditioningc").val());
        car.append('capacity', $("#capacityc").val());
        car.append('model', $("#modelc").val());
        car.append('plateNumber', $("#plateNumberc").val());
        car.append('registration', $("#registrationNumberc").val());
        car.append('status', $("#statusc").val());
        car.append('wifi', $("#wific").val());
        car.append('year', $("#yearc").val());
        car.append('insuranceName', $("#insurancenc").val());

        const imageFile = $('#imagec')[0].files[0];
        if (!imageFile) {
            alert("Please select an image!");
            return;
        }
        car.append("image", imageFile);

        $.ajax({
            url: "http://localhost:8080/api/c1/cars",
            type: "POST",
            data: car,
            contentType: false,
            processData: false,
            success: function (newCar) {
                alert("Car added successfully");
                loadCars();
                $("#carForm")[0].reset();
                closeModal('CarMode');
            },
            error: function (xhr, status, error) {
                alert("Error adding car: " + (xhr.responseText || error || status));
            }
        });
    });

    function loadInsuranceNames() {
        $.ajax({
            url: "http://localhost:8080/api/i1/insurance/insuranceNames",
            type: "GET",
            dataType: "json",
            success: function (data) {
                const container = $("#insurancenc").empty();
                container.append('<option value="">Select an Insurance</option>');

                if (!data || data.length === 0) {
                    container.append('<option value="">No insurance available</option>');
                    return;
                }

                data.forEach(ins => {
                    const id = ins.id || ins.insuranceId || ins;
                    const name = ins.provider || ins.providerName || ins;
                    container.append(`<option value="${id}">${name}</option>`);
                });
            },
            error: function (xhr) {
                console.error("Error loading insurance names:", xhr.responseText);
                $("#insurancenc").append('<option value="">Error loading data</option>');
            }
        });
    }

    $(document).on("click", ".btn-delete", function () {
        const carId = $(this).data("car-id");
        if (confirm("Are you sure you want to delete this car?")) {
            $.ajax({
                url: `http://localhost:8080/api/c1/cars/${carId}`,
                type: "DELETE",
                success: function () {
                    alert("Car deleted successfully!");
                    loadCars();
                },
                error: function (xhr) {
                    alert(`Error deleting car: ${xhr.responseText}`);
                }
            });
        }
    });

    function closeModal(modalId) {
        $(`#${modalId}`).modal('hide'); // Bootstrap modal hide
    }

    window.closeModal = closeModal;
});
