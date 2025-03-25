$(document).ready(function () {
    loadVans();
    loadInsuranceNames()

    //get All vans
    function loadVans() {
        $.ajax({
            url: "http://localhost:8080/api/v1/Vans",
            type: "GET",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            },
            success: function (data) {
                const container = $("#vanCardContainer").empty();

                if (data.length === 0) {
                    container.append(`<p>No vans available.</p>`);
                    return;
                }

                data.forEach(car => {
                    const vanCard = createVanCard(car);
                    container.append(vanCard);
                });
            },
            error: function (xhr, status, error) {
                alert(`Error loading van: ${xhr.responseText || error || status}`);
            }
        });
    }

    function createVanCard(van) {
        return `
            <div class="vehicle-card" data-van-id="${van.vanId}">
                <div class="vehicle-image">
                    <img src="data:image/jpeg;base64,${van.image}" alt="Car Image">
                </div>
                <div class="vehicle-details">
                    <h3>${van.model}</h3>
                    <div class="status-badge ${getBadgeClass(van.status)}">${van.status}</div>
                    <div class="vehicle-info">
                        <p><strong>Registration:</strong> ${van.registrationNumber}</p>
                        <p><strong>Plate Number:</strong> ${van.plateNumber}</p>
                        <p><strong>Capacity:</strong> ${van.capacity} seats</p>
                        <p><strong>AC:</strong> ${van.airConditioning || "Not Available"}</p>
                        <p><strong>WiFi:</strong> ${van.wifi || "Not Available"}</p>
                    </div>
                    <div class="card-actions">
                        <button style="color: #0b7dda" class="btn btn-update-van" data-van-id="${van.vanId}"><i class="fas fa-edit"></i></button>
                        <button style="color: red" class="btn btn-delete-van" data-van-id="${van.vanId}"><i class="fas fa-trash"></i></button>
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


    $("#vanForm").submit(function (event) {
        event.preventDefault();

        let van = new FormData();
        van.append('vanId', $("#vanId").val());
        van.append('air', $("#airConditioningv").val());
        van.append('capacity', $("#capacityv").val());
        van.append('model', $("#modelv").val());
        van.append('plateNumber', $("#plateNumberv").val());
        van.append('registration', $("#registrationNumberv").val());
        van.append('status', $("#statusv").val());
        van.append('wifi', $("#wifiv").val());
        van.append('year', $("#yearv").val());
        van.append('insuranceName', $("#insurancenv").val());

        const imageFile = $('#imagev')[0].files[0];
        if (!imageFile) {
            alert("Please select an image!");
            return;
        }
        van.append("image", imageFile);

        $.ajax({
            url: "http://localhost:8080/api/v1/Vans",
            type: "POST",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            },
            data: van,
            contentType: false,
            processData: false,
            success: function (newVan) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Van added successfully',
                    confirmButtonText: 'OK'
                });
                loadVans();
                $("#vanForm")[0].reset();
                closeModal('VanMode');
            },
            error: function (xhr, status, error) {
                const errorMessage = xhr.responseText || error || status;
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error adding van: ' + errorMessage,
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
                const container = $("#insurancenv").empty();
                const container1 = $("#insurancencupdatev").empty();
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
                $("#insurancenv").append('<option value="">Error loading data</option>');
                $("#insurancencupdatev").append('<option value="">Error loading data</option>');
            }
        });
    }

    $("#UpdateVanModel").submit(function (event) {
        event.preventDefault();

        let van = new FormData();
        van.append('air', $("#airConditioningUpdatev").val());
        van.append('capacity', $("#capacityUpdatev").val());
        van.append('model', $("#modelUpdatev").val());
        van.append('plateNumber', $("#plateNumberUpdatev").val());
        van.append('registration', $("#registrationNumberUpdatev").val());
        van.append('status', $("#statusUpdatev").val());
        van.append('wifi', $("#wifiUpdatev").val());
        van.append('year', $("#yearUpdatev").val());
        van.append('insuranceName', $("#insurancencupdatev").val());

        const imageFile = $('#imageUpdatev')[0].files[0];
        if (!imageFile) {
            alert("Please select an image!");
            return;
        }
        van.append("image", imageFile);

        $.ajax({
            url: "http://localhost:8080/api/v1/Vans/" + $("#vanIdUpdate").val(),
            type: "PUT",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            },
            data: van,
            contentType: false,
            processData: false,
            success: function () {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Van updated successfully',
                    confirmButtonText: 'OK'
                });
                loadVans();
                $("#UpdateVanForm")[0].reset();
                closeModal('UpdateVanModel');
            },
            error: function (xhr, status, error) {
                const errorMessage = xhr.responseText || error || status;
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error updating van: ' + errorMessage,
                    confirmButtonText: 'OK'
                });
            }
        });
    });

// For vans
    $(document).on("click", ".btn-update-van", function (e) {
        e.preventDefault();
        const vanId = $(this).data("van-id");
        console.log("Van ID:", vanId);
        fetchVanDetails(vanId);
    });

    //getAll Vans
    function fetchVanDetails(vanId) {
        $.ajax({
            url: "http://localhost:8080/api/v1/Vans/" + vanId,
            type: "GET",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            },
            success: function (van) {
                console.log("van details fetched:", van);

                // Populate form fields with fetched data
                $("#vanIdUpdate").val(van.vanId);
                $("#airConditioningUpdatev").val(van.airConditioning);
                $("#capacityUpdatev").val(van.capacity);
                $("#modelUpdatev").val(van.model);
                $("#plateNumberUpdatev").val(van.plateNumber);
                $("#registrationNumberUpdatev").val(van.registrationNumber);
                $("#statusUpdatev").val(van.status);
                $("#wifiUpdatev").val(van.wifi);
                $("#yearUpdatev").val(van.year);
                $("#insurancencupdatev").val(van.insurance ? van.insurance.provider : '');

                // Display current image (optional)
                if (van.image) {
                    $("#currentvanImage").attr("src", "data:image/png;base64," + van.image);
                    $("#currentvanImage").show();
                }


                $("#UpdateVanModel").modal("show");
            },
            error: function (xhr, status, error) {
                alert("Error fetching van details: " + (xhr.responseText || error || status));
            }
        });
    }


    //delete vans
    $(document).on("click", ".btn-delete-van", function () {
        const vanId = $(this).data("van-id");


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
                    url: `http://localhost:8080/api/v1/Vans/${vanId}`,
                    type: "DELETE",
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
                    },
                    success: function () {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: 'Van deleted successfully',
                            confirmButtonText: 'OK'
                        });
                        loadVans(); //
                    },
                    error: function (xhr, status, error) {
                        const errorMessage = xhr.responseText || error || status;
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: 'Error deleting van: ' + errorMessage,
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
        closeModal("VanModel");
    });


});
