import { useRef, useState } from 'react'
import { CircleArrowRight, Loader, Archive } from 'lucide-react'
import { PROJECTS } from '../data/projects'
import type { ProjectItem } from '../types'

function StatusBadge({ status }: { status: ProjectItem['status'] }) {
    if (!status) return null
    const map: Record<NonNullable<ProjectItem['status']>, { label: string; className: string }> = {
        'early-access': { label: 'Early Access', className: 'badge-early-access' },
        'in-development': { label: 'In Development', className: 'badge-in-development' },
        poc: { label: 'PoC', className: 'badge-poc' },
        archived: { label: 'Archived', className: 'badge-archived' },
    }
    const { label, className } = map[status]
    return <span className={className}>{label}</span>
}

// SVG icon sets using lucide-react
function IconAccessible() {
    return <CircleArrowRight size={14} strokeWidth={2} />
}
function IconInDev() {
    return <Loader size={14} strokeWidth={2} />
}
function IconArchived() {
    return <Archive size={14} strokeWidth={2} />
}

export function ProjectsSection() {
    const gridRef = useRef<HTMLDivElement>(null)
    const leftColRef = useRef<HTMLDivElement>(null)
    const [tooltip, setTooltip] = useState<{
        src: string
        top: number
        left: number
        width: number
    } | null>(null)

    function handleProjectEnter(e: React.MouseEvent<HTMLLIElement>, project: ProjectItem) {
        if (!project.imagePath || window.innerWidth < 1536) return
        const grid = gridRef.current
        const leftCol = leftColRef.current
        if (!grid || !leftCol) return

        const liRect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        const gridRect = grid.getBoundingClientRect()
        const leftColRect = leftCol.getBoundingClientRect()
        const tooltipHeight = liRect.height
        let tooltipTop = liRect.top - gridRect.top
        const maxTop = gridRect.height - tooltipHeight
        tooltipTop = Math.max(0, Math.min(tooltipTop, maxTop))

        setTooltip({
            src: project.imagePath,
            top: tooltipTop,
            left: leftColRect.left - gridRect.left,
            width: leftColRect.width,
        })
    }

    function handleProjectLeave() {
        setTooltip(null)
    }

    return (
        <>
            <div className="divider" />
            <div className="grid-cols mb-12" ref={gridRef} style={{ position: 'relative' }}>
                {/* Left column: heading + legend */}
                <div style={{ display: 'flex', flexDirection: 'column' }} ref={leftColRef}>
                    <h2 id="projects">
                        <a href="#projects" style={{ textDecoration: 'none', color: 'inherit' }}>
                            Projects
                        </a>
                    </h2>

                    {/* Tooltip (replaces position:fixed tooltip with a contained one) */}
                    {tooltip && (
                        <div
                            className="project-image-tooltip"
                            style={{
                                top: tooltip.top,
                                left: tooltip.left,
                                width: tooltip.width,
                                display: 'block',
                            }}
                        >
                            <img src={tooltip.src} alt="Project preview" />
                        </div>
                    )}

                    {/* Status legend – pushed to bottom */}
                    <div className="badge-legend">
                        <p className="caption-text" style={{ marginBottom: '0.5rem' }}>Status:</p>
                        <div className="badge-legend-group icon-legend-group">
                            <div className="badge-legend-item badge-legend-item--large">
                                <IconAccessible /><span>Publicly accessible</span>
                            </div>
                            <div className="badge-legend-item badge-legend-item--large">
                                <IconInDev /><span>In development</span>
                            </div>
                            <div className="badge-legend-item badge-legend-item--large">
                                <IconArchived /><span>Archived</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right column: project list */}
                <div>
                    <ul className="arrow-list space-y-4">
                        {PROJECTS.map((project) => (
                            <li
                                key={project.id}
                                onMouseEnter={(e) => handleProjectEnter(e, project)}
                                onMouseLeave={handleProjectLeave}
                            >
                                <div className="project-header">
                                    {project.href ? (
                                        <a href={project.href} target="_blank" rel="noopener noreferrer">
                                            <p className="body-text inline project-title">
                                                <strong>{project.name}</strong>
                                            </p>
                                        </a>
                                    ) : (
                                        <p className="body-text inline project-title">
                                            <strong>{project.name}</strong>
                                        </p>
                                    )}
                                    <span className="project-dotted-line" />
                                    <StatusBadge status={project.status} />
                                    <span className="project-code-name">{project.id}</span>
                                </div>
                                <p className="caption-text mt-2">{project.description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}
