// Dynamic greeting on Home Page (index.html)
var greeting = document.getElementById("dynamic-greeting");
if (greeting) {
    var hour = new Date().getHours();
    if (hour < 12) {
        greeting.innerText = "Good Morning, Welcome to UniCare!";
    } else if (hour < 18) {
        greeting.innerText = "Good Afternoon, Welcome to UniCare!";
    } else {
        greeting.innerText = "Good Evening, Welcome to UniCare!";
    }
}

// Storage helper functions
function loadData(key) {
    return JSON.parse(localStorage.getItem(key) || "[]");
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// File reader helper for image uploads
function readFile(fileInput, callback) {
    if (fileInput && fileInput.files && fileInput.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) { callback(e.target.result); };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        callback("");
    }
}

// Default campus issues (shown on recent fixes page)
var defaultIssues = [
    { title: "Ceiling fan regulator damaged in Hostel Room 204", category: "Hostel & Mess", location: "Boys Hostel (Block 2, Room 204)", date: "Nov 18", status: "Pending", description: "The fan speed regulator knob is stuck and sparks intermittently.", image: "", isMyQuery: false },
    { title: "Wi-Fi access point router replacement", category: "IT & Wi-Fi", location: "Library Ground Floor", date: "Nov 16", status: "In Progress", description: "Frequent disconnection in study cubicles. IT technician dispatched.", image: "", isMyQuery: false },
    { title: "Classroom 304 projector lamp replacement", category: "Academics", location: "Main Academic Block, Room 304", date: "Nov 15", status: "In Progress", description: "Projector lamp burned out during morning lecture. New parts ordered.", image: "", isMyQuery: false },
    { title: "Replaced broken projector HDMI cable in Block 34", category: "Academics", location: "Block 34, Room 201", date: "Nov 10", status: "Resolved", description: "The damaged HDMI cable was swapped out and tested with faculty laptops.", image: "", isMyQuery: false },
    { title: "Repaired broken desk benches in Main Block", category: "Infrastructure", location: "Main Block, Room 102", date: "Nov 08", status: "Resolved", description: "Carpentry team fixed loose screws and reinforced two wooden benches.", image: "", isMyQuery: false }
];

// ==========================================
// 1. Report Form Logic (report.html)
// ==========================================
var reportForm = document.getElementById("report-form");
var reportList = document.getElementById("issue-list");

function showReportedIssues() {
    if (!reportList) return;
    var list = loadData("campusIssues");
    reportList.innerHTML = "";

    if (list.length === 0) {
        reportList.innerHTML = "<p class='no-issues'>No issues reported yet. Be the first to report one!</p>";
        return;
    }

    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var imgHtml = item.image ? "<img src='" + item.image + "' class='card-image' alt='Attached Photo'>" : "";

        var card = document.createElement("div");
        card.className = "issue-card";
        card.innerHTML = 
            "<div style='display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;'>" +
                "<h3>" + item.title + "</h3>" +
                "<div><span class='badge-pending'>⏳ " + item.status + "</span>" +
                "<button class='delete-query-btn' onclick='deleteReportedIssue(" + i + ")'>Delete</button></div>" +
            "</div>" +
            "<div class='issue-meta'><span>Category: " + item.category + "</span><span>Location: " + item.location + "</span><span>" + item.date + "</span></div>" +
            "<p>" + item.description + "</p>" + imgHtml;

        reportList.appendChild(card);
    }
}

function deleteReportedIssue(index) {
    if (confirm("Delete this issue?")) {
        var list = loadData("campusIssues");
        list.splice(index, 1);
        saveData("campusIssues", list);
        showReportedIssues();
    }
}

if (reportForm) {
    showReportedIssues();

    reportForm.addEventListener("submit", function(e) {
        e.preventDefault();

        var title = document.getElementById("title").value;
        var category = document.getElementById("category").value;
        var location = document.getElementById("location").value;
        var description = document.getElementById("description").value;
        var fileInput = document.getElementById("image");

        readFile(fileInput, function(imageData) {
            var newIssue = {
                title: title,
                category: category,
                location: location,
                description: description,
                image: imageData,
                status: "Pending",
                date: new Date().toLocaleDateString(),
                isMyQuery: true
            };

            var list = loadData("campusIssues");
            list.unshift(newIssue);
            saveData("campusIssues", list);

            showReportedIssues();
            reportForm.reset();
            alert("Issue submitted successfully!");
        });
    });
}

// ==========================================
// 2. Recent Fixes & Status Logic (resolved.html)
// ==========================================
var fixesList = document.getElementById("fixes-list");
var currentFilter = "all";

