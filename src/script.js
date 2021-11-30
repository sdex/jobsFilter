const excludedCountries = [
  'Pakistan',
  'Bangladesh',
  'Ukraine',
  'Philippines',
  'Sri Lanka',
  'Egypt',
  'Lebanon',
  'Russia',
  'Nigeria',
  'Palestinian Territories',
  'Kuwait',
  'Saudi Arabia',
  'Israel'
]

const excludedKeywordsInJobTitle = [
  'flutter',
  'ionic',
  'react native',
  'reactjs'
  'reactnative',
  'xamarin',
  'capacitor',
  'publish',
  'publishing',
  'publisher',
  'make my app live',
  'host app',
  'upload my',
  'upload in your',
  'upload android',
  'play console',
  'russian'
]

document.addEventListener('click', function (event) {
  let jobFeedback = event.target.closest('.job-feedback')
  if (jobFeedback) {
    event.preventDefault()
    let jobTile = jobFeedback.closest('section.job-tile')

    let array = []
    let garbageJobs = localStorage.getItem('garbage')
    if (garbageJobs) {
      array = JSON.parse(garbageJobs)
    }

    let nodeJobTitle = jobTile.querySelector('a.job-title-link')
    let nodeClientLocation = jobTile.querySelector('strong.client-location')
    let nodeDescription = jobTile.querySelector('div.description.break').querySelector('span.ng-binding')

    array.push({
      jobTitle: nodeJobTitle.textContent,
      location: nodeClientLocation ? nodeClientLocation.textContent : 'n/a',
      description: nodeDescription.textContent
    })

    localStorage.setItem('garbage', JSON.stringify(array))
  }
}, true)

setInterval(() => {
  if (document) {
    let elements = document.querySelectorAll('section.job-tile')

    let cnt = 0

    for (let element of elements) {

      let removal = false

      let nodeClientLocation = element.querySelector('strong.client-location')
      if (nodeClientLocation) {
        if (excludedCountries.includes(nodeClientLocation.textContent)) {
          cnt++
          console.log(cnt, nodeClientLocation.textContent)
          removal = true
        }
      }

      let nodeJobTitle = element.querySelector('a.job-title-link')
      if (nodeJobTitle) {
        for (let keyword of excludedKeywordsInJobTitle) {
          if (nodeJobTitle.textContent.toLowerCase().includes(keyword)) {
            cnt++
            console.log(cnt, nodeJobTitle.textContent)
            removal = true
          }
        }
      }

      let nodeDescriptionContainer = element.querySelector('div.description.break')
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

      if (removal) {
        element.parentElement.removeChild(element)
      }
    }
  }
}, 1000)