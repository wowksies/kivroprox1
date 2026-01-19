// Register Service Worker for UV
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/uv/sw.js", {
            scope: __uv$config.prefix,
        });
    });
}

// Falling Lights Animation
const container = document.getElementById('falling-lights');
if (container) {
    for (let i = 0; i < 15; i++) {
        const light = document.createElement('div');
        light.className = 'falling-light';
        light.style.left = `${Math.random() * 100}%`;
        light.style.animationDuration = `${2 + Math.random() * 3}s`;
        light.style.animationDelay = `${Math.random() * 5}s`;
        light.style.opacity = `${0.3 + Math.random() * 0.5}`;
        container.appendChild(light);
    }
}

// Logic to Open Proxy
function launch(url) {
    // 1. Validate and Format URL
    let searchUrl = "https://www.google.com/search?q=";
    let target = url.trim();

    if (!target.includes(".")) {
        target = searchUrl + encodeURIComponent(target);
    } else {
        if (!target.startsWith("http://") && !target.startsWith("https://")) {
            target = "https://" + target;
        }
    }

    // 2. Hide Menu, Show Proxy
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('proxy-container').classList.remove('hidden');
    
    // 3. Set Iframe Source via UV
    const frame = document.getElementById("iframeWindow");
    frame.src = __uv$config.prefix + __uv$config.encodeUrl(target);
    
    // 4. Update Header Text
    document.getElementById('current-url').textContent = "Browsing: " + target;
}

// Logic to Close Proxy
function closeProxy() {
    document.getElementById('proxy-container').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
    document.getElementById("iframeWindow").src = 'about:blank'; // Stop audio/video
}

// Handle Form Submit
document.getElementById("proxy-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const input = document.getElementById("urlInput");
    if(input.value) {
        launch(input.value);
    }
});

// Expose functions to global scope for buttons
window.launch = launch;
window.closeProxy = closeProxy;
