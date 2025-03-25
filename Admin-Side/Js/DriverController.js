$(document).ready(function () {
    loadDrivers();

    function loadDrivers() {
        $.ajax({
            url: "http://localhost:8080/api/d1/drivers",
            type: "GET",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            },
            success: function (data) {
                console.log(data);
                let tbody = $("#DriversTableBody").empty();
                data.forEach(driver => {
                    tbody.append(`
                        <tr>
                            <td  style="text-align: center;">${driver.id}</td>
                            <td  style="text-align: center;">${driver.name}</td>
                            <td  style="text-align: center;">${driver.licenseNumber}</td>
                            <td style="text-align: center;" class="phone">${driver.phoneNumber}</td>
                            <td style="text-align: center;">${driver.licenseExpiry}</td>
                            <td style="text-align: center;" style="font-weight: bold;">${driver.vehicleType}</td>
                            <td style="text-align: center;">${driver.isAvailable ? "✅ Available" : "❌ Not Available"}</td>
                            <td style="text-align: center;">
                                <img src="data:image/jpeg;base64,${driver.image}" 
                                    alt="Driver Image" class="crop-image" 
                                    style="width: 50px; height: 50px; border-radius: 50%; cursor: pointer;">
                            </td>
                            <td style="text-align: center;">
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
        drivers.append('licenceNumber', $("#licenseNumber").val());
        drivers.append('phoneNumber', $("#phoneNumber").val());
        drivers.append('expiry', $("#licenseExpiry").val());
        drivers.append('vehicleType', $("#vehicleType").val());
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
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            },
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

        let driverUpdate = new FormData();
        driverUpdate.append('name', $("#updatename").val());
        driverUpdate.append('licenceNumber', $("#updatelicenseNumber").val());
        driverUpdate.append('phoneNumber', $("#updatephoneNumber").val());
        driverUpdate.append('expiry', $("#updatelicenseExpiry").val());
        driverUpdate.append('vehicleType', $("#updatevehicleType").val());
        driverUpdate.append('available', $("#updateisAvailable").val());


        let imageFile = $('#updateimagedriver')[0].files[0];
        if (imageFile) {
            driverUpdate.append('image', imageFile);
        }

        $.ajax({
            url: "http://localhost:8080/api/d1/drivers/" + $("#updateid").val(),
            type: "PUT",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            },
            data: driverUpdate,
            contentType: false,
            processData: false,
            success: function () {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Driver updated successfully', // Updated the text for accuracy
                    confirmButtonText: 'OK'
                }).then(() => {
                    loadDrivers(); // Reload the drivers list
                    $("#driverFormUpdate")[0].reset(); // Reset the form
                    closeModal('UpdateDriverModel'); // Close the modal
                });
            },
            error: function (xhr, status, error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error updating driver: ' + (xhr.responseText || error || status), // Made the message more specific
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
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            },
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

    $(document).on("click", ".btn-delete-driver", function () {
        const driverId = $(this).data("driver-id");


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
                    url: `http://localhost:8080/api/d1/drivers/${driverId}`,
                    type: "DELETE",
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
                    },
                    success: function () {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: 'Driver deleted successfully',
                            confirmButtonText: 'OK'
                        });
                        loadDrivers(); //
                    },
                    error: function (xhr, status, error) {
                        const errorMessage = xhr.responseText || error || status;
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: 'Error deleting driver: ' + errorMessage,
                            confirmButtonText: 'OK'
                        });
                    }
                });
            }
        });
    });
});
