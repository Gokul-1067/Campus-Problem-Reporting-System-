// JavaScript for Campus Problem Reporting System

// ==========================================
// 1. DYNAMIC GREETING LOGIC (For index.html)
// ==========================================
var greetingElement = document.getElementById("dynamic-greeting");

// Check if dynamic-greeting exists on the current page
if (greetingElement) {
    var currentTime = new Date();
    var currentHour = currentTime.getHours();

    if (currentHour < 12) {
        greetingElement.innerText = "Good Morning, Welcome to UniCare!";
    } else if (currentHour < 18) {
        greetingElement.innerText = "Good Afternoon, Welcome to UniCare!";
    } else {
        greetingElement.innerText = "Good Evening, Welcome to UniCare!";
    }
}

// ==========================================
// 2. REPORT FORM & LOCAL STORAGE (For report.html)
// ==========================================
var reportForm = document.getElementById("report-form");
var issueList = document.getElementById("issue-list");

// Function to display reported issues from localStorage
function displayIssues() {
    if (!issueList) return;

    var storedIssues = localStorage.getItem("campusIssues");
    var issues = storedIssues ? JSON.parse(storedIssues) : [];

    issueList.innerHTML = "";

    if (issues.length === 0) {
        issueList.innerHTML = "<p class='no-issues'>No issues reported yet. Be the first to report one!</p>";
        return;
    }

    for (var i = 0; i < issues.length; i++) {
        var issue = issues[i];

        var card = document.createElement("div");
        card.className = "issue-card";

        // Optional image HTML if a photo was uploaded
        var imageHtml = issue.image 
            ? "<img src='" + issue.image + "' alt='Attached Evidence' class='card-image'>" 
            : "";

        card.innerHTML = 
            "<h3>" + issue.title + "</h3>" +
            "<div class='issue-meta'>" +
                "<span>Category: " + issue.category + "</span>" +
                "<span>Location: " + issue.location + "</span>" +
            "</div>" +
            "<p>" + issue.description + "</p>" +
            imageHtml;

        issueList.appendChild(card);
    }
}

if (issueList) {
    displayIssues();
}

if (reportForm) {
    reportForm.addEventListener("submit", function(event) {
        event.preventDefault();

        var titleInput = document.getElementById("title").value;
        var categoryInput = document.getElementById("category").value;
        var locationInput = document.getElementById("location").value;
        var descriptionInput = document.getElementById("description").value;
        
        var fileInput = document.getElementById("image");
        var selectedFile = fileInput && fileInput.files ? fileInput.files[0] : null;

        // Helper function to save issue and refresh display
        function saveIssue(imageData) {
            var newIssue = {
                title: titleInput,
                category: categoryInput,
                location: locationInput,
                description: descriptionInput,
                image: imageData || ""
            };

            var storedIssues = localStorage.getItem("campusIssues");
            var issues = storedIssues ? JSON.parse(storedIssues) : [];

            issues.unshift(newIssue);
            localStorage.setItem("campusIssues", JSON.stringify(issues));

            displayIssues();
            reportForm.reset();

            alert("Issue submitted successfully!");
        }

        // If user attached a file, read it as Data URL (base64)
        if (selectedFile) {
            var reader = new FileReader();
            reader.onload = function(e) {
                saveIssue(e.target.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            saveIssue("");
        }
    });
}

// ==========================================
// 3. LOST & FOUND LOGIC (For lost-found.html)
// ==========================================
var lostFoundForm = document.getElementById("lost-found-form");
var lostFoundList = document.getElementById("lost-found-list");

// Function to display lost and found items from localStorage
function displayLostFoundItems() {
    if (!lostFoundList) return;

    var storedItems = localStorage.getItem("lostAndFoundItems");
    var items = storedItems ? JSON.parse(storedItems) : [];

    lostFoundList.innerHTML = "";

    if (items.length === 0) {
        lostFoundList.innerHTML = "<p class='no-issues'>No lost or found items posted yet.</p>";
        return;
    }

    for (var i = 0; i < items.length; i++) {
        var item = items[i];

        var card = document.createElement("div");
        card.className = "issue-card";

        var badgeClass = item.status === "Lost" ? "badge-lost" : "badge-found";

        // Optional image HTML if an item photo was uploaded
        var imageHtml = item.image 
            ? "<img src='" + item.image + "' alt='Item Photo' class='card-image'>" 
            : "";

        card.innerHTML = 
            "<div style='display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;'>" +
                "<h3>" + item.name + "</h3>" +
                "<span class='" + badgeClass + "'>" + item.status + "</span>" +
            "</div>" +
            "<div class='issue-meta'>" +
                "<span>Location: " + item.location + "</span>" +
            "</div>" +
            "<p>" + item.description + "</p>" +
            imageHtml;

        lostFoundList.appendChild(card);
    }
}

if (lostFoundList) {
    displayLostFoundItems();
}

if (lostFoundForm) {
    lostFoundForm.addEventListener("submit", function(event) {
        event.preventDefault();

        var statusInput = document.getElementById("itemStatus").value;
        var nameInput = document.getElementById("itemName").value;
        var locationInput = document.getElementById("itemLocation").value;
        var descriptionInput = document.getElementById("itemDescription").value;

        var fileInput = document.getElementById("itemImage");
        var selectedFile = fileInput && fileInput.files ? fileInput.files[0] : null;

        // Helper function to save item and refresh display
        function saveItem(imageData) {
            var newItem = {
                status: statusInput,
                name: nameInput,
                location: locationInput,
                description: descriptionInput,
                image: imageData || ""
            };

            var storedItems = localStorage.getItem("lostAndFoundItems");
            var items = storedItems ? JSON.parse(storedItems) : [];

            items.unshift(newItem);
            localStorage.setItem("lostAndFoundItems", JSON.stringify(items));

            displayLostFoundItems();
            lostFoundForm.reset();

            alert("Item posted to Lost & Found directory successfully!");
        }

        // If user attached a file, read it as Data URL (base64)
        if (selectedFile) {
            var reader = new FileReader();
            reader.onload = function(e) {
                saveItem(e.target.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            saveItem("");
        }
    });
}
