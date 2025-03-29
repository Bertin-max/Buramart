

const pushNotificationRadio = document.getElementById("push-notification");

// Check stored preference on page load
document.addEventListener("DOMContentLoaded", () => {
    const isEnabled = localStorage.getItem("pushNotifications") === "true";
    pushNotificationRadio.checked = isEnabled;
});

// Handle push notification toggle
pushNotificationRadio.addEventListener("change", async function () {
    if (this.checked) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            localStorage.setItem("pushNotifications", "true");
            console.log("Push notifications enabled");
        } else {
            this.checked = false;
            console.log("Push notifications denied");
        }
    } else {
        localStorage.setItem("pushNotifications", "false");
        console.log("Push notifications disabled");
    }
});
