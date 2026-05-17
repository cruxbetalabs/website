// Markdown parser utilities

/**
 * Configure marked renderer to open links in new tab
 * @returns {marked.Renderer} Configured renderer instance
 */
export function getMarkdownRenderer() {
    const renderer = new marked.Renderer()
    const originalLinkRenderer = renderer.link
    renderer.link = function (href, title, text) {
        const html = originalLinkRenderer.call(this, href, title, text)
        return html.replace(/^<a /, '<a target="_blank" rel="noopener noreferrer" ')
    }
    return renderer
}

/**
 * Parse markdown content to HTML
 * @param {string} markdown - Raw markdown content
 * @returns {string} Parsed HTML content
 */
export function parseMarkdown(markdown) {
    const renderer = getMarkdownRenderer()
    return marked.parse(markdown, { renderer: renderer })
}
