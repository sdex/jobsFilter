var excludedCountries = []
var excludedTitleKeywords = []

browser.storage.local.get(null, function (data) {
  excludedCountries = data['countries'] || []
  excludedTitleKeywords = data['title_keywords'] || []

  var target = document.querySelector('[data-test=job-tile-list]')
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.addedNodes.length > 0) {
        filter()
      }
    })
  })
  var config = { childList: true }
  observer.observe(target, config)

  filter()
})

chrome.runtime.onMessage.addListener(msg => {
  console.log('Got action: %s', msg.action)
  if (msg.action === 'reload-page') {
    location.reload()
  }
})

/*let nodeDescriptionContainer = element.querySelector('div.description.break')
      if (nodeDescriptionContainer) {
        let nodeDescription = element.querySelector('div.description.break').querySelector('span.ng-binding')
        let garbageJobs = localStorage.getItem('garbage')
        if (garbageJobs) {
          let array = JSON.parse(garbageJobs)
          let isGarbage = array.some(g =>
            g.jobTitle === nodeJobTitle.textContent
            && g.location === (nodeClientLocation ? nodeClientLocation.textContent : 'n/a')
            && g.description === nodeDescription.textContent
          )
          if (isGarbage) {
            removal = true
          }
        }
      }
      */

function filter() {
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
          if (titleText.includes(keyword)) {
            console.log("%i. Reason: keyword=%s, title=%s, link=%s",
              counter, keyword, nodeJobTitle.textContent.trim(), nodeJobTitle.href)
            counter++
            hideJob = true
            break
          }
        }
      }
      if (hideJob) {
        element.parentElement.removeChild(element)
      }
    }
  }
}
