import { useState } from 'react'
import logoSvg from '../assets/logo.svg'
import processImg from '../assets/process.jpg'
import contactImg from '../assets/contact.png'

export function Header() {
    const [logoHover, setLogoHover] = useState(false)
    const [logoPos, setLogoPos] = useState({ x: 0, y: 0 })
    const [tommyHover, setTommyHover] = useState(false)
    const [tommyPos, setTommyPos] = useState({ x: 0, y: 0 })
    const OFFSET = 15

    const handleLogoMouseMove = (e: React.MouseEvent) => {
        setLogoPos({ x: e.clientX + OFFSET, y: e.clientY + OFFSET })
    }
    const handleTommyMouseMove = (e: React.MouseEvent) => {
        setTommyPos({ x: e.clientX + OFFSET, y: e.clientY + OFFSET })
    }

    return (
        <>
            {/* Floating hover box – logo */}
            {logoHover && (
                <div
                    className="logo-hover-box"
                    style={{ left: logoPos.x, top: logoPos.y }}
                >
                    <img src={processImg} alt="Process Preview" />
                </div>
            )}

            {/* Floating hover box – Tommy */}
            {tommyHover && (
                <div
                    className="logo-hover-box tommy-hover-box"
                    style={{ left: tommyPos.x, top: tommyPos.y }}
                >
                    <img src={contactImg} alt="Tommy Liu" />
                </div>
            )}

            {/* Row 1: Title */}
            <div className="mb-12">
                <h2>Computational Climbing R&amp;D</h2>
            </div>

            {/* Row 2: Logo + Name */}
            <div className="divider" />
            <div className="grid-cols">
                <div className="flex items-center justify-start">
                    <a
                        href="/"
                        onMouseEnter={() => setLogoHover(true)}
                        onMouseLeave={() => setLogoHover(false)}
                        onMouseMove={handleLogoMouseMove}
                    >
                        <img src={logoSvg} alt="Crux Beta Labs Logo" className="logo-img" />
                    </a>
                </div>
                <div>
                    <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h1>Crux Beta Labs</h1>
                    </a>
                </div>
            </div>

            {/* Row 3: Founder info */}
            <div className="divider" />
            <div className="grid-cols mb-6 md:mb-12">
                <div />
                <div>
                    <p className="caption-text">
                        Founded by{' '}
                        <a
                            href="https://blog.tjtl.io/bouldering-and-computer-vision/"
                            className="underline"
                            target="_blank"
                            rel="noopener noreferrer"
                            onMouseEnter={() => setTommyHover(true)}
                            onMouseLeave={() => setTommyHover(false)}
                            onMouseMove={handleTommyMouseMove}
                        >
                            Tommy Liu
                        </a>
                        . Based in Berkeley, California.
                    </p>
                </div>
            </div>
        </>
    )
}
