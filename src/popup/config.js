function sendAction(action) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: action });
    });
}

var saveData = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, fileName) {
        var json = JSON.stringify(data),
            blob = new Blob([json], { type: "octet/stream" }),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());

function exportConfig() {
    const excludedCountries = JSON.parse(localStorage.getItem('countries')) || [];
    const excludedTitleKeywords = JSON.parse(localStorage.getItem('title_keywords')) || [];
    var data = {
        'countries': excludedCountries,
        'title_keywords': excludedTitleKeywords
    }
    var fileName = 'up-ext-config.json'
    saveData(data, fileName);
}

function importConfig() {
    var inputFile = document.getElementById('file-input')
    console.log(inputFile)
    inputFile.onchange = e => {
        var file = e.target.files[0]
        loadConfigFile(file)
    }
    inputFile.click()
}

function loadConfigFile(file) {
    console.log('Load file: %s', file)
    var fileReader = new FileReader();
    fileReader.onload = function receivedText(e) {
        let lines = e.target.result;
        var config = JSON.parse(lines);
        localStorage.setItem('countries', JSON.stringify(config['countries']))
        localStorage.setItem('title_keywords', JSON.stringify(config['title_keywords']))
    };
    fileReader.readAsText(file);
}

document.getElementById("reload-page").onclick = () => sendAction("reload-page");
document.getElementById("export-config").onclick = () => exportConfig();
document.getElementById("import-config").onclick = () => importConfig();
