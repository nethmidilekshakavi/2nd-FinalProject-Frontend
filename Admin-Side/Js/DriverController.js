$(document).ready(function () {
    loadDrivers();

    function loadDrivers() {
        $.ajax({
            url: "http://localhost:8080/api/d1/drivers",
            type: "GET",
            success: function (data) {
                console.log(data);
                let tbody = $("#DriversTableBody").empty();
                data.forEach(driver => {
                    tbody.append(`
                        <tr>
                            <td>${driver.id}</td>
                            <td>${driver.name}</td>
                            <td>${driver.licenseNumber}</td>
                            <td class="phone">${driver.phoneNumber}</td>
                            <td>${driver.licenseExpiry}</td>
                            <td style="font-weight: bold;">${driver.vehicleType}</td>
                            <td>${driver.isAvailable ? "✅ Available" : "❌ Not Available"}</td>
                            <td>
                                <img src="data:image/jpeg;base64,${driver.image}" 
                                    alt="Driver Image" class="crop-image" 
                                    style="width: 50px; height: 50px; border-radius: 50%; cursor: pointer;">
                            </td>
                            <td>
                                <button style="color: #ffa500" class="btn btn-update-driver" data-driver-id="${driver.id}"><i class="fas fa-edit"></i></button>
                                <button style="color: red" class="btn btn-delete-driver" data-driver-id="${driver.id}"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    `);
                });
            },
            error: function (xhr, status, error) {
                console.error("Error loading drivers:", xhr.responseText || error || status);
                alert("Error loading drivers!");
            }
        });
    }

    $("#driverForm").submit(function (e) {
        e.preventDefault();

        let drivers = new FormData();
        drivers.append('id', $("#id").val());
        drivers.append('name', $("#name").val());
        drivers.append('licenseNumber', $("#licenseNumber").val());
        drivers.append('phoneNumber', $("#phoneNumber").val());
        drivers.append('licenseExpiry', $("#licenseExpiry").val());
        drivers.append('type', $("#vehicleType").val());
        drivers.append('available', $("#isAvailable").val());

        const imageFile = $("#imagedriver")[0].files[0];
        if (!imageFile) {
            alert("Please select an image!");
            return;
        }
        drivers.append("image", imageFile);

        $.ajax({
            url: "http://localhost:8080/api/d1/drivers",
            type: "POST",
            data: drivers,
            contentType: false,
            processData: false,
            success: function () {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Driver added successfully',
                    confirmButtonText: 'OK'
                }).then(() => {
                    loadDrivers();
                    $("#driverForm")[0].reset();
                    closeModal('addDriverForm');
                });
            },
            error: function (xhr, status, error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error adding driver: ' + (xhr.responseText || error || status),
                    confirmButtonText: 'OK'
                });
            }
        });
    });

    $("#UpdateDriverModel").submit(function (e) {
        e.preventDefault();

        const driverId = $("#updateid").val();
        if (!driverId) {
            alert("Driver ID is missing!");
            return;
        }

        let driverUpdate = new FormData();
        driverUpdate.append('name', $("#updatename").val());
        driverUpdate.append('licenseNumber', $("#updatelicenseNumber").val());
        driverUpdate.append('phoneNumber', $("#updatephoneNumber").val());
        driverUpdate.append('licenseExpiry', $("#updatelicenseExpiry").val());
        driverUpdate.append('type', $("#updatevehicleType").val());
        driverUpdate.append('available', $("#updateisAvailable").val());

        let imageFile = $('#updateimagedriver')[0].files[0];
        if (imageFile) {
            driverUpdate.append('image', imageFile);
        }

        $.ajax({
            url: `http://localhost:8080/api/d1/drivers/${driverId}`,
            type: "PUT",
            data: driverUpdate,
            contentType: false,
            processData: false,
            success: function () {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Driver added successfully',
                    confirmButtonText: 'OK'
                }).then(() => {
                    loadDrivers();
                    $("#driverFormUpdate")[0].reset();
                    closeModal('UpdateDriverModel');
                });
            },
            error: function (xhr, status, error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error adding driver: ' + (xhr.responseText || error || status),
                    confirmButtonText: 'OK'
                });
            }
        });
    });

    $(document).on("click", ".btn-update-driver", function (e) {
        e.preventDefault();
        const driverId = $(this).data("driver-id");
        fetchDriverDetails(driverId);
    });

    function fetchDriverDetails(driverId) {
        $.ajax({
            url: "http://localhost:8080/api/d1/drivers/" + driverId,
            type: "GET",
            success: function (driver) {
                $("#updateid").val(driver.id);
                $("#updatename").val(driver.name);
                $("#updatelicenseNumber").val(driver.licenseNumber);
                $("#updatephoneNumber").val(driver.phoneNumber);
                $("#updatevehicleType").val(driver.vehicleType);
                $("#updateisAvailable").val(driver.isAvailable);
                $("#updatelicenseExpiry").val(driver.licenseExpiry);

                if (driver.image) {
                    $("#currentDriverImage").attr("src", "data:image/png;base64," + driver.image);
                    $("#currentDriverImage").show();
                }

                $("#UpdateDriverModel").modal("show");
            },
            error: function (xhr, status, error) {
                alert("Error fetching driver details: " + (xhr.responseText || error || status));
            }
        });
    }
});
