import { renderMarkdown } from '../utils/markdown'
import { CATEGORY_LABELS } from '../hooks/useLogs'
import type { LogMeta } from '../types'

interface LogEntryProps {
    log: LogMeta
}

function formatDate(dateString: string): string {
    const date = new Date(dateString + 'T00:00:00')
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function LogEntry({ log }: LogEntryProps) {
    const html = renderMarkdown(log.rawContent)

    return (
        <div className="log-entry" id={`log-${log.id}`}>
            <div className="log-entry-header">
                <div className="log-entry-date">{formatDate(log.date)}</div>
                <span className="log-entry-badge">
                    {CATEGORY_LABELS[log.category] ?? log.category}
                </span>
            </div>
            <div
                className="log-entry-content markdown-content"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </div>
    )
}
