export interface LogMeta {
    id: string
    title: string
    date: string       // YYYY-MM-DD
    category: string
    rawContent: string // raw markdown (without frontmatter comments)
}

export type LogCategory =
    | 'all'
    | 'snippet'
    | 'climbing-analysis'
    | 'crux-beta-ios'
    | 'crux-web'
    | 'boulder-quest'

export interface ProjectItem {
    id: string          // e.g. CBL-04
    name: string
    href?: string
    description: string
    status: 'early-access' | 'in-development' | 'poc' | 'archived' | null
    imagePath?: string  // relative to public/assets/
}
