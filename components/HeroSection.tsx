'use client'

import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const gmailLogo = 'data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCADKAPkDASIAAhEBAxEB/8QAHAABAAIDAQEBAAAAAAAAAAAAAAcIAgQGBQMB/8QARBAAAQMCAgQHCwsEAwEAAAAAAAECAwQFBhEHITFhEhNBUXFycwgiMzY3dIGhsbKzFBYjMjQ1QlJWYsGRkpPRJmPw4f/EABwBAQABBQEBAAAAAAAAAAAAAAAGAQMEBQcCCP/EADYRAAIBAgIFCgUEAwEAAAAAAAABAgMEBREGEjFBUSEiMzRhcYGhsdETMnKRwRQVUvAWI+HS/9oADAMBAAIRAxEAPwC5YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB5GMcQUGF8NVt9uT+DT0kfC4KKnCkdsaxufK5yoib1KNpLNnqEJVJKEVm3yI2L5ebTY6Fa28XGloKdFy4yeVGIq8yZ7V3IcjHpi0bvqeITE8KOzy4TqeVrP7lZl6yqOOMV3jGV9kvF5m4Ui5pDC1c46dn5GJyJzrtXap4Rqp4lLW5i5DoNroVS+GncVHrdmWS+6efkX9tVzt12o21lsrqatpnfVlgla9q+lFNsoVhe/3jDN1bc7HXy0VSipwljXvZERfqvbscm3UvOWe0T6aLPipYLTe1itV6dk1qOdlDUu/61XY5fyLr5lUybe9hVerLkZpMX0XuLFOpSevDu5V3rh2rxyJXABmkXAAAAAAAAAAAAAAABjJIyNivke1jE2ucuSIeViC/0doj4L142oVM2RNXX6eZCPLzd626z8ZVS94i95G3Uxvo595G8Z0mtsN/1x58+C3d73d202dlhdW65z5I8fYkOfE1jherHV7HKn5Gucn9UTI27fc6C4Z/I6qOVUTNURdaejaREZ080tPOyeCR0cjFza5q60ItR05uVUzq04uPZnn5t+htp4BT1eZJ59uwmYHkYVu6Xe3JI9EbPGvAlamzPnTcp650a1uad1RjWpPOMlmiNVaUqU3CW1AAF8tgAAAAAAAAAr93X97mZBY8ORPVsUrn1lQifi4PesTozc5elELAlZu6/wDG6x+YP+IYl82qLyJDotTjPE6etuzfkyEAAaA64D8cmaH6ACftD+liutVso7diR81dQo3gtqFVXTQpnkiLyvan9U36kLA2yuo7lQxVtBUxVNNK3hMkjdwmuTpKXWX7rg6v8qddgfGN4wlXcbQS8ZTPdnPSyL9HJv3O3p6c01GVbYlKm9Spyr0IjjWilO6TrWvNnw3P2fl6lrAc7gfGNnxbQrNb5FjqGJ9NTSZJJH6OVN6epdR0RvoTjNa0XmjmtehUoVHTqxyktzAAPRaAAAABo32726x22W43OqZT08aa3OXW5eZE2qu5CjaSzZ6hCU5KMVm2br3NYxXvcjWomaqq6kIi0jaWY4ZXWnC0jJZeFwJa7LNjedI/zL+7ZzZ7U4zSRpKuOKHPoqDjaC07FizThz73qmxP2p6czhIfCs6ye00V7ibacKP39joeCaJKGVe9Wb3R9+Pds457CZZXvkkc+Rznvcuaucuaqu9TELtUHF223mz0lkgAAVOgwBVup7+yH8FQxWOTeiZovqX+pJJFmDvGeh67vdUlM6roRUlKwlF7pPL7J+rIjjsUrlNb17gAExNKAAAAAAAAACs3dgL/AMusfmD/AIhZkr33VEENRiK0xzMRyLRO6U79Sv6KV7/pg8m/wbDDMVp4VcxuaibiuR5beXkK9g2q6gnpO+TOWFPx5a06U/k1SOXNrVtqjp1Y5M7DY39vf0VWt5qUXw/PB9jAAMczDrrL91wdX+VNw07L91wdX+VNwxJbWXFsNi211Zba6Kut9TLS1MS5xyxuyc3/AOc6bFJ30a6VKO88Va8QOjo7ivexzbIp15Oq5ebYvJzEAAv211Ut5Zx2cDVYrg1tidPVqrKS2NbV7rsLnAr1o30p11hbHbb4sldbU1Mk2zQJu/M1ObanIvIT3arjQ3WgjrrdVRVVNKmbJI3Zov8ApdxJba7p3Ec47eBynFcGucMqatVZxexrY/Z9htAET6S9K8FvWS14YfHUViKrZKvU6KLc3kc71Jv2HutXhRjrTZjWGH3F/V+FQjm/JdrZ1uP8dWjCVMrZ3pUXB7c4qNju+dvcv4W719CKV1xdia7YouS1t1n4fBVeJhbqjhTmantXap5dXU1FZUyVVXPJPPK7hSSSO4TnLzqp8iOXd7O4eWyPA6rguj9vhkdb5qm9/hcPVgyh8MzrJ7TEyh8MzrJ7TAlsZv2TGu1QF2qDmJBgAaV2udJbKfjamREVfqMT6zuhP5PdKlOrNQgs29xZr3FK3purVkoxW1s6PB3jNQr+9fdUlMrro8vdZddJ9kSReLgSaTgwtXUn0T9a867yxR17RbDqlhZuFTa3n3ci5PIgNbGqOL1JVaCerHm5vfvz8wACSlsAAAAAAAAAEAd094z2nzJ3vqT+QB3T3jPafMne+ps8I61Hx9DBxHoH4ERKiLtPKr7UrkSSl4LFTbHyO6OZT1gSO9sKF7T1Kyz9V3GFhWMXeFVvi20suK3PvX9a3HJvRWSLG5Mnptau1D8OkraOKqb36ZPyyRybUPCrKaWmfk9O9VdTk2Lu6dxzvFcDr2D1lzocffh6HbdHtLbTGEqb5lX+L3/S9/dtXmdPZfuuDq/ypuGnZfuuDqr7VNwjEtrJetgABQqD38F4tvGE6/5RbZs4XqizUz1+jl6U5F3pr9h4APUJyhLWi8mWa9CnXpunVjnF7mSDpB0o3TEtP8gt8T7Zb3MRJmI/OSVV2ork/DuTby7ckj4A9Va06stabzZas7GhZU/hUI5L+7XvAALZlgyh8MzrJ7TEyh8MzrJ7TzLYyjJjXaoMKiWKGN800jY42Jm5zlyRE5zicRYplqFfTW1VjgXNHS5qj3bdnMnr6NhAcPwyvfz1aS5N73I5ZjOPWmEUteu+c9kVtf8AztPZxFiWC3q+mpcpqpNS/lZ0ryruOEq6ierqFnqZXyyLtc5T5A6NhuFULCGUFnLe9/8AxHEsc0hu8YqZ1XlBbIrYvd9v2yOr0QeUuydrJ8J5Z4rDog8pdk7WT4TyzxJbP5H3m70X6rP6vwgADLJIAAAAAAAAACAO6e8Z7T5k731J/IA7p7xntPmTvfU2eEdaj4+hg4j0D8CIwAS8j4MZY2Sxujkaj2uTJUVM0VDIFGk1kysZOLUovJo7qHR1cfmBbsSWdH1kEkT31FOiZyR5PcmbUT6zdXSm/k5Is9oW8mFl7N/xHnh6StFlHfONudiSKiuS5ufHllFOu/8AK5efYvLznKsVwtKtOVBb3yeO72O0aO6XP4cKN89yyl/69/vxK+g2LjQ1lurZaKvppKapidwZI5EyVq/+5dimuR1pp5M6LGSklKLzTAAB6AAAAB+KqImarkgB+nuYQwxd8SVvF2ym4UUS5zTvzSOJE16158tibV9Z1mjbRdXX5Y7jeklobZqVrFTKWdN2f1W7+XkTlJ1orXb7PZXUFspIqWmjjdwY40yTZt3rvU2dphsq3OqckfNkOx3SqlZp0bbnT47l7vs+/AqzfL3VXeRHPcrINrImrqTevOu/2HmmEPgmdVDMrRoU6EFTprJI+Wbm7rXdV1q8nKT2tgAF0xzq9EHlLsnayfCeWeKw6IPKXZO1k+E8s8bKz+R95OdF+qz+r8IAAyySAAAAAAAAAAgDunvGe0+ZO99SfyAO6e8Z7T5k731NnhHWo+PoYOI9A/AiMAEvI+AAAWr0LeTCy9m/4jzsDjtCvkwsvZyfEediQS66efe/UlNDoo9yObxzgyz4touLrouKqmNygqo0TjI929vOi+pdZXPGeErxhSv+TXKHOJ6/Q1LE+jlTcvIu5dftLYGnebXQXi3yUFzpY6qmk+sx6etOVF3prNTd2ELjlXJL+7ST4JpFXw1qEudT4cO722PzKegkLSToyr8NcZcbYsldaUVVVcs5IE/dzt/cnp5yPSOVaM6MtWayOq2V9QvaSq0JZr07HwAB0eB8G3nFtYsdBFxVKxcpquRF4tm79zv2p6ctp5hCU5asVmy7cXFK3pupVllFb2eJbaGruVbFRUFPJUVMruCyONuaqv8A7lJ10b6KKO08XcsRtirK9FR0cGfCihXkz/M71JyZ7TrsEYNs+E6LiqCHjKl7cpqqRM5JP9JuTV0rrOjN/aYbGnzqnK/JHM8b0qq3edG25sOO9+y8+PAHyrPsk3Zu9h9T5Vn2Sbs3ew2pDpbGU4h8EzqoZmEPgmdVDM0RyJbAAAVOr0QeUuydrJ8J5Z4rDog8pdk7WT4TyzxsrP5H3k50X6rP6vwgADLJIAAAAAAAAACAO6e8Z7T5k731J/IA7p7xntPmTvfU2eEdaj4+hg4j0D8CIwAS8j4AABarQr5MLL2cnxXnYnHaFfJhZezk+K87Egl108+9+pKaHRR7kAAWC6HIjkVFRFRdqKRFpM0TxVay3XC0TIan60lEmTWS86sz1Ndu2dBLoLNehCvHVmjOw/EbjD6vxaEsnvW59jX97CA9HGiitubmXHEsU1DRoubKVU4Ms3W5WN9a7tpOluoqS3UUVFQ08VNTQt4MccbcmtToNgHi3tadvHKK5eJexTF7nEqmtWfItiWxf3iAAZJqwfKs+yTdm72H1PlWfZJuzd7AUlsZTiHwTOqhmYQ+CZ1UMzRHIlsAABU6vRB5S7J2snwnlnisOiDyl2TtZPhPLPGys/kfeTnRfqs/q/CAAMskgAAAAAAAAAIA7p7xntPmTvfUn8gTuoIZEv1mnVv0b6V7Grzqj0VfeT+pssI61Hx9DCxDoH4EPgAmBHgAAC1WhXyX2Xs5PivOxON0J+S2ydk/4jzsiCXXTz736kpodFHuQABYLoAAAAAAAAAPlWfZJuzd7D6nyrPsk3Zu9gKS2MpxD4JnVQzMIfBM6qGZojkS2AAAqdXog8pdk7WT4TyzxWTQ3G+TSXZ+A3PgPke7cnFPTP1oWbNlZ/I+8nOjHVZfV+EAAZZJAAAAAAAAAActpMwfT4ysHyF8vyeqhdxlNNlmjXcqKnK1U1L6F5DqQe6dSVOSnF5NHmcFOLjLYyqlz0Z42oalYXWKeoT8MlOqSNcnPqXV0Lkpq/MDGn6auP8AiLag26xyslyxXn7mueF0+LKlfMDGn6auP+IfMDGn6auP+ItqCv77W/ivMftdPizltEtDWWzR5aKGvp5KapijekkT0yc1eMcuv0Kh1IBp6k3Obk97zNjCOpFRW4AA8HoAAAAAAAAAHzqkVaWVERVVWKiInQfQAo1mVZiwBjJI2ouHa1FRMvqp/sy+YOMv09W/2p/stIDD/Rw4kaWi9t/OXl7FW/mDjL9PVv8Aan+zOLR9jOWVsbcP1SK5cs3K1qJ0qq5IWhA/Rw4lf8Ytv5y8vYj7RLo+XCiSXO5SxzXSePi8o1VWQxqqLwU51XJM13ZJzrIIBlQgoLJG9tranbU1TprJIAA9GQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/Z'
const slackLogo = 'data:image/png;base64,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'
const teamsLogo = 'data:image/png;base64,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'

