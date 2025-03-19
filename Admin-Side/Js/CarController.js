
$(document).ready(function () {

    loadCars()

    function loadCars() {
        $.ajax({
            url: "http://localhost:8080/api/c1/cars",
            type: "GET",
            success: function (data) {
                let tbody = $("#CarTableBody").empty();
                data.forEach(car => {
                    tbody.append(`
                        <tr>
                            <td>${car.carId}</td>
                            <td>${car.registrationNumber}</td>
                            <td>${car.model}</td>
                            <td>${car.plateNumber}</td>
                            <td>${car.capacity}</td>
                            <td>${car.airConditioning}</td>
                            <td>${car.wifi}</td>
                            <td>
                                <span class="badge ${car.status === 'AVAILABLE' ? 'badge-success' :
                        car.status === 'NOT_AVAILABLE' ? 'badge-warning' :
                            car.status === 'UNDER_MAINTENANCE' ? 'badge-primary' :
                                'badge-danger'}">
                                    ${car.status}
                                </span>
                            </td>
                            <td>
                                <img src="data:image/jpeg;base64,${car.image}" alt="Van Image" class="crop-image"
                                     style="width: 50px; cursor: pointer;">
                            </td>
                             <td>
                                <button class="btn btn-update" data-car-id="${car.carId}">Update</button>
                                <button class="btn btn-delete" data-car-id="${car.carId}">Delete</button>

                            </td>
                        </tr>
                    `);
                });
            },
            error: function () {
                alert("Error loading vans!");
            }
        });

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


        car.append("carData", JSON.stringify(car));

        // Append image file
        const imageFile = $('#imagec')[0].files[0];
        if (!imageFile) {
            alert("Please select an image!");
            return;
        }
        car.append("image", imageFile);

        // Debug FormData
        for (let pair of car.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        if (!$("#carId").val() || !$("#registrationNumberc").val() || !$("#modelc").val() ||
            !$("#plateNumberc").val() || !$("#yearc").val() || !$("#capacityc").val() ||
            !$("#airConditioningc").val() || !$("#wifc").val() || !$("#statusc").val()) {
            alert("Please fill in all fields!");
            return;
        }

        $.ajax({
            url: "http://localhost:8080/api/c1/cars",
            type: "POST",
            data: car,
            contentType: false,
            processData: false,
            success: function () {
                alert("Car added successfully");
                loadCars();
                $("#carForm")[0].reset();
                closeModal('CarMode');
            },
            error: function (xhr, status, error) {
                alert("Error adding van: " + (xhr.responseText || error || status));
            }
        });
    });

    window.closeModal = function (modalId) {
        document.getElementById(modalId).style.display = 'none';
    };

    $(document).on("click", ".btn-update", function () {
        const carId = $(this).data("car-id");
        if (carId) {
            loadVanDataIntoUpdateForm(carId);
        }
    });

    function loadVanDataIntoUpdateForm(carId) {
        $.ajax({
            url: `http://localhost:8080/api/c1/cars/${carId}`,
            type: "GET",
            success: function (carData) {
                if (!carData) {
                    alert("Car data not found for ID: " + carId);
                    return;
                }

                $("#carIdUpdate").val(carId);
                $("#registrationNumberUpdatec").val(carData.registrationNumber);
                $("#modelUpdatec").val(carData.model);
                $("#plateNumberUpdatec").val(carData.plateNumber);
                $("#yearUpdatec").val(carData.year);
                $("#capacityUpdatec").val(carData.capacity);
                $("#airConditioningUpdatec").val(carData.airConditioning);
                $("#wifiUpdatec").val(carData.wifi);
                $("#statusUpdatec").val(carData.status);

                $("#UpdateCarModel").show();
            },
            error: function (xhr, status, error) {
                alert("Error loading car details: " + (xhr.responseText || error || status));
            }
        });
    }


    $("#UpdateCarModel").submit(function(event) {
        event.preventDefault();

        const carId = $("#carIdUpdate").val();
        if (!carId) {
            alert("Van ID is missing");
            return;
        }

        const car = new FormData();
        car.append('air', $("#airConditioningUpdatec").val());
        car.append('capacity', $("#capacityUpdatec").val());
        car.append('model', $("#modelUpdatec").val());
        car.append('plateNumber', $("#plateNumberUpdatec").val());
        car.append('registration', $("#registrationNumberUpdatec").val());
        car.append('status', $("#statusUpdatec").val());
        car.append('wifi', $("#wifiUpdatec").val());
        car.append('year', $("#yearUpdatec").val());

        let imageFile = $('#imageUpdatec')[0].files[0];
        if (imageFile) {
            car.append('image', imageFile);
        }

        $.ajax({
            url: `http://localhost:8080/api/c1/cars/${carId}`,
            type: "PUT",
            data: car,
            contentType: false,
            processData: false,
            success: function () {
                alert("Car updated successfully");
                loadCars();
                $("#UpdateCarForm")[0].reset();
                closeModal('UpdateCarModel');
            },
            error: function (xhr, status, error) {
                alert("Error updating car: " + (xhr.responseText || error || status));
            }
        });
    });

    $(document).on("click", ".btn-delete", function () {
        const carId = $(this).data("car-id"); // Retrieve car ID

        if (!carId) {
            alert("Car ID not found!");
            return;
        }

        if (confirm("Are you sure you want to delete this car?")) {
            deleteCar(carId);
        }
    });

    function deleteCar(carId) {
        $.ajax({
            url: `http://localhost:8080/api/c1/cars/${carId}`,
            type: "DELETE",
            success: function () {
                alert("Car deleted successfully!");
                loadCars(); // Refresh the table after deletion
            },
            error: function (xhr, status, error) {
                const errorMessage = xhr.responseText || error || status;
                alert(`Error deleting car: ${errorMessage}`);
            }
        });
    }


})