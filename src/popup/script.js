function sendAction(action) {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {action: action});
    });
}

document.getElementById("font-size-decrease").onclick = () => sendAction("font-size-decrease");

document.getElementById("font-size-increase").onclick = () => sendAction("font-size-increase");

document.getElementById("grayscale-toggle").onclick = () => sendAction("grayscale-toggle");

document.getElementById("invert-toggle").onclick = () => sendAction("invert-toggle");