function showRecentFixes() {
    if (!fixesList) return;

    var allItems = loadData("campusIssues").concat(defaultIssues);
    var filtered = [];

    for (var i = 0; i < allItems.length; i++) {
        var item = allItems[i];
        if (currentFilter === "all") {
            filtered.push(item);
        } else if (currentFilter === "my-queries" && item.isMyQuery) {
            filtered.push(item);
        } else if (item.status === currentFilter) {
            filtered.push(item);
        }
    }

    fixesList.innerHTML = "";

    if (filtered.length === 0) {
        fixesList.innerHTML = currentFilter === "my-queries" 
            ? "<p class='no-issues'>You have not posted any queries yet. <a href='report.html'>Report an Issue</a>.</p>" 
            : "<p class='no-issues'>No issues found under " + currentFilter + ".</p>";
        return;
    }

    for (var j = 0; j < filtered.length; j++) {
        var fix = filtered[j];
        var card = document.createElement("div");
        card.className = "status-card";

        var badgeClass = "badge-pending";
        var badgeText = "⏳ Pending";
        var note = "Status: Pending — Admin has not checked or approved yet";

        if (fix.status === "In Progress") {
            card.className += " status-progress";
            badgeClass = "badge-progress";
            badgeText = "⚙️ In Progress";
            note = "Status: In Progress — Work is actively underway";
        } else if (fix.status === "Resolved") {
            card.className += " status-resolved";
            badgeClass = "badge-resolved";
            badgeText = "✅ Resolved";
            note = "Status: Resolved — Issue has been fixed";
        } else {
            card.className += " status-pending";
        }

        var myTag = fix.isMyQuery ? "<span class='badge-my-query'>👤 My Query</span>" : "";
        var deleteBtn = fix.isMyQuery ? "<button class='delete-query-btn' onclick='deleteFixQuery(\"" + fix.title.replace(/'/g, "\\'") + "\")'>Delete</button>" : "";
        var img = fix.image ? "<img src='" + fix.image + "' class='card-image' alt='Photo'>" : "";

        card.innerHTML = 
            "<div class='status-header'>" +
                "<h3>" + fix.title + myTag + "</h3>" +
                "<div><span class='" + badgeClass + "'>" + badgeText + "</span>" + deleteBtn + "</div>" +
            "</div>" +
            "<div class='issue-meta'><span>Category: " + fix.category + "</span><span>Location: " + fix.location + "</span><span>" + fix.date + "</span></div>" +
            "<p>" + fix.description + "</p>" + img +
            "<div class='status-note'>" + note + "</div>";

        fixesList.appendChild(card);
    }
}

function deleteFixQuery(title) {
    if (confirm("Delete this query?")) {
        var list = loadData("campusIssues");
        for (var i = 0; i < list.length; i++) {
            if (list[i].title === title) {
                list.splice(i, 1);
                break;
            }
        }
        saveData("campusIssues", list);
        showRecentFixes();
    }
}

function filterFixes(type) {
    currentFilter = type;
    var btns = document.querySelectorAll(".filter-btn");
    for (var i = 0; i < btns.length; i++) {
        btns[i].classList.remove("active");
    }
    var idMap = { "all": "filter-all", "my-queries": "filter-my-queries", "Pending": "filter-pending", "In Progress": "filter-progress", "Resolved": "filter-resolved" };
    var activeBtn = document.getElementById(idMap[type]);
    if (activeBtn) activeBtn.classList.add("active");
    showRecentFixes();
}

if (fixesList) {
    showRecentFixes();
}

// ==========================================
// 3. Lost & Found Logic (lost-found.html)
// ==========================================
var lostForm = document.getElementById("lost-found-form");
var lostList = document.getElementById("lost-found-list");

function showLostItems() {
    if (!lostList) return;
    var items = loadData("lostAndFoundItems");
    lostList.innerHTML = "";

    if (items.length === 0) {
        lostList.innerHTML = "<p class='no-issues'>No lost or found items posted yet.</p>";
        return;
    }

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var badgeClass = item.status === "Lost" ? "badge-lost" : "badge-found";
        var img = item.image ? "<img src='" + item.image + "' class='card-image' alt='Item Photo'>" : "";

        var card = document.createElement("div");
        card.className = "issue-card";
        card.innerHTML = 
            "<div style='display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;'>" +
                "<h3>" + item.name + "</h3>" +
                "<div><span class='" + badgeClass + "'>" + item.status + "</span>" +
                "<button class='delete-query-btn' onclick='deleteLostItem(" + i + ")'>Delete</button></div>" +
            "</div>" +
            "<div class='issue-meta'><span>Location: " + item.location + "</span></div>" +
            "<p>" + item.description + "</p>" + img;

        lostList.appendChild(card);
    }
}

function deleteLostItem(index) {
    if (confirm("Delete this item?")) {
        var items = loadData("lostAndFoundItems");
        items.splice(index, 1);
        saveData("lostAndFoundItems", items);
        showLostItems();
    }
}

if (lostForm) {
    showLostItems();

    lostForm.addEventListener("submit", function(e) {
        e.preventDefault();

        var status = document.getElementById("itemStatus").value;
        var name = document.getElementById("itemName").value;
        var location = document.getElementById("itemLocation").value;
        var description = document.getElementById("itemDescription").value;
        var fileInput = document.getElementById("itemImage");

        readFile(fileInput, function(imageData) {
            var newItem = {
                status: status,
                name: name,
                location: location,
                description: description,
                image: imageData
            };

            var items = loadData("lostAndFoundItems");
            items.unshift(newItem);
            saveData("lostAndFoundItems", items);

            showLostItems();
            lostForm.reset();
            alert("Item posted to Lost & Found successfully!");
        });
    });
}
