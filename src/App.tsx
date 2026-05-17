import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { AboutSection } from './components/AboutSection'
import { ProjectsSection } from './components/ProjectsSection'
import { LogSection } from './components/LogSection'
import { LogSidebar } from './components/LogSidebar'
import { Footer } from './components/Footer'
import { useLogs } from './hooks/useLogs'

function App() {
  const { logs } = useLogs()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [scrollToId, setScrollToId] = useState<string | null>(null)

  // On mount, check for ?article= query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const articleId = params.get('article')
    if (articleId) {
      setSidebarOpen(true)
      setScrollToId(articleId)

      // Activate the matching category filter
      const log = logs.find((l) => l.id === articleId)
      if (log) setActiveCategory(log.category)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleLogClick(id: string) {
    const log = logs.find((l) => l.id === id)
    if (log) setActiveCategory(log.category)
    setScrollToId(id)
    setSidebarOpen(true)
    window.history.pushState({}, '', `?article=${id}`)
  }

  function handleToggleSidebar() {
    setSidebarOpen((prev) => {
      if (!prev) {
        // Opening: keep scrollToId so it scrolls on open
      } else {
        window.history.replaceState({}, '', window.location.pathname)
      }
      return !prev
    })
  }

  function handleCloseSidebar() {
    setSidebarOpen(false)
    window.history.replaceState({}, '', window.location.pathname)
  }

  function handleCategoryChange(category: string) {
    setActiveCategory(category)
    setScrollToId(null)
    window.history.replaceState({}, '', window.location.pathname)
  }

  return (
    <div className="flex">
      {/* Main content */}
      <div className="w-full 2xl:w-3/5 px-4 py-6 md:px-12 md:py-12" id="main">
        <Header />
        <AboutSection />
        <ProjectsSection />
        <LogSection
          logs={logs}
          onLogClick={handleLogClick}
          onToggleSidebar={handleToggleSidebar}
          sidebarOpen={sidebarOpen}
        />
        <Footer />
      </div>

      {/* Log sidebar */}
      <LogSidebar
        logs={logs}
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        scrollToId={scrollToId}
      />
    </div>
  )
}

export default App

