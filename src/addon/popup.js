function sendAction(action) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: action })
    })
}

function createTab(url) {
    browser.tabs.create({
        url: url
    })
    window.close()
}

document.getElementById('open-home').onclick = () => createTab('https://www.upwork.com/nx/find-work/')
document.getElementById('open-reports').onclick = () => createTab('https://www.upwork.com/nx/reports/overview/?tab=in-progress')
document.getElementById('open-messages').onclick = () => createTab('https://www.upwork.com/messages/')

document.getElementById('options').onclick = () => createTab('options.html')