$(document).ready(function () {
    loadVans();
    let selectVanId = null;

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
                                     style="width: 70px; cursor: pointer;">
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
        console.log("Form submitted");

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

        let imageFile = $('#imagev')[0].files[0];
        if (!imageFile) {
            alert("Please select an image!");
            return;
        }
        van.append('image', imageFile);

        for (let pair of van.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        if (!$("#vanId").val() || !$("#registrationNumberv").val() || !$("#modelv").val() ||
            !$("#plateNumberv").val() || !$("#yearv").val() || !$("#capacityv").val() ||
            !$("#airConditioningv").val() || !$("#wifiv").val() || !$("#statusv").val() ||
            !$('#imagev')[0].files[0]) {
            alert("Please fill in all fields!");
            return;
        }

        $.ajax({
            url: "http://localhost:8080/api/v1/Vans",
            type: "POST",
            data: van,
            contentType: false,
            processData: false,
            success: function (response) {
                console.log(response);
                alert("Van added successfully");
                loadVans();
                $("#vanForm")[0].reset();
                closeModal('VanModal');  // Ensure this matches your modal's actual ID
            },
            error: function (xhr, status, error) {
                console.error("Error details:", xhr, status, error);
                console.error("Response:", xhr.responseText);
                alert("Error adding van: " + (xhr.responseText || error || status));
            }
        });
    });

    window.closeModal = function (modalId) {
        $("#" + modalId).hide();
    };

    window.showAddNewBusModal = function (){
        document.getElementById('UpdateVanForm').style.display = 'block';
    };

    $(document).on("click" , ".btn-update", function (){

        const vanId = $(this).data("van-id");
        console.log("Clicked Update Button - van ID" , vanId);
        if (vanId){
            load
        }
    })

    function loadVanDataIntoUpdateForm(vanId) {
        console.log("Fetching data for Bus ID:", busId);

        $.ajax({
            url: `http://localhost:8080/api/v1/Buses/${busId}`,
            type: "GET",
            success: function (busData) {
                console.log("Fetched Bus Data:", busData);

                if (!busData) {
                    alert("Bus data not found for ID: " + busId);
                    return;
                }

                // Store busId in a hidden field for update operation
                $("#busIdUpdate").val(busId);
                $("#registrationNumberUpdate").val(busData.registrationNumber);
                $("#modelUpdate").val(busData.model);
                $("#plateNumberUpdate").val(busData.plateNumber);
                $("#yearUpdate").val(busData.year);
                $("#capacityUpdate").val(busData.capacity);

                // Correct way to handle checkboxes
                $("#airConditioningUpdate").val(busData.airConditioning);
                $("#wifiUpdate").val(busData.wifi);

                // If 'statusUpdate' is a dropdown, set value
                $("#statusUpdate").val(busData.status);

                // Show the update modal
                $("#UpdateBusModel").show();

                console.log("Form populated successfully.");
            },
            error: function (xhr, status, error) {
                alert("Error loading bus details: " + (xhr.responseText || error || status));
            }
        });
    }

});
