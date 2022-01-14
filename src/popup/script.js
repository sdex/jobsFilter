function sendAction(action) {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {action: action});
    });
}

document.getElementById("reload-page").onclick = () => sendAction("reload-page");

