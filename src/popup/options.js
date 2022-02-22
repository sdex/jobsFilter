window.addEventListener('load', function (event) {
    load()

    document.getElementById('country_input').addEventListener('keyup', function (event) {
        if (event.key === "Enter") {
            event.preventDefault()
            addCountry()
        }
    })
    document.getElementById('btn_add_country').addEventListener('click', function () {
        addCountry()
    })
    document.getElementById('keyword_input').addEventListener('keyup', function (event) {
        if (event.key === "Enter") {
            event.preventDefault()
            addKeyword()
        }
    })
    document.getElementById('btn_add_keyword').addEventListener('click', function () {
        addKeyword()
    })
})

function load() {
    browser.storage.local.get(null, function (data) {
        var excludedCountries = data['countries'] || []
        var excludedTitleKeywords = data['title_keywords'] || []
        excludedCountries.sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        });
        excludedTitleKeywords.sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        });
        console.log('Loaded %d countries', excludedCountries.length)
        console.log('Loaded %d title keywords', excludedTitleKeywords.length)

        var countriesContainer = document.getElementById('countries_container')
        for (let country of excludedCountries) {
            addCountryItem(countriesContainer, country)
        }

        var keywordsContainer = document.getElementById('keywords_container')
        for (let keyword of excludedTitleKeywords) {
            addKeywordItem(keywordsContainer, keyword)
        }
    })
}

function addCountry() {
    var inputFilter = document.getElementById('country_input');
    var filterValue = inputFilter.value;
    if (!filterValue) {
        return;
    }
    inputFilter.value = null;
    var container = document.getElementById('countries_container')
    addCountryItem(container, filterValue)
    browser.storage.local.get(null, function (data) {
        var excludedCountries = data['countries'] || []
        excludedCountries.push(filterValue)
        browser.storage.local.set({
            countries: excludedCountries
        }, function () {
            console.log('Add new country: %s', filterValue)
        })
    })
}

function removeCountry(id) {
    document.getElementById(id).remove()
    browser.storage.local.get(null, function (data) {
        var excludedCountries = data['countries'] || []
        const index = excludedCountries.indexOf(id);
        if (index > -1) {
            excludedCountries.splice(index, 1);
        }
        browser.storage.local.set({
            countries: excludedCountries
        }, function () {
            console.log('Remove country: %s', id)
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
    deleteButton.addEventListener("click", function () { removeCountry(value) }, false);

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
    var inputFilter = document.getElementById('keyword_input');
    var filterValue = inputFilter.value;
    if (!filterValue) {
        return;
    }
    inputFilter.value = null;
    var container = document.getElementById('keywords_container')
    addKeywordItem(container, filterValue)
    browser.storage.local.get(null, function (data) {
        var excludedTitleKeywords = data['title_keywords'] || []
        excludedTitleKeywords.push(filterValue)
        browser.storage.local.set({
            title_keywords: excludedTitleKeywords
        }, function () {
            console.log('Add new keyword: %s', filterValue)
        })
    })
}

function removeKeyword(id) {
    document.getElementById(id).remove()
    browser.storage.local.get(null, function (data) {
        var excludedTitleKeywords = data['title_keywords'] || []
        const index = excludedTitleKeywords.indexOf(id);
        if (index > -1) {
            excludedTitleKeywords.splice(index, 1);
        }
        browser.storage.local.set({
            title_keywords: excludedTitleKeywords
        }, function () {
            console.log('Remove keyword: %s', id)
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
    deleteButton.addEventListener("click", function () { removeKeyword(value) }, false);

    var deleteButtonIcon = document.createElement('i')
    deleteButtonIcon.className = 'material-icons'
    deleteButtonIcon.textContent = 'cancel'
    deleteButton.appendChild(deleteButtonIcon)

    item.appendChild(title)
    item.appendChild(deleteButton)
    componentHandler.upgradeElement(item)
    container.appendChild(item)
}