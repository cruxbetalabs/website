import type { LogMeta } from '../types'
import { CATEGORY_LABELS } from '../hooks/useLogs'

interface LogSectionProps {
    logs: LogMeta[]
    onLogClick: (id: string) => void
    onToggleSidebar: () => void
    sidebarOpen: boolean
}

function formatDate(dateString: string): string {
    const date = new Date(dateString + 'T00:00:00')
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function LogSection({ logs, onLogClick, onToggleSidebar, sidebarOpen }: LogSectionProps) {
    return (
        <>
            <div className="divider" />
            <div className="grid-cols mb-12">
                <div>
                    <h2 id="log" className="log-toggle-heading">
                        <a
                            href="#log"
                            onClick={(e) => { e.preventDefault(); onToggleSidebar() }}
                            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            className={sidebarOpen ? 'log-sidebar-open' : ''}
                            id="log-toggle"
                        >
                            <span>Log</span>
                            {/* Arrow icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                className="log-toggle-icon">
                                <path d="M3 5v14" />
                                <path d="M21 12H7" />
                                <path d="m15 18 6-6-6-6" />
                            </svg>
                        </a>
                    </h2>
                </div>
                <div>
                    <ul className="log-overview-list">
                        {logs.map((log) => (
                            <li key={log.id} className="log-overview-item">
                                <a
                                    href={`?article=${log.id}`}
                                    className="log-overview-link"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        onLogClick(log.id)
                                    }}
                                >
                                    <span className="log-overview-title body-text">{log.title}</span>
                                    <span className="log-overview-dotted-line" />
                                    <span className="log-overview-meta">
                                        <span>{formatDate(log.date)}</span>
                                        <span className="log-overview-category-badge">
                                            {CATEGORY_LABELS[log.category] ?? log.category}
                                        </span>
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}
