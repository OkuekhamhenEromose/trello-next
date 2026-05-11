'use client'

/**
 * Company logos sprite implementation
 * Larger logo scale + cleaner enterprise-style spacing
 */

const SPRITE = '/trello_visa.svg'

interface LogoConfig {
  alt: string
  x: number
  w: number
}

const logos: LogoConfig[] = [
  { alt: 'Visa', x: 0, w: 115 },
  { alt: 'Coinbase', x: 127, w: 198 },
  { alt: 'John Deere', x: 355, w: 135 },
  { alt: 'Zoom', x: 486, w: 131 },
  { alt: 'Grand Hyatt', x: 657, w: 162 },
  { alt: 'Fender', x: 855, w: 105 },
]

/**
 * Increased logo scale for stronger visual presence
 * 80px → 56px rendered height
 */
const SCALE = 0.7

export default function CompanyLogos() {
  const spriteW = Math.round(960 * SCALE)
  const spriteH = Math.round(80 * SCALE)

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto max-w-7xl px-6 lg:px-8">
        <p className="mx-auto mb-14 max-w-3xl text-center text-[17px] leading-7 text-[#172b4d]">
          Join a community of millions of users globally who are using Trello
          to get more done.
        </p>

        {/* Better balanced spacing */}
        <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-10 lg:gap-x-24">
          {logos.map((logo) => {
            const containerW = Math.round(logo.w * SCALE)
            const offsetX = Math.round(logo.x * SCALE)

            return (
              <div
                key={logo.alt}
                role="img"
                aria-label={logo.alt}
                className="
                  relative flex-shrink-0 overflow-hidden
                  opacity-70 transition-all duration-300
                  hover:opacity-100 hover:scale-105
                "
                style={{
                  width: `${containerW}px`,
                  height: `${spriteH}px`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={SPRITE}
                  alt=""
                  aria-hidden="true"
                  draggable="false"
                  style={{
                    position: 'absolute',
                    width: `${spriteW}px`,
                    height: `${spriteH}px`,
                    left: `${-offsetX}px`,
                    top: 0,
                    maxWidth: 'none',
                    display: 'block',
                    userSelect: 'none',
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}