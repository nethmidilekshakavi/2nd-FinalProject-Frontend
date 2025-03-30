$(document).ready(function () {

    loadBuses();
    loadInsuranceNames()

    function loadBuses() {
        $.ajax({
            url: "http://localhost:8080/api/v1/Buses",
            type: "GET",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            },
            success: function (data) {
                const container = $("#busCardContainer").empty();

                if (data.length === 0) {
                    container.append(`<p>No buses available.</p>`);
                    return;
                }

                data.forEach(car => {
                    const carCard = createBusCard(car);
                    container.append(carCard);
                });
            },
            error: function (xhr, status, error) {
                alert(`Error loading cars: ${xhr.responseText || error || status}`);
            }
        });
    }


    function createBusCard(bus) {
        return `
            <div class="vehicle-card" data-car-id="${bus.busId}">
                <div class="vehicle-image">
                    <img src="data:image/jpeg;base64,${bus.image}" alt="Car Image">
                </div>
                <div class="vehicle-details">
                    <h3>${bus.model}</h3>
                    <div class="status-badge ${getBadgeClass(bus.status)}">${bus.status}</div>
                    <div class="vehicle-info">
                        <p><strong>Registration:</strong> ${bus.registrationNumber}</p>
                        <p><strong>Plate Number:</strong> ${bus.plateNumber}</p>
                        <p><strong>Capacity:</strong> ${bus.capacity} seats</p>
                        <p><strong>AC:</strong> ${bus.airConditioning || "Not Available"}</p>
                        <p><strong>WiFi:</strong> ${bus.wifi || "Not Available"}</p>
                    </div>
                    <div class="card-actions">
                        <button style="color: #0b7dda" class="btn btn-update-bus" data-bus-id="${bus.busId}"><i class="fas fa-edit"></i></button>
                        <button style="color: red" class="btn btn-delete-bus" data-bus-id="${bus.busId}"><i class="fas fa-trash"></i></button>
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

    $("#busForm").submit(function (event) {
        event.preventDefault();

        let bus= new FormData();
        /*bus.append('busId', $("#busId").val());*/
        bus.append('air', $("#airConditioning").val());
        bus.append('capacity', $("#capacity").val());
        bus.append('model', $("#model").val());
        bus.append('plateNumber', $("#plateNumber").val());
        bus.append('registration', $("#registrationNumber").val());
        bus.append('status', $("#status").val());
        bus.append('wifi', $("#wifi").val());
        bus.append('year', $("#year").val());
        bus.append('insuranceName', $("#insurance").val());

        const imageFile = $('#image')[0].files[0];
        if (!imageFile) {
            alert("Please select an image!");
            return;
        }
        bus.append("image", imageFile);

        $.ajax({
            url: "http://localhost:8080/api/v1/Buses",
            type: "POST",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            },
            data: bus,
            contentType: false,
            processData: false,
            success: function () {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Bus added successfully',
                    confirmButtonText: 'OK'
                });
                loadBuses()
                $("#busForm")[0].reset();
                closeModal('BusModel');
            },
            error: function (xhr, status, error) {

                const errorMessage = xhr.responseText || error || status;
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error adding bus: ' + errorMessage,
                    confirmButtonText: 'OK'
                });
            }
        });

    });

    $("#UpdateBusForm").submit(function (event) {
        event.preventDefault();

        let bus = new FormData();
        bus.append('air', $("#airConditioningUpdate").val());
        bus.append('capacity', $("#capacityUpdate").val());
        bus.append('model', $("#modelUpdate").val());
        bus.append('plateNumber', $("#plateNumberUpdate").val());
        bus.append('registration', $("#registrationNumberUpdate").val());
        bus.append('status', $("#statusUpdate").val());
        bus.append('wifi', $("#wifiUpdate").val());
        bus.append('year', $("#yearUpdate").val());
        bus.append('insuranceName', $("#insurancencupdate").val());

        const imageFile = $('#imageUpdate')[0].files[0];
        if (!imageFile) {
            alert("Please select an image!");
            return;
        }
        bus.append("image", imageFile);

        $.ajax({
            url: "http://localhost:8080/api/v1/Buses/" + $("#busIdUpdate").val(),
            type: "PUT",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            },
            data: bus,
            contentType: false,
            processData: false,
            success: function () {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Bus Updated successfully',
                    confirmButtonText: 'OK'
                });
                loadBuses();
                $("#UpdateBusForm")[0].reset();
                closeModal('UpdateBusModel');
            },
            error: function (xhr, status, error) {

                const errorMessage = xhr.responseText || error || status;
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error updating bus: ' + errorMessage,
                    confirmButtonText: 'OK'
                });
            }
        });
    });


    function loadInsuranceNames() {
        $.ajax({
            url: "http://localhost:8080/api/i1/insurance/insuranceNames",
            type: "GET",
            dataType: "json",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            },
            success: function (data) {
                const container = $("#insurance").empty();
                const container1 = $("#insuranceupdateb").empty();
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
                $("#insurance").append('<option value="">Error loading data</option>');
                $("#insuranceupdateb").append('<option value="">Error loading data</option>');
            }
        });
    }


    $(document).on("click", ".btn-update-bus", function (e) {
        e.preventDefault();
        const carId = $(this).data("bus-id");
        console.log("Bus ID:", carId);
        fetchCarDetails(carId);
    });

    function fetchCarDetails(busId) {
        $.ajax({
            url: "http://localhost:8080/api/v1/Buses/" + busId,
            type: "GET",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            },
            success: function (bus) {
                console.log("Bus details fetched:", bus);

                // Populate form fields with fetched data
                $("#busIdUpdate").val(busId);
                $("#airConditioningUpdate").val(bus.airConditioning);
                $("#capacityUpdate").val(bus.capacity);
                $("#modelUpdate").val(bus.model);
                $("#plateNumberUpdate").val(bus.plateNumber);
                $("#registrationNumberUpdate").val(bus.registrationNumber);
                $("#statusUpdate").val(bus.status);
                $("#wifiUpdate").val(bus.wifi);
                $("#yearUpdate").val(bus.year);
                $("#insuranceupdateb").val(bus.insurance ? bus.insurance.provider : '');

                // Display current image (optional)
                if (bus.image) {
                    $("#currentBusImage").attr("src", "data:image/png;base64," + bus.image);
                    $("#currentBusImage").show();
                }

                // Open the modal
                $("#UpdateBusModel").modal("show");
            },
            error: function (xhr, status, error) {
                alert("Error fetching bus details: " + (xhr.responseText || error || status));
            }
        });
    }



    $(document).on("click", ".btn-delete-bus", function () {
        const busId = $(this).data("bus-id");


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
                    url: `http://localhost:8080/api/v1/Buses/${busId}`,
                    type: "DELETE",
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
                    },
                    success: function () {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: 'Bus deleted successfully',
                            confirmButtonText: 'OK'
                        });
                        loadBuses(); //
                        $("#UpdateBusForm")[0].reset();
                        closeModal('UpdateBusModel');
                    },
                    error: function (xhr, status, error) {
                        const errorMessage = xhr.responseText || error || status;
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: 'Error deleting bus: ' + errorMessage,
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
        closeModal("BusModal");
    });


});