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
    loadingDiv.style.display = 'none'
    console.log("Everything is loaded")

    // Initialize log system
    initializeLogSystem()

    // Initialize log toggle
    initializeLogToggle()
})

// Log system - load and render markdown logs
let logsData = []

async function initializeLogSystem() {
    try {
        // Load logs metadata
        const response = await fetch('logs.json')
        const data = await response.json()
        logsData = data.logs

        // Render log overview
        renderLogOverview()

        // Render log cards in sidebar
        await renderLogCards()

        // Initialize category filtering
        initializeLogFiltering()

        // Check for article query param and scroll to it
        checkAndScrollToArticle()
    } catch (error) {
        console.error('Error loading logs:', error)
    }
}

function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00')
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

function getCategoryLabel(category) {
    const labels = {
        'snippet': 'Snippets',
        'climbing-analysis': 'Climbing Video Analysis',
        'crux-beta-ios': 'Crux & Beta iOS',
        'crux-web': 'Crux Web',
        'boulder-quest': 'Boulder Quest'
    }
    return labels[category] || category
}

function renderLogOverview() {
    const overviewList = document.querySelector('.log-overview-list')
    if (!overviewList) return

    if (logsData.length === 0) {
        overviewList.innerHTML = `
            <li class="log-overview-item">
                <span class="log-overview-title body-text">No logs found</span>
            </li>
        `
        return
    }

    overviewList.innerHTML = logsData.map(log => `
        <li class="log-overview-item">
            <a href="?article=${log.id}" class="log-overview-link">
                <span class="log-overview-title body-text">${log.title}</span>
                <span class="log-overview-dotted-line"></span>
                <span class="log-overview-meta">
                    <span>${formatDate(log.date)}</span>
                    <span class="log-overview-category-badge">${getCategoryLabel(log.category)}</span>
                </span>
            </a>
        </li>
    `).join('')

    // Add click event handlers for smooth scrolling
    overviewList.querySelectorAll('.log-overview-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault()
            const url = new URL(link.href)
            const articleId = url.searchParams.get('article')

            // Show log panel if hidden
            const logSidebar = document.querySelector('.log-sidebar')
            const logToggle = document.getElementById('log-toggle')
            if (logSidebar && logSidebar.classList.contains('log-sidebar-hidden')) {
                logSidebar.classList.remove('log-sidebar-hidden')
                if (logToggle) {
                    logToggle.classList.add('log-sidebar-open')
                }
            }

            scrollToArticle(articleId)
            // Update URL without page reload
            window.history.pushState({}, '', `?article=${articleId}`)
        })
    })
}

async function renderLogCards() {
    const logEntriesContainer = document.querySelector('.log-entries')
    if (!logEntriesContainer) return

    logEntriesContainer.innerHTML = ''

    // Configure marked to open links in new tab
    const renderer = new marked.Renderer()
    const originalLinkRenderer = renderer.link
    renderer.link = function (href, title, text) {
        const html = originalLinkRenderer.call(this, href, title, text)
        return html.replace(/^<a /, '<a target="_blank" rel="noopener noreferrer" ')
    }

    for (const log of logsData) {
        try {
            // Fetch markdown content
            const response = await fetch(log.file)
            const markdown = await response.text()

            // Parse markdown to HTML with custom renderer
            const htmlContent = marked.parse(markdown, { renderer: renderer })

            // Create log card
            const logCard = document.createElement('div')
            logCard.className = 'log-entry active'
            logCard.dataset.category = log.category
            logCard.id = `log-${log.id}`
            logCard.innerHTML = `
                <div class="log-entry-header">
                    <div class="log-entry-date">${formatDate(log.date)}</div>
                    <span class="log-entry-badge">${getCategoryLabel(log.category)}</span>
                </div>
                <div class="log-entry-content markdown-content">${htmlContent}</div>
            `

            logEntriesContainer.appendChild(logCard)
        } catch (error) {
            console.error(`Error loading log ${log.id}:`, error)
        }
    }
}

// Log category filtering system
function initializeLogFiltering() {
    const categoryButtons = document.querySelectorAll('.log-category-btn')
    const logEntries = document.querySelectorAll('.log-entry')

    categoryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const selectedCategory = button.dataset.category

            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'))
            button.classList.add('active')

            // Filter entries
            logEntries.forEach(entry => {
                if (selectedCategory === 'all' || entry.dataset.category === selectedCategory) {
                    entry.classList.add('active')
                } else {
                    entry.classList.remove('active')
                }
            })

            // Reset URL parameters 
            if (e.isTrusted) { // only if it's a real user click (not programmatic)
                window.history.replaceState({}, '', window.location.pathname)
            }
        })
    })
}

// Scroll to article in the log sidebar
function scrollToArticle(articleId) {
    const logCard = document.getElementById(`log-${articleId}`)
    if (logCard) {
        // Get the category of the log entry
        const logCategory = logCard.dataset.category

        // Find and click the corresponding category button
        const categoryButtons = document.querySelectorAll('.log-category-btn')
        categoryButtons.forEach(button => {
            if (button.dataset.category === logCategory) {
                button.click()
            }
        })

        // Get the log sidebar element
        const logSidebar = document.querySelector('.log-sidebar')
        const logSidebarHeader = document.querySelector('.log-sidebar-header')
        if (logSidebar && logSidebarHeader) {
            // Calculate the position to scroll to
            const cardOffsetTop = logCard.offsetTop
            const headerHeight = logSidebarHeader.offsetHeight
            const scrollPosition = cardOffsetTop - headerHeight - 32 // 2rem (32px) to match padding-top

            logSidebar.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            })
        }
    }
}

// Check URL params and scroll to article if specified
function checkAndScrollToArticle() {
    const urlParams = new URLSearchParams(window.location.search)
    const articleId = urlParams.get('article')
    if (articleId) {
        // Open the log panel
        const logSidebar = document.querySelector('.log-sidebar')
        const logToggle = document.getElementById('log-toggle')
        if (logSidebar && logSidebar.classList.contains('log-sidebar-hidden')) {
            logSidebar.classList.remove('log-sidebar-hidden')
            if (logToggle) {
                logToggle.classList.add('log-sidebar-open')
            }
        }

        // Small delay to ensure DOM is fully rendered
        setTimeout(() => scrollToArticle(articleId), 100)
    }
}

// Log panel toggle functionality
function initializeLogToggle() {
    const logToggle = document.getElementById('log-toggle')
    const logCloseBtn = document.getElementById('log-close-btn')
    const logSidebar = document.querySelector('.log-sidebar')

    if (logToggle && logSidebar) {
        logToggle.addEventListener('click', () => {
            logSidebar.classList.toggle('log-sidebar-hidden')
            logToggle.classList.toggle('log-sidebar-open')
        })
    }

    if (logCloseBtn && logSidebar) {
        logCloseBtn.addEventListener('click', () => {
            logSidebar.classList.add('log-sidebar-hidden')
            if (logToggle) {
                logToggle.classList.remove('log-sidebar-open')
            }
        })
    }
}