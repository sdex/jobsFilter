var browser = (window.browser) ? window.browser : window.chrome

function createTab(url) {
    browser.tabs.create({
        url: url
    })
    window.close()
}

document.getElementById('open-home').onclick = () => createTab('https://www.upwork.com/nx/find-work/')
document.getElementById('open-reports').onclick = () => createTab('https://www.upwork.com/nx/reports/overview/?tab=in-progress')
document.getElementById('open-messages').onclick = () => createTab('https://www.upwork.com/messages/')

document.getElementById('options').onclick = () => {
    browser.runtime.openOptionsPage()
    window.close()
}