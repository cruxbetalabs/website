const mainDOM = document.getElementById("main")

// Create loading indicator
const loadingDiv = document.createElement('div')
loadingDiv.id = 'loading'
loadingDiv.textContent = 'Loading...'
loadingDiv.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: white; z-index: 9999; font-size: 1.3rem; color: #0b0b0bff;'

// Show loading indicator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    document.body.insertBefore(loadingDiv, document.body.firstChild)
})

window.addEventListener("load", () => {
    // Hide loading indicator
    loadingDiv.style.display = 'none'

    // Show completion message
    console.log("Everything is loaded")

    // Log complete DOM
    // console.log("Complete DOM:", document.documentElement.outerHTML)
})