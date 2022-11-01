'use strict'

const countries = ["Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bonaire Sint Eustatius and Saba", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "British Virgin Islands", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo the Democratic Republic of the", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia", "Curacao", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern and Antarctic Lands", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands", "Holy See", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liechtenstein", "Lithuania", "Luxembourg", "Macao", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia Federated States of", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Palestinian Territories", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Barthelemy", "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia", "Saint Martin (French part)", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Sint Maarten (Dutch part)", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Suriname", "Svalbard and Jan Mayen", "Swaziland", "Sweden", "Switzerland", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "United States Virgin Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Wallis and Futuna", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"]

var browser = (window.browser) ? window.browser : window.chrome

window.addEventListener('load', function (event) { load() })

function load() {
    getPrefs().then(data => {
        console.debug(data)
        const excludedCountries = data['countries'] || []
        const excludedTitleKeywords = data['title_keywords'] || []
        const filterCountriesPref = data['filter_countries']
        const filterKeywordsPref = data['filter_keywords']
        const filterCountries = (filterCountriesPref === undefined) ? true : filterCountriesPref
        const filterKeywords = (filterKeywordsPref === undefined) ? true : filterKeywordsPref

        let filterCountriesSwitch = document.getElementById('countries_filter_label').MaterialSwitch
        if (filterCountries) {
            filterCountriesSwitch.on()
        } else {
            filterCountriesSwitch.off()
        }
        let filterKeywordsSwitch = document.getElementById('keywords_filter_label').MaterialSwitch
        if (filterKeywords) {
            filterKeywordsSwitch.on()
        } else {
            filterKeywordsSwitch.off()
        }

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
    if (window.chrome) {
        return new Promise(resolve => window.chrome.storage.sync.get(null, resolve))
    } else {
        return window.browser.storage.sync.get(null)
    }
}

function setPrefs(data, callback) {
    browser.storage.sync.set(data, callback)
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
    document.getElementById('btn_export_config').addEventListener('click', function (e) {
        exportConfig()
        e.preventDefault()
    })
    document.getElementById('btn_import_config').addEventListener('click', function (e) {
        importConfig()
        e.preventDefault()
    })
    document.getElementById('btn_support_development').addEventListener('click', function (e) {
        browser.tabs.create({
            url: "https://sdex.dev/donate/"
        })
        e.preventDefault()
    })
}

function showSnackbar(text) {
    const snackbarContainer = document.getElementById('snackbar_container')
    const data = { message: text }
    snackbarContainer.MaterialSnackbar.showSnackbar(data)
}

function addCountry() {
    const inputFilter = document.getElementById('country_input')
    const inputFilterParent = document.getElementById('country_input_parent')
    const filterValue = inputFilter.value
    if (!filterValue) {
        return
    }
    if (!countries.includes(filterValue)) {
        inputFilterParent.classList.add('is-invalid')
        inputFilterParent.classList.add('is-dirty')
        return
    }
    inputFilter.value = null
    const container = document.getElementById('countries_container')
    getPrefs().then(data => {
        const excludedCountries = data['countries'] || []
        if (excludedCountries.includes(filterValue)) {
            showSnackbar('"' + filterValue + '" is added already')
            return
        }
        addCountryItem(container, filterValue)
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
        e.target.value = ''
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