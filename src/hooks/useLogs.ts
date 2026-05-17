import { parseFrontmatter } from '../utils/markdown'
import type { LogMeta } from '../types'

// Eagerly import all .md files in src/logs/ as raw strings.
// Adding a new log entry is as simple as dropping a .md file in src/logs/.
const rawFiles = import.meta.glob('../logs/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
}) as Record<string, string>

function filePathToId(filePath: string): string {
    // '../logs/2026-05-10.md' → '2026-05-10'
    return filePath.replace(/^.*\//, '').replace(/\.md$/, '')
}

const allLogs: LogMeta[] = Object.entries(rawFiles)
    .map(([filePath, raw]) => {
        const { attrs, content } = parseFrontmatter(raw)
        return {
            id: filePathToId(filePath),
            title: attrs.title ?? filePathToId(filePath),
            date: attrs.date ?? '1970-01-01',
            category: attrs.category ?? 'snippet',
            rawContent: content,
        }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export const CATEGORY_LABELS: Record<string, string> = {
    all: 'All',
    snippet: 'Snippets',
    'climbing-analysis': 'Climbing Video Analysis',
    'crux-beta-ios': 'Crux & Beta iOS',
    'crux-web': 'Crux Web',
    'boulder-quest': 'Boulder Quest',
}

export function useLogs() {
    return { logs: allLogs, categoryLabels: CATEGORY_LABELS }
}
