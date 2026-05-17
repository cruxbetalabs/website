import type { ProjectItem } from '../types'

export const PROJECTS: ProjectItem[] = [
    {
        id: 'CBL-04',
        name: 'Spray',
        href: 'https://spray.cruxbeta.dev',
        description: 'The operating system for modern rock climbing.',
        status: 'early-access',
        imagePath: '/assets/projects/spray.png',
    },
    {
        id: 'CBL-03',
        name: 'Toolbox',
        href: 'https://github.com/tommyjtl/climbing-analysis-toolbox',
        description: 'Computer vision toolbox for analyzing climbing videos.',
        status: null,
        imagePath: '/assets/projects/toolbox.png',
    },
    {
        id: 'CBL-02',
        name: 'Reconstruct',
        href: 'https://github.com/cruxbetalabs/reconstruct',
        description: 'A tool for climbing pose 3D reconstruction.',
        status: 'poc',
        imagePath: '/assets/projects/reconstruct.png',
    },
    {
        id: 'CBL-05',
        name: 'Replay',
        href: 'https://replay.cruxbeta.dev',
        description: 'A tool for climbing movement analysis.',
        status: 'poc',
        imagePath: '/assets/projects/replay.png',
    },
    {
        id: 'CBL-06',
        name: 'Trace',
        description: 'A tool for frame-by-frame pose overlay & reach simulation.',
        status: 'poc',
    },
    {
        id: 'CBL-07',
        name: 'Beta-1',
        description:
            'A unified model for recognizing climbing poses, contact, and movement from video.',
        status: 'poc',
    },
    {
        id: 'CBL-01',
        name: 'Boulder Quest',
        href: 'https://blog.tjtl.io/climbing-board-game/',
        description: 'A playful bouldering-themed board game.',
        status: 'archived',
        imagePath: '/assets/projects/boulder-quest.png',
    },
]
