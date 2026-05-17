import { useEffect, useRef } from 'react'
import type { LogMeta } from '../types'
import { CATEGORY_LABELS } from '../hooks/useLogs'
import { LogEntry } from './LogEntry'

interface LogSidebarProps {
    logs: LogMeta[]
    isOpen: boolean
    onClose: () => void
    activeCategory: string
    onCategoryChange: (category: string) => void
    scrollToId: string | null
}

const CATEGORIES = ['all', 'snippet', 'climbing-analysis', 'crux-beta-ios']

export function LogSidebar({
    logs,
    isOpen,
    onClose,
    activeCategory,
    onCategoryChange,
    scrollToId,
}: LogSidebarProps) {
    const sidebarRef = useRef<HTMLDivElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)

    const filteredLogs = activeCategory === 'all'
        ? logs
        : logs.filter((l) => l.category === activeCategory)

    // Scroll to a specific log entry when scrollToId changes
    useEffect(() => {
        if (!scrollToId || !isOpen) return
        const target = document.getElementById(`log-${scrollToId}`)
        const sidebar = sidebarRef.current
        const header = headerRef.current
        if (!target || !sidebar || !header) return

        // Small delay to let the DOM settle after open
        const timer = setTimeout(() => {
            const offsetTop = target.offsetTop - header.offsetHeight - 32
            sidebar.scrollTo({ top: Math.max(0, offsetTop), behavior: 'smooth' })
        }, 80)
        return () => clearTimeout(timer)
    }, [scrollToId, isOpen])

    // Prevent body scroll when mobile sidebar is open
    useEffect(() => {
        if (window.innerWidth >= 1536) return
        document.body.style.overflow = isOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="log-mobile-backdrop active"
                    onClick={onClose}
                />
            )}

            <div
                ref={sidebarRef}
                className={[
                    'log-sidebar',
                    isOpen ? 'log-sidebar-mobile-open' : 'log-sidebar-hidden',
                ].join(' ')}
            >
                {/* Sticky header */}
                <div className="log-sidebar-header" ref={headerRef}>
                    <div className="log-sidebar-title-row">
                        <h2>Log</h2>
                        <button className="log-close-btn" onClick={onClose} aria-label="Close log panel">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Category filter tabs */}
                    <div className="log-categories">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                className={`log-category-btn${activeCategory === cat ? ' active' : ''}`}
                                onClick={() => onCategoryChange(cat)}
                            >
                                {CATEGORY_LABELS[cat] ?? cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Log entries */}
                <div className="log-entries">
                    {filteredLogs.map((log) => (
                        <LogEntry key={log.id} log={log} />
                    ))}
                </div>
            </div>
        </>
    )
}
