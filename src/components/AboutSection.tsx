export function AboutSection() {
    return (
        <div className="grid-cols mb-12">
            <div>
                <h2 id="about">
                    <a href="#about" style={{ textDecoration: 'none', color: 'inherit' }}>
                        About
                    </a>
                </h2>
            </div>
            <div>
                <p className="body-text">
                    Climbing is a form of art, shaped by instinct, refined by decision, and
                    executed through human computation. We build tools for spatial computing
                    and climbing performance, exploring how the body thinks in motion.
                </p>
            </div>
        </div>
    )
}
