import { marked, Renderer } from 'marked'

/**
 * Returns a marked Renderer that opens all links in a new tab.
 */
function getRenderer(): Renderer {
    const renderer = new Renderer()
    const originalLink = renderer.link.bind(renderer)
    renderer.link = (token) => {
        const html = originalLink(token)
        return html.replace(/^<a /, '<a target="_blank" rel="noopener noreferrer" ')
    }
    return renderer
}

/**
 * Parses <!-- key: value --> frontmatter comments out of a markdown string.
 * Returns both the parsed attributes and the content with comments stripped.
 */
export function parseFrontmatter(raw: string): {
    attrs: Record<string, string>
    content: string
} {
    const attrs: Record<string, string> = {}
    const commentRegex = /<!--\s*([^:]+?):\s*(.*?)\s*-->/g
    const content = raw.replace(commentRegex, (_match, key, value) => {
        attrs[key.trim()] = value.trim()
        return ''
    }).trim()
    return { attrs, content }
}

/**
 * Renders markdown content to an HTML string.
 */
export function renderMarkdown(markdown: string): string {
    return marked.parse(markdown, { renderer: getRenderer() }) as string
}