export default function HeroSection() {
  const router = useRouter()
  const [email, setEmail] = useState('')

  const handleSignUp = () => {
    router.push('/signup')
  }

  return (
    <section className="bg-white overflow-hidden">
      {/* Announcement Banner */}
      <div className="bg-[#0052cc] py-3 text-center">
        <p className="text-sm text-white">
          Accelerate your teams&apos; work with AI features ✨ now available for all Premium and Enterprise!{' '}
          <a href="#" className="underline hover:no-underline font-medium">
            Learn more.
          </a>
        </p>
      </div>

      {/* Hero Body */}
      <div className="relative w-full max-w-[1280px] mx-auto px-6 lg:px-12 xl:px-16">
        <div className="flex flex-col lg:flex-row lg:items-start min-h-[560px]">

          {/* ── LEFT CONTENT ── */}
          <div className="animate-fade-in-up pt-16 lg:pt-20 pb-16 lg:pb-0 flex-shrink-0 w-full lg:w-[44%] xl:w-[42%] z-10">
            <h1
              className="font-extrabold text-[#172b4d] leading-[1.06] mb-5 tracking-tight"
              style={{ fontSize: 'clamp(2rem, 3.6vw, 3.25rem)' }}
            >
              Capture, organize, and tackle your to-dos from anywhere.
            </h1>
            <p className="text-lg text-[#44546f] mb-8 leading-relaxed max-w-[460px]">
              Escape the clutter and chaos—unleash your productivity with Trello.
            </p>

            {/* Email Signup */}
            <div className="flex flex-col sm:flex-row gap-3 mb-3 max-w-[520px]">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="h-12 bg-white border border-[#dfe1e6] rounded text-base flex-1 px-4"
              />
              <Button
                onClick={handleSignUp}
                className="h-12 px-6 bg-[#0052cc] hover:bg-[#0065ff] text-white font-semibold rounded whitespace-nowrap text-sm transition-colors"
              >
                Sign up - it&apos;s free!
              </Button>
            </div>
            <p className="text-sm text-[#6b778c] mb-10">
              By entering my email, I acknowledge the{' '}
              <a href="#" className="text-[#0052cc] hover:underline">
                Atlassian Privacy Policy
              </a>
            </p>

            {/* Watch video */}
            <a
              href="#"
              className="inline-flex items-center gap-3 text-[#0052cc] font-semibold text-sm hover:underline"
            >
              Watch video
              <span className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-[#0052cc]">
                <Play className="w-3 h-3 ml-0.5 fill-[#0052cc] text-[#0052cc]" />
              </span>
            </a>
          </div>

          {/* ── RIGHT CONTENT ── */}
          <div className="relative flex-1 flex justify-center lg:justify-end items-start lg:items-start self-stretch">

            {/* Slash strokes — top-left of phone area, like the real trello */}
            <div className="absolute left-[4%] top-[14%] z-20 hidden lg:block pointer-events-none">
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                <line x1="46" y1="4"  x2="30" y2="28" stroke="#172b4d" strokeWidth="2.8" strokeLinecap="round"/>
                <line x1="34" y1="2"  x2="18" y2="26" stroke="#172b4d" strokeWidth="2.8" strokeLinecap="round"/>
                <line x1="22" y1="0"  x2="6"  y2="24" stroke="#172b4d" strokeWidth="2.8" strokeLinecap="round"/>
              </svg>
            </div>

            {/* Curved arrow — left side pointing right toward phone */}
            <div className="absolute left-[1%] top-[46%] z-20 hidden lg:block pointer-events-none">
              <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
                <path
                  d="M80 18 C50 14, 10 34, 18 74"
                  stroke="#172b4d" strokeWidth="2.4" fill="none" strokeLinecap="round"
                />
                {/* arrowhead */}
                <path d="M12 66 L18 76 L26 68" stroke="#172b4d" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Phone image — large, anchored bottom, slight right offset */}
            <div
              className="relative z-10"
              style={{
                width: 'min(520px, 52vw)',
                marginTop: '100px',
                marginLeft: '50px',
              }}
            >
              <Image
                src="/mobilephone3.png"
                alt="Trello app on mobile"
                width={1600}
                height={1800}
                className="w-full h-auto object-contain object-bottom"
                priority
              />
            </div>

            {/* Floating app icons — right of phone */}
            <div className="absolute right-0 top-[28%] flex flex-col gap-3 z-30">
              {/* Teams */}
              <div
                className="w-[52px] h-[52px] lg:w-[60px] lg:h-[60px] bg-white rounded-2xl flex items-center justify-center p-2 animate-float"
                style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.14)', animationDelay: '0s' }}
              >
                <img src={teamsLogo} alt="Microsoft Teams" className="w-full h-full object-contain" />
              </div>
              {/* Figma-style icon (original site shows a colorful swirl) — use a placeholder ring */}
              <div
                className="w-[52px] h-[52px] lg:w-[60px] lg:h-[60px] bg-white rounded-2xl flex items-center justify-center p-2 animate-float"
                style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.14)', animationDelay: '0.15s' }}
              >
                {/* Colorful swirl proxy */}
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <circle cx="20" cy="20" r="14" fill="none" stroke="#FF7452" strokeWidth="5"/>
                  <circle cx="20" cy="20" r="8"  fill="none" stroke="#36B37E" strokeWidth="4"/>
                  <circle cx="20" cy="20" r="3"  fill="#0052cc"/>
                </svg>
              </div>
              {/* Slack */}
              <div
                className="w-[52px] h-[52px] lg:w-[60px] lg:h-[60px] bg-white rounded-2xl flex items-center justify-center p-2 animate-float"
                style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.14)', animationDelay: '0.3s' }}
              >
                <img src={slackLogo} alt="Slack" className="w-full h-full object-contain" />
              </div>
              {/* Gmail */}
              <div
                className="w-[52px] h-[52px] lg:w-[60px] lg:h-[60px] bg-white rounded-2xl flex items-center justify-center p-2 animate-float"
                style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.14)', animationDelay: '0.45s' }}
              >
                <img src={gmailLogo} alt="Gmail" className="w-full h-full object-contain" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}