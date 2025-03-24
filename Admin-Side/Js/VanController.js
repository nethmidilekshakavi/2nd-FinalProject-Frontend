$(document).ready(function () {
    loadVans();
    loadInsuranceNames()

    //get All vans
    function loadVans() {
        $.ajax({
            url: "http://localhost:8080/api/v1/Vans",
            type: "GET",
            success: function (data) {
                const container = $("#vanCardContainer").empty();

                if (data.length === 0) {
                    container.append(`<p>No vans available.</p>`);
                    return;
                }

                data.forEach(car => {
                    const carCard = createVanCard(car);
                    container.append(carCard);
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
                        <button class="btn btn-update" data-van-id="${van.carId}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-delete" data-van-id="${van.carId}"><i class="fas fa-trash"></i></button>
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
            success: function (data) {
                const container = $("#insurancenv").empty();
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
                $("#insurancenv").append('<option value="">Error loading data</option>');
                $("#insurancencupdate").append('<option value="">Error loading data</option>');
            }
        });
    }


});
