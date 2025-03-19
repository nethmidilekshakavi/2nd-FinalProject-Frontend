$(document).ready(function () {
    loadVans();

    function loadVans() {
        $.ajax({
            url: "http://localhost:8080/api/v1/Vans",
            type: "GET",
            success: function (data) {
                let tbody = $("#VanTableBody").empty();
                data.forEach(van => {
                    tbody.append(`
                        <tr>
                            <td>${van.vanId}</td>
                            <td>${van.registrationNumber}</td>
                            <td>${van.model}</td>
                            <td>${van.plateNumber}</td>
                            <td>${van.capacity}</td>
                            <td>${van.airConditioning}</td>
                            <td>${van.wifi}</td>
                            <td>
                                <span class="badge ${van.status === 'AVAILABLE' ? 'badge-success' :
                        van.status === 'NOT_AVAILABLE' ? 'badge-warning' :
                            van.status === 'UNDER_MAINTENANCE' ? 'badge-primary' :
                                'badge-danger'}">
                                    ${van.status}
                                </span>
                            </td>
                            <td>
                                <img src="data:image/jpeg;base64,${van.image}" alt="Van Image" class="crop-image"
                                     style="width: 50px; cursor: pointer;">
                            </td>
                             <td>
                                <button class="btn btn-update" data-van-id="${van.vanId}">Update</button>
                                <button class="btn btn-delete" data-van-id="${van.vanId}">Delete</button>
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

        // Append JSON stringified busData
        van.append("vanData", JSON.stringify(van));

        // Append image file
        const imageFile = $('#imagev')[0].files[0];
        if (!imageFile) {
            alert("Please select an image!");
            return;
        }
        van.append("image", imageFile);

        // Debug FormData
        for (let pair of van.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        if (!$("#vanId").val() || !$("#registrationNumberv").val() || !$("#modelv").val() ||
            !$("#plateNumberv").val() || !$("#yearv").val() || !$("#capacityv").val() ||
            !$("#airConditioningv").val() || !$("#wifiv").val() || !$("#statusv").val()) {
            alert("Please fill in all fields!");
            return;
        }

        $.ajax({
            url: "http://localhost:8080/api/v1/Vans",
            type: "POST",
            data: van,
            contentType: false,
            processData: false,
            success: function () {
                alert("Van added successfully");
                loadVans();
                $("#vanForm")[0].reset();
                closeModal('VanMode');
            },
            error: function (xhr, status, error) {
                alert("Error adding van: " + (xhr.responseText || error || status));
            }
        });
    });

    window.closeModal = function (modalId) {
        document.getElementById(modalId).style.display = 'none';
    };

    // Helper function to show modal
    window.showUpdateVanModel = function() {
        document.getElementById('UpdateVanModel').style.display = 'block';
    };

    $(document).on("click", ".btn-update", function () {
        const vanId = $(this).data("van-id");
        console.log("Clicked Update Button - Van ID:", vanId);
        if (vanId) {
            loadVanDataIntoUpdateForm(vanId);
        }
    });

    function loadVanDataIntoUpdateForm(vanId) {
        $.ajax({
            url: `http://localhost:8080/api/v1/Vans/${vanId}`,
            type: "GET",
            success: function (vanData) {
                if (!vanData) {
                    alert("Van data not found for ID: " + vanId);
                    return;
                }

                $("#vanIdUpdate").val(vanId);
                $("#registrationNumberUpdatev").val(vanData.registrationNumber);
                $("#modelUpdatev").val(vanData.model);
                $("#plateNumberUpdatev").val(vanData.plateNumber);
                $("#yearUpdatev").val(vanData.year);
                $("#capacityUpdatev").val(vanData.capacity);
                $("#airConditioningUpdatev").val(vanData.airConditioning);
                $("#wifiUpdatev").val(vanData.wifi);
                $("#statusUpdatev").val(vanData.status);

                $("#UpdateVanModel").show();
            },
            error: function (xhr, status, error) {
                alert("Error loading van details: " + (xhr.responseText || error || status));
            }
        });
    }

    $("#UpdateVanForm").submit(function(event) {
        event.preventDefault();

        const vanId = $("#vanIdUpdate").val();
        console.log(vanId)
        if (!vanId) {
            alert("Van ID is missing");
            return;
        }

        const van = new FormData();
        van.append('air', $("#airConditioningUpdatev").val());
        van.append('capacity', $("#capacityUpdatev").val());
        van.append('model', $("#modelUpdatev").val());
        van.append('plateNumber', $("#plateNumberUpdatev").val());
        van.append('registration', $("#registrationNumberUpdatev").val());
        van.append('status', $("#statusUpdatev").val());
        van.append('wifi', $("#wifiUpdatev").val());
        van.append('year', $("#yearUpdatev").val());

        let imageFile = $('#imageUpdatev')[0].files[0];
        if (imageFile) {
            van.append('image', imageFile);
        }

        $.ajax({
            url: `http://localhost:8080/api/v1/Vans/${vanId}`,
            type: "PUT",
            data: van,
            contentType: false,
            processData: false,
            success: function () {
                alert("Van updated successfully");
                loadVans();
                $("#UpdateVanForm")[0].reset();
                closeModal('UpdateVanModel');
            },
            error: function (xhr, status, error) {
                alert("Error updating van: " + (xhr.responseText || error || status));
            }
        });
    });

    $(document).on("click", ".btn-delete", function () {
        const vanId = $(this).attr("van-id");
        if (confirm("Are you sure you want to delete this van?")) {
            deleteVan(vanId);
        }
    });

    function deleteVan(vanId) {
        $.ajax({
            url: `http://localhost:8080/api/v1/Vans/${vanId}`,
            type: "DELETE",
            success: function () {
                alert("Van deleted successfully!");
                loadVans();
            },
            error: function (xhr, status, error) {
                alert("Error deleting van: " + (xhr.responseText || error || status));
            }
        });
    }
});
