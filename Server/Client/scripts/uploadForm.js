// Event listener for "View Uploaded Files" button
document.getElementById("viewFilesBtn").addEventListener("click", function() {
    // Clear any previous file list
    const fileListContainer = document.getElementById("uploadedFilesList");
    fileListContainer.innerHTML = "";  // Clear existing list

    // Fetch the list of uploaded files from the server
    fetch("/files")
        .then(response => response.json())
        .then(files => {
            // If there are files, create a list of clickable links
            if (files.length > 0) {
                files.forEach(file => {
                    const fileLink = document.createElement("a");
                    fileLink.href = `/uploads/${file}`;  // URL for the file (must match the server route)
                    fileLink.innerText = file;           // Name of the file
                    fileLink.target = "_blank";          // Open file in a new tab
                    fileLink.classList.add("d-block", "mt-2");

                    // Append the link to the list
                    fileListContainer.appendChild(fileLink);
                });
            } else {
                fileListContainer.innerText = "No files uploaded.";
            }
        })
        .catch(error => {
            console.error("Error fetching uploaded files:", error);
            document.getElementById("uploadStatus").innerText = "Error fetching uploaded files.";
        });
});

// Event listener for form submission (file upload)
document.getElementById("uploadForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData();
    const fileInput = document.getElementById("file");

    // Check if a file is selected
    if (fileInput.files.length > 0) {
        formData.append("file", fileInput.files[0]); // Append the selected file to the form data

        // Show progress indicator (if needed)
        // document.getElementById("uploadStatus").innerText = "Uploading...";

        // Send the form data to the server using fetch
        fetch("/upload", {  // Use a relative URL when front-end and back-end are served on the same port
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // On success, update UI
            if (data.message) {
                document.getElementById("uploadStatus").innerText = "File uploaded successfully!";
            }
            console.log("File uploaded:", data);
        })
        .catch(error => {
            // Handle any errors during the upload
            document.getElementById("uploadStatus").innerText = "Error uploading file.";
            console.error("Error uploading file:", error);
        });
    } else {
        alert("Please select a file to upload.");
    }
});
