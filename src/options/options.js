'use strict'

window.addEventListener('load', function (event) { load() })

function load() {
    getPrefs().then(data => {
        // console.log(data)
        const excludedCountries = data['countries'] || []
        const excludedTitleKeywords = data['title_keywords'] || []
        const filterCountries = data['filter_countries']
        const filterKeywords = data['filter_keywords']

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

        const countriesContainer = document.getElementById('countries_container')
        for (let country of excludedCountries) {
            addCountryItem(countriesContainer, country)
        }

        const keywordsContainer = document.getElementById('keywords_container')
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
        const isEnabled = event.currentTarget.checked
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
        const isEnabled = event.currentTarget.checked
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
    const snackbarContainer = document.getElementById('snackbar_container')
    const data = { message: text }
    snackbarContainer.MaterialSnackbar.showSnackbar(data)
}

function addCountry() {
    const inputFilter = document.getElementById('country_input')
    const filterValue = inputFilter.value
    if (!filterValue) {
        return
    }
    inputFilter.value = null
    const container = document.getElementById('countries_container')
    addCountryItem(container, filterValue)
    getPrefs().then(data => {
        const excludedCountries = data['countries'] || []
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
        const excludedCountries = data['countries'] || []
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
    const item = document.createElement('div')
    item.id = value
    item.className = 'ew-chip mdl-chip mdl-chip--deletable'

    const title = document.createElement('span')
    title.className = 'mdl-chip__text'
    title.textContent = value

    const deleteButton = document.createElement('button')
    deleteButton.className = 'mdl-chip__action'
    deleteButton.addEventListener("click", function () { removeCountry(value) }, false)

    const deleteButtonIcon = document.createElement('i')
    deleteButtonIcon.className = 'material-icons'
    deleteButtonIcon.textContent = 'cancel'
    deleteButton.appendChild(deleteButtonIcon)

    item.appendChild(title)
    item.appendChild(deleteButton)
    componentHandler.upgradeElement(item)
    container.appendChild(item)
}

function addKeyword() {
    const inputFilter = document.getElementById('keyword_input')
    const filterValue = inputFilter.value
    if (!filterValue) {
        return
    }
    inputFilter.value = null
    const container = document.getElementById('keywords_container')
    addKeywordItem(container, filterValue)
    getPrefs().then(data => {
        const excludedTitleKeywords = data['title_keywords'] || []
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
        const excludedTitleKeywords = data['title_keywords'] || []
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
    const item = document.createElement('div')
    item.id = value
    item.className = 'ew-chip mdl-chip mdl-chip--deletable'

    const title = document.createElement('span')
    title.className = 'mdl-chip__text'
    title.textContent = value

    const deleteButton = document.createElement('button')
    deleteButton.className = 'mdl-chip__action'
    deleteButton.addEventListener("click", function () { removeKeyword(value) }, false)

    const deleteButtonIcon = document.createElement('i')
    deleteButtonIcon.className = 'material-icons'
    deleteButtonIcon.textContent = 'cancel'
    deleteButton.appendChild(deleteButtonIcon)

    item.appendChild(title)
    item.appendChild(deleteButton)
    componentHandler.upgradeElement(item)
    container.appendChild(item)
}

function saveData(data, fileName) {
    const a = document.createElement('a')
    document.body.appendChild(a)
    a.style = 'display: none'
    const json = JSON.stringify(data),
        blob = new Blob([json], { type: 'octet/stream' }),
        url = window.URL.createObjectURL(blob)
    a.href = url
    a.download = fileName
    a.click()
    window.URL.revokeObjectURL(url)
}

function exportConfig() {
    getPrefs().then(data => {
        const fileName = 'up-ext-config.json'
        saveData(data, fileName)
    })
}

function importConfig() {
    const inputFile = document.getElementById('file-input')
    inputFile.onchange = e => {
        const file = e.target.files[0]
        loadConfigFile(file)
    }
    inputFile.click()
}

function loadConfigFile(file) {
    const fileReader = new FileReader()
    fileReader.onload = function receivedText(e) {
        const data = e.target.result
        setPrefs(JSON.parse(data), function () {
            location.reload()
        })
    }
    fileReader.readAsText(file)
}