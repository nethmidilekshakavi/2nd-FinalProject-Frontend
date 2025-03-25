$(document).ready(function () {
    loadCars();
    loadInsuranceNames();

    //get All cars
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
                        <button style="color: #0b7dda" class="btn btn-update-car" data-car-id="${car.carId}"><i class="fas fa-edit"></i></button>
                        <button style="color: red" class="btn btn-delete-car" data-car-id="${car.carId}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `;
    }

    //statues features
    function getBadgeClass(status) {
        const badgeClasses = {
            "AVAILABLE": "status-available",
            "NOT_AVAILABLE": "status-unavailable",
            "UNDER_MAINTENANCE": "status-maintenance"
        };
        return badgeClasses[status] || "status-unknown";
    }

    //add car
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
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Car added successfully',
                    confirmButtonText: 'OK'
                }).then(() => { // Ensures the modal closes after the user clicks "OK"
                    loadCars(); // Reload car list
                    $("#carForm")[0].reset(); // Reset form
                    closeModal('CarModal'); // Ensure the modal ID is correct
                });
            },
            error: function (xhr, status, error) {

                const errorMessage = xhr.responseText || error || status;
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error adding car: ' + errorMessage,
                    confirmButtonText: 'OK'
                });
            }
        });

    });

    // Update Car
    $("#UpdateCarForm").submit(function (event) {
        event.preventDefault();

        let car = new FormData();
        car.append('air', $("#airConditioningUpdatec").val());
        car.append('capacity', $("#capacityUpdatec").val());
        car.append('model', $("#modelUpdatec").val());
        car.append('plateNumber', $("#plateNumberUpdatec").val());
        car.append('registration', $("#registrationNumberUpdatec").val());
        car.append('status', $("#statusUpdatec").val());
        car.append('wifi', $("#wifiUpdatec").val());
        car.append('year', $("#yearUpdatec").val());
        car.append('insuranceName', $("#insurancencupdate").val());

        const imageFile = $('#imageUpdatec')[0].files[0];
        if (!imageFile) {
            alert("Please select an image!");
            return;
        }
        car.append("image", imageFile);

        $.ajax({
            url: "http://localhost:8080/api/c1/cars/" + $("#carIdUpdate").val(),
            type: "PUT",
            data: car,
            contentType: false,
            processData: false,
            success: function (newCar) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Car Updated successfully',
                    confirmButtonText: 'OK'
                });
                loadCars();
                $("#UpdateCarForm")[0].reset();
                closeModal('UpdateCarModel');
            },
            error: function (xhr, status, error) {

                const errorMessage = xhr.responseText || error || status;
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error updating car: ' + errorMessage,
                    confirmButtonText: 'OK'
                });
            }
        });
    });


    $(document).on("click", ".btn-update-car", function (e) {
        e.preventDefault();
        const carId = $(this).data("car-id");
        console.log("Car ID:", carId);
        fetchCarDetails(carId);
    });

    function fetchCarDetails(carId) {
        $.ajax({
            url: "http://localhost:8080/api/c1/cars/" + carId,
            type: "GET",
            success: function (car) {
                console.log("Car details fetched:", car);

                // Populate form fields with fetched data
                $("#carIdUpdate").val(car.carId);
                $("#airConditioningUpdatec").val(car.airConditioning);
                $("#capacityUpdatec").val(car.capacity);
                $("#modelUpdatec").val(car.model);
                $("#plateNumberUpdatec").val(car.plateNumber);
                $("#registrationNumberUpdatec").val(car.registrationNumber);
                $("#statusUpdatec").val(car.status);
                $("#wifiUpdatec").val(car.wifi);
                $("#yearUpdatec").val(car.year);
                $("#insurancencupdate").val(car.insurance ? car.insurance.provider : '');

                // Display current image (optional)
                if (car.image) {
                    $("#currentCarImage").attr("src", "data:image/png;base64," + car.image);
                    $("#currentCarImage").show();
                }

                // Open the modal
                $("#UpdateCarModel").modal("show");
            },
            error: function (xhr, status, error) {
                alert("Error fetching car details: " + (xhr.responseText || error || status));
            }
        });
    }


    //Load Insurance Names
    function loadInsuranceNames() {
        $.ajax({
            url: "http://localhost:8080/api/i1/insurance/insuranceNames",
            type: "GET",
            dataType: "json",
            success: function (data) {
                const container = $("#insurancenc").empty();
                const container1 = $("#insurancencupdate").empty();
                container.append('<option value="">Select an Insurance</option>');
                container1.append('<option value="">Select an Insurance</option>');

                if (!data || data.length === 0) {
                    container.append('<option value="">No insurance available</option>');
                    return;
                }
                if (!data || data.length === 0) {
                    container1.append('<option value="">No insurance available</option>');
                    return;
                }

                data.forEach(ins => {
                    const id = ins.id || ins.insuranceId || ins;
                    const name = ins.provider || ins.providerName || ins;
                    container.append(`<option value="${id}">${name}</option>`);
                });
                data.forEach(insu => {
                    const id = insu.id || insu.insuranceId || insu;
                    const name = insu.provider || insu.providerName || insu;
                    container1.append(`<option value="${id}">${name}</option>`);
                });
            },
            error: function (xhr) {
                console.error("Error loading insurance names:", xhr.responseText);
                $("#insurancenc").append('<option value="">Error loading data</option>');
                $("#insurancencupdate").append('<option value="">Error loading data</option>');
            }
        });
    }

    //delete cars
    $(document).on("click", ".btn-delete-car", function () {
        const carId = $(this).data("car-id");


        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {

                $.ajax({
                    url: `http://localhost:8080/api/c1/cars/${carId}`,
                    type: "DELETE",
                    success: function () {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: 'Car deleted successfully',
                            confirmButtonText: 'OK'
                        });
                        loadCars(); //
                    },
                    error: function (xhr, status, error) {
                        const errorMessage = xhr.responseText || error || status;
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: 'Error deleting car: ' + errorMessage,
                            confirmButtonText: 'OK'
                        });
                    }
                });
            }
        });
    });


    function closeModal(modalId) {
        $(`#${modalId}`).modal('hide');
    }

    $(".close-modal-btn").click(function () {
        closeModal("CarModal");
    });



});


//Active Tab

function switchTab(tabId) {

    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));

    const activeTab = document.querySelector(`.tab[onclick="switchTab('${tabId}')"]`);
    if (activeTab) activeTab.classList.add('active');

    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    const activeContent = document.getElementById(tabId);
    if (activeContent) activeContent.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    switchTab('cars');
});

