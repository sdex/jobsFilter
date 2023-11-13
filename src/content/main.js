'use strict'

getPrefs().then(data => {
  let excludedCountries = data['countries'] || []
  let excludedTitleKeywords = data['title_keywords'] || []
  const filterCountries = data['filter_countries']
  const filterKeywords = data['filter_keywords']
  if (!filterCountries) {
    excludedCountries = []
    console.log('Countries filter is disabled')
  }
  if (!filterKeywords) {
    excludedTitleKeywords = []
    console.log('Keywords filter is disabled')
  }

  const target = document.querySelector('[data-test=job-tile-list]')
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.addedNodes.length > 0) {
        filter(excludedCountries, excludedTitleKeywords)
      }
    })
  })
  const config = { childList: true }
  observer.observe(target, config)

  filter(excludedCountries, excludedTitleKeywords)
})

function getPrefs() {
  if (window.browser) {
      return browser.storage.sync.get(null)
  } else {
      return new Promise(resolve => chrome.storage.sync.get(null, resolve))
  }
}

function filter(excludedCountries, excludedTitleKeywords) {
  if (document) {
    let elements = document.querySelectorAll('section.up-card-list-section')
    let counter = 0
    for (let element of elements) {
      let hideJob = false
      let nodeClientLocation = element.querySelector('[data-test=client-country] strong')
      let nodeJobTitle = element.querySelector('.job-tile-title > a')
      if (nodeClientLocation) {
        if (excludedCountries.includes(nodeClientLocation.textContent)) {
          console.log("%i. Reason: country=%s, title=%s, link=%s",
            counter, nodeClientLocation.textContent, nodeJobTitle.textContent.trim(), nodeJobTitle.href)
          counter++
          hideJob = true
        }
      }
      if (!hideJob && nodeJobTitle) {
        let titleText = nodeJobTitle.textContent.toLowerCase().trim()
        for (let keyword of excludedTitleKeywords) {
          if (titleText.includes(keyword.toLowerCase().trim())) {
            console.log("%i. Reason: keyword=%s, title=%s, link=%s",
              counter, keyword, nodeJobTitle.textContent.trim(), nodeJobTitle.href)
            counter++
            hideJob = true
            break
          }
        }
      }
      if (hideJob) {
        element.style.display = 'none'
      }
    }
  }
}
