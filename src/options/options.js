'use strict'

window.addEventListener('load', function (event) { load() })

function load() {
    getPrefs().then(data => {
        // console.log(data)
        var excludedCountries = data['countries'] || []
        var excludedTitleKeywords = data['title_keywords'] || []
        var filterCountries = data['filter_countries']
        var filterKeywords = data['filter_keywords']

        // if (!filterCountries) {
        //     document.getElementById('countries_filter_switch')
        //         .setAttribute("checked", "false")
        // }
        // if (!filterKeywords) {
        //     document.getElementById('keywords_filter_switch')
        //         .setAttribute("checked", "false")
        // }

        excludedCountries.sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase())
        })
        excludedTitleKeywords.sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase())
        })
        console.log('Loaded %d countries', excludedCountries.length)
        console.log('Countries filter enabled:', filterCountries)
        console.log('Loaded %d title keywords', excludedTitleKeywords.length)
        console.log('Keywords filter enabled:', filterKeywords)

        var countriesContainer = document.getElementById('countries_container')
        for (let country of excludedCountries) {
            addCountryItem(countriesContainer, country)
        }

        var keywordsContainer = document.getElementById('keywords_container')
        for (let keyword of excludedTitleKeywords) {
            addKeywordItem(keywordsContainer, keyword)
        }

        addEventListeners()
    })
}

function getPrefs() {
    if (window.browser) {
        return browser.storage.sync.get(null)
    } else {
        return new Promise(resolve => chrome.storage.sync.get(null, resolve))
    }
}

function setPrefs(data, callback) {
    if (window.browser) {
        return browser.storage.sync.set(data, callback)
    } else {
        return chrome.storage.sync.set(data, callback)
    }
}

function addEventListeners() {
    document.getElementById('countries_filter_switch').addEventListener('change', (event) => {
        var isEnabled = event.currentTarget.checked
        setPrefs({
            filter_countries: isEnabled
        }, function () {
            showSnackbar('Countries filter has been ' + (isEnabled ? 'enabled' : 'disabled'))
        })
    })
    document.getElementById('country_input').addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault()
            addCountry()
        }
    })
    document.getElementById('btn_add_country').addEventListener('click', function () {
        addCountry()
    })

    document.getElementById('keywords_filter_switch').addEventListener('change', (event) => {
        var isEnabled = event.currentTarget.checked
        setPrefs({
            filter_keywords: isEnabled
        }, function () {
            showSnackbar('Keywords filter has been ' + (isEnabled ? 'enabled' : 'disabled'))
        })
    })
    document.getElementById('keyword_input').addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault()
            addKeyword()
        }
    })
    document.getElementById('btn_add_keyword').addEventListener('click', function () {
        addKeyword()
    })
    document.getElementById('btn_export_config').addEventListener('click', function () {
        exportConfig()
    })
    document.getElementById('btn_import_config').addEventListener('click', function () {
        importConfig()
    })
}

function showSnackbar(text) {
    var snackbarContainer = document.getElementById('snackbar_container')
    var data = { message: text }
    snackbarContainer.MaterialSnackbar.showSnackbar(data)
}

function addCountry() {
    var inputFilter = document.getElementById('country_input')
    var filterValue = inputFilter.value
    if (!filterValue) {
        return
    }
    inputFilter.value = null
    var container = document.getElementById('countries_container')
    addCountryItem(container, filterValue)
    getPrefs().then(data => {
        var excludedCountries = data['countries'] || []
        excludedCountries.push(filterValue)
        setPrefs({
            countries: excludedCountries
        }, function () {
            showSnackbar('Added "' + filterValue + '"')
        })
    })
}

function removeCountry(id) {
    document.getElementById(id).remove()
    getPrefs().then(data => {
        var excludedCountries = data['countries'] || []
        const index = excludedCountries.indexOf(id)
        if (index > -1) {
            excludedCountries.splice(index, 1)
        }
        setPrefs({
            countries: excludedCountries
        }, function () {
            showSnackbar('Removed "' + id + '"')
        })
    })
}

function addCountryItem(container, value) {
    var item = document.createElement('div')
    item.id = value
    item.className = 'ew-chip mdl-chip mdl-chip--deletable'

    var title = document.createElement('span')
    title.className = 'mdl-chip__text'
    title.textContent = value

    var deleteButton = document.createElement('button')
    deleteButton.className = 'mdl-chip__action'
    deleteButton.addEventListener("click", function () { removeCountry(value) }, false)

    var deleteButtonIcon = document.createElement('i')
    deleteButtonIcon.className = 'material-icons'
    deleteButtonIcon.textContent = 'cancel'
    deleteButton.appendChild(deleteButtonIcon)

    item.appendChild(title)
    item.appendChild(deleteButton)
    componentHandler.upgradeElement(item)
    container.appendChild(item)
}

function addKeyword() {
    var inputFilter = document.getElementById('keyword_input')
    var filterValue = inputFilter.value
    if (!filterValue) {
        return
    }
    inputFilter.value = null
    var container = document.getElementById('keywords_container')
    addKeywordItem(container, filterValue)
    getPrefs().then(data => {
        var excludedTitleKeywords = data['title_keywords'] || []
        excludedTitleKeywords.push(filterValue)
        setPrefs({
            title_keywords: excludedTitleKeywords
        }, function () {
            showSnackbar('Added "' + filterValue + '"')
        })
    })
}

function removeKeyword(id) {
    document.getElementById(id).remove()
    getPrefs().then(data => {
        var excludedTitleKeywords = data['title_keywords'] || []
        const index = excludedTitleKeywords.indexOf(id)
        if (index > -1) {
            excludedTitleKeywords.splice(index, 1)
        }
        setPrefs({
            title_keywords: excludedTitleKeywords
        }, function () {
            showSnackbar('Removed "' + id + '"')
        })
    })
}

function addKeywordItem(container, value) {
    var item = document.createElement('div')
    item.id = value
    item.className = 'ew-chip mdl-chip mdl-chip--deletable'

    var title = document.createElement('span')
    title.className = 'mdl-chip__text'
    title.textContent = value

    var deleteButton = document.createElement('button')
    deleteButton.className = 'mdl-chip__action'
    deleteButton.addEventListener("click", function () { removeKeyword(value) }, false)

    var deleteButtonIcon = document.createElement('i')
    deleteButtonIcon.className = 'material-icons'
    deleteButtonIcon.textContent = 'cancel'
    deleteButton.appendChild(deleteButtonIcon)

    item.appendChild(title)
    item.appendChild(deleteButton)
    componentHandler.upgradeElement(item)
    container.appendChild(item)
}

function saveData(data, fileName) {
    var a = document.createElement('a')
    document.body.appendChild(a)
    a.style = 'display: none'
    var json = JSON.stringify(data),
        blob = new Blob([json], { type: 'octet/stream' }),
        url = window.URL.createObjectURL(blob)
    a.href = url
    a.download = fileName
    a.click()
    window.URL.revokeObjectURL(url)
}

function exportConfig() {
    getPrefs().then(data => {
        var fileName = 'up-ext-config.json'
        saveData(data, fileName)
    })
}

function importConfig() {
    var inputFile = document.getElementById('file-input')
    inputFile.onchange = e => {
        var file = e.target.files[0]
        loadConfigFile(file)
    }
    inputFile.click()
}

function loadConfigFile(file) {
    var fileReader = new FileReader()
    fileReader.onload = function receivedText(e) {
        let data = e.target.result
        setPrefs(JSON.parse(data), function () {
            location.reload()
        })
    }
    fileReader.readAsText(file)
}