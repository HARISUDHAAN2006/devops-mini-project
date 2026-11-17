
const appStatus = document.getElementById("appStatus");
const uptimeElement = document.getElementById("uptime");
const apiStatus = document.getElementById("apiStatus");
const lastChecked = document.getElementById("lastChecked");

const flaskStatus = document.getElementById("flaskStatus");
const healthStatus = document.getElementById("healthStatus");

const activityList = document.getElementById("activityList");
const refreshBtn = document.getElementById("refreshBtn");


function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${days}d ${hours}h ${minutes}m ${secs}s`;
}


function updateClock() {
    const now = new Date();

    document.getElementById("clock").textContent =
        now.toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "medium"
        });
}


function addActivity(message, successful = true) {
    const row = document.createElement("div");
    row.className = "activity-row";

    const dot = document.createElement("span");
    dot.className = "activity-dot";
    dot.style.background = successful ? "#36d399" : "#fb7185";

    const content = document.createElement("div");

    const title = document.createElement("strong");
    title.textContent = message;

    const description = document.createElement("p");
    description.textContent = "Health monitoring event recorded.";

    const time = document.createElement("span");
    time.className = "activity-time";
    time.textContent = new Date().toLocaleTimeString();

    content.append(title, description);
    row.append(dot, content, time);

    activityList.prepend(row);

    // Keep only the latest 5 events
    while (activityList.children.length > 5) {
        activityList.lastElementChild.remove();
    }
}


function setStatus(element, healthy) {
    element.textContent = healthy ? "Operational" : "Offline";

    element.className = healthy
        ? "status-pill operational"
        : "status-pill";
}


async function checkHealth() {
    refreshBtn.disabled = true;
    refreshBtn.textContent = "Checking...";

    try {
        const response = await fetch("/health", {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Health endpoint returned an error");
        }

        const data = await response.json();

        const healthy = data.status === "healthy";

        appStatus.textContent = healthy ? "Healthy" : "Unhealthy";
        uptimeElement.textContent = formatUptime(data.uptime_seconds);

        apiStatus.textContent = "Available";

        setStatus(flaskStatus, healthy);
        setStatus(healthStatus, true);

        lastChecked.textContent =
            new Date().toLocaleTimeString();

        addActivity(
            healthy
                ? "Application health check successful"
                : "Application reported an unhealthy status",
            healthy
        );

    } catch (error) {

        appStatus.textContent = "Unreachable";
        apiStatus.textContent = "Unavailable";
        uptimeElement.textContent = "--";

        setStatus(flaskStatus, false);
        setStatus(healthStatus, false);

        lastChecked.textContent =
            new Date().toLocaleTimeString();

        addActivity("Health check failed", false);

        console.error("Health check error:", error);

    } finally {
        refreshBtn.disabled = false;
        refreshBtn.textContent = "↻ Refresh";
    }
}


// Manual refresh
refreshBtn.addEventListener("click", checkHealth);


// Initial dashboard setup
updateClock();
checkHealth();


// Update clock every second
setInterval(updateClock, 1000);


// Automatically check application health every 5 seconds
setInterval(checkHealth, 5000);
